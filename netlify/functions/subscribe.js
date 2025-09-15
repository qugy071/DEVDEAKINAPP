// netlify/functions/subscribe.js
// Serverless function to send a welcome email via Resend.
// Lives on the server side. API keys are never exposed to the browser.

export async function handler(event) {
  // Only accept POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const email = String(body.email || "").trim();
    const source = String(body.source || "navbar");

    // Basic email validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid email" }),
      };
    }

    // Read secrets from environment (set in local .env)
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.FROM_EMAIL; // e.g. 'DEV@Deakin <no-reply@yourdomain.com>'
    if (!apiKey || !from) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing server env" }),
      };
    }

    // Call Resend REST API
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
      }),
    });

    if (!resp.ok) {
      const detail = await resp.text().catch(() => "");
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "Email API failed", detail }),
      };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", detail: err.message }),
    };
  }
}
