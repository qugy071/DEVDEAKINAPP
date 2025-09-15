// Contact form -> POST /api/contact (server will email via Resend)
import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [status, setStatus] = useState({ sending:false, ok:null, msg:"" });

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ sending:false, ok:false, msg:"Please fill the required fields." });
      return;
    }
    try {
      setStatus({ sending:true, ok:null, msg:"" });
      const res = await fetch("/api/contact", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Request failed");
      setStatus({ sending:false, ok:true, msg:"Message sent. We will get back to you soon." });
      setForm({ name:"", email:"", subject:"", message:"" });
    } catch (err) {
      setStatus({ sending:false, ok:false, msg: err.message || "Failed to send." });
    }
  }

  return (
    <section className="card" style={{ maxWidth:720, margin:"0 auto" }}>
      <h1 style={{ marginTop:0 }}>Contact Us</h1>
      <p className="small" style={{ marginTop: -6 }}>Send us a message and we’ll reply via email.</p>

      <form onSubmit={onSubmit} className="grid" style={{ gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <label>
          <span className="small">Name *</span>
          <input className="input" name="name" value={form.name} onChange={onChange} placeholder="Your name" />
        </label>
        <label>
          <span className="small">Email *</span>
          <input className="input" type="email" name="email" value={form.email} onChange={onChange} placeholder="you@example.com" />
        </label>
        <label className="grid-span-2">
          <span className="small">Subject</span>
          <input className="input" name="subject" value={form.subject} onChange={onChange} placeholder="How can we help?" />
        </label>
        <label className="grid-span-2">
          <span className="small">Message *</span>
          <textarea className="input" rows={6} name="message" value={form.message} onChange={onChange} placeholder="Write your message…" />
        </label>

        <div className="grid-span-2" style={{ display:"flex", gap:10, alignItems:"center" }}>
          <button className="btn" type="submit" disabled={status.sending}>
            {status.sending ? "Sending…" : "Send message"}
          </button>
          {status.msg && (
            <span className="small" style={{ color: status.ok ? "var(--brand)" : "tomato" }}>
              {status.msg}
            </span>
          )}
        </div>
      </form>
    </section>
  );
}
