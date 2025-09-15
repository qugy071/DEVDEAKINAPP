// server/index.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import Stripe from "stripe";

// AI & rate limit
import OpenAI from "openai";
import rateLimit from "express-rate-limit";

const app = express();

/* ----------------------------------------------------
 * Trust proxy (Render/Netlify sit behind a proxy)
 * Enables correct client IP for rate limiting, etc.
 * ---------------------------------------------------- */
app.set("trust proxy", 1);

/* ----------------------------------------------------
 * CORS with allow-list (set in env: ALLOWED_ORIGINS)
 * Example:
 *   ALLOWED_ORIGINS=https://your-site.netlify.app,http://localhost:5173
 * If not provided, we allow all origins (easier for local dev).
 * ---------------------------------------------------- */
const allowList = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, cb) {
    // Allow requests without an Origin header (health checks, curl, etc.)
    if (!origin) return cb(null, true);
    if (allowList.length === 0 || allowList.includes(origin)) return cb(null, true);
    cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight for all routes
app.use(express.json());             // parse JSON bodies

/* ----------------------------------------------------
 * Stripe (payments)
 * ---------------------------------------------------- */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

/* ----------------------------------------------------
 * OpenAI (chatbot)
 * ---------------------------------------------------- */
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL || "gpt-5-nano";

// Some low-cost models have fixed temperature (==1). Do not set temperature for them.
const FIXED_TEMP_MODELS = new Set(["gpt-5-nano"]);
const canTuneTemp = (m) => !FIXED_TEMP_MODELS.has(m);

// Simple per-IP rate limiter for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

/* ----------------------------------------------------
 * Health checks
 * ---------------------------------------------------- */
app.get("/", (_req, res) => {
  res.json({ ok: true, service: "DEV@Deakin server", time: new Date().toISOString() });
});

// Provide both to survive rewrites/proxies
app.get(["/health", "/api/health"], (_req, res) => {
  res.json({ ok: true, service: "DEV@Deakin server", time: new Date().toISOString() });
});

/* ----------------------------------------------------
 * Payments: create PaymentIntent
 * Keep backward compatibility for old path.
 * New path: /api/create-payment-intent
 * ---------------------------------------------------- */
async function handleCreatePaymentIntent(req, res) {
  try {
    const { amount, currency = "aud", plan = "premium" } = req.body;

    // Server-side allow-list to avoid arbitrary amounts from the client
    const allowlist = { premium: 999, pro: 1999 };
    const finalAmount = Number.isFinite(amount) ? amount : allowlist[plan];
    if (!finalAmount || finalAmount <= 0) {
      return res.status(400).json({ error: "Invalid amount or plan." });
    }

    const intent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency,
      automatic_payment_methods: { enabled: true },
      description: `DEV@Deakin ${plan} subscription`,
      metadata: { plan },
    });

    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    console.error("[Stripe Error]", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}
app.post("/create-payment-intent", handleCreatePaymentIntent);   // legacy
app.post("/api/create-payment-intent", handleCreatePaymentIntent);

/* ----------------------------------------------------
 * Resend helper (send emails via REST).
 * Use a verified sender for production.
 * For testing you can use: FROM_EMAIL="DEV@Deakin <onboarding@resend.dev>"
 * ---------------------------------------------------- */
async function sendResendEmail(payload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Missing RESEND_API_KEY");

  // Node 18+ has global fetch
  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await resp.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* ignore parse error */ }

  if (!resp.ok) {
    const reason = json?.error?.message || text || `HTTP ${resp.status}`;
    throw new Error(reason);
  }
  return { id: json?.id, body: json ?? text };
}

/* ----------------------------------------------------
 * Newsletter subscribe
 * ---------------------------------------------------- */
app.post("/api/subscribe", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim();
    const source = String(req.body?.source || "navbar");

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const from = process.env.FROM_EMAIL; // e.g., 'DEV@Deakin <onboarding@resend.dev>'
    if (!from) return res.status(500).json({ error: "Missing FROM_EMAIL" });

    const { id } = await sendResendEmail({
      from,
      to: [email],
      subject: "Welcome to DEV@Deakin 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6; color:#0b1420;">
          <h2 style="margin:0 0 8px;">Welcome!</h2>
          <p>Thanks for subscribing with <strong>${email}</strong>.</p>
          <p style="opacity:.8;">Source: <code>${source}</code></p>
          <p>Enjoy exploring DEV@Deakin!</p>
        </div>
      `,
    });

    console.log("[Subscribe] Resend message id:", id);
    res.json({ ok: true, messageId: id });
  } catch (e) {
    console.error("[Subscribe Error]", e);
    res.status(502).json({ error: e.message || "Email API failed" });
  }
});

/* ----------------------------------------------------
 * Contact form -> forward to your inbox via Resend
 * ---------------------------------------------------- */
app.post("/api/contact", async (req, res) => {
  try {
    const { name = "", email = "", subject = "", message = "" } = req.body || {};

    if (!name.trim() || !email.trim() || !message.trim()) {
      return res.status(400).json({ error: "Missing required fields." });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const from = process.env.FROM_EMAIL; // verified sender
    const to = process.env.CONTACT_TO_EMAIL || process.env.FALLBACK_TO_EMAIL || from;
    if (!from || !to) {
      return res.status(500).json({ error: "Missing FROM_EMAIL or CONTACT_TO_EMAIL" });
    }

    const subj = subject.trim() ? subject.trim() : "New contact message";
    const safeMsg = String(message).replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const { id } = await sendResendEmail({
      from,
      to: [to],
      reply_to: email, // supported by Resend
      subject: `[Contact] ${subj}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.65; color:#0b1420;">
          <p style="margin:0 0 6px;">From: <strong>${name}</strong> &lt;${email}&gt;</p>
          <p style="margin:0 0 12px; opacity:.8;">Subject: ${subj}</p>
          <div style="white-space:pre-wrap; background:#f7fafc; padding:12px 14px; border-radius:10px; border:1px solid #e5e7eb;">
            ${safeMsg}
          </div>
        </div>
      `,
      text: `From: ${name} <${email}>\nSubject: ${subj}\n\n${message}\n`,
    });

    console.log("[Contact] Resend message id:", id, "to:", to);
    res.json({ ok: true, messageId: id });
  } catch (err) {
    console.error("[Contact Error]", err);
    res.status(502).json({ error: err.message || "Email API failed" });
  }
});

/* ----------------------------------------------------
 * AI: non-streaming chat
 * body: { messages: [{ role:"user"|"assistant"|"system", content:string }, ...] }
 * ---------------------------------------------------- */
app.post("/api/ai/chat", aiLimiter, async (req, res) => {
  try {
    const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const system = {
      role: "system",
      content:
        "You are a helpful assistant for the DEV@Deakin website. " +
        "Be concise, use markdown when helpful, and avoid private data.",
    };

    const params = { model: MODEL, messages: [system, ...messages] };
    if (canTuneTemp(MODEL)) params.temperature = 0.6;

    const out = await openai.chat.completions.create(params);
    const reply = out.choices?.[0]?.message?.content || "";
    res.json({ ok: true, model: MODEL, reply });
  } catch (err) {
    console.error("[AI Chat Error]", err);
    res.status(502).json({ ok: false, error: err.message || "AI error" });
  }
});

/* ----------------------------------------------------
 * AI: streaming chat (Server-Sent style text chunks)
 * body: { messages: [...] }
 * ---------------------------------------------------- */
app.post("/api/ai/chat-stream", aiLimiter, async (req, res) => {
  try {
    const incoming = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const base = [
      {
        role: "system",
        content:
          "You are a helpful assistant for the DEV@Deakin website. " +
          "Be concise, use markdown when helpful, and avoid private data.",
      },
      ...incoming,
    ];

    // Prepare chunked response
    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    });

    const params = { model: MODEL, messages: base, stream: true };
    if (canTuneTemp(MODEL)) params.temperature = 0.6;

    const stream = await openai.chat.completions.create(params);
    for await (const chunk of stream) {
      const token = chunk.choices?.[0]?.delta?.content || "";
      if (token) res.write(token);
    }
    res.end();
  } catch (err) {
    console.error("[AI Stream Error]", err);
    try { res.write("\n\n[error] " + (err.message || "stream failed")); } catch {}
    res.end();
  }
});

/* ----------------------------------------------------
 * Start server
 * ---------------------------------------------------- */
const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`> Server running on http://localhost:${PORT}`);
});
