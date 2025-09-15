// src/components/NewsletterNav.jsx
import React, { useState } from "react";

export default function NewsletterNav() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const API = import.meta.env.VITE_API_BASE_URL;

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    const ok = /^\S+@\S+\.\S+$/.test(email);
    if (!ok) {
      setMsg("Please enter a valid email.");
      return;
    }
    try {
      setBusy(true);
      const res = await fetch("/api/subscribe", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, source: "navbar" }),
});
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to subscribe");
      setMsg("Welcome! Check your inbox for the email.");
      setEmail("");
    } catch (err) {
      setMsg(err.message || "Subscribe failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="nav-newsletter" onSubmit={onSubmit} aria-label="Newsletter subscribe">
      <span className="nav-newsletter-label">SIGN UP</span>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={busy}
        aria-label="Email address"
      />
      <button type="submit" disabled={busy}>
        {busy ? "Sending..." : "Subscribe"}
      </button>
      {!!msg && <span className="nav-newsletter-msg">{msg}</span>}
    </form>
  );
}
