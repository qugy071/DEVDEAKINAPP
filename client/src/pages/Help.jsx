// Lightweight help hub: quick links + tips.
import React from "react";

export default function Help() {
  return (
    <section className="help-page" style={{ display:"grid", gap:14 }}>
      <header style={{ textAlign:"center" }}>
        <h1>Help</h1>
        <p className="small">Find quick answers and useful resources.</p>
      </header>

      <div className="grid">
        <article className="card">
          <h3 style={{marginTop:0}}>Getting started</h3>
          <ol>
            <li>Sign up or log in.</li>
            <li>Browse <strong>Questions &amp; Articles</strong>.</li>
            <li>Subscribe using the navbar form.</li>
          </ol>
        </article>

        <article className="card">
          <h3 style={{marginTop:0}}>Account &amp; payments</h3>
          <ul>
            <li>Update profile on the Login/Account page.</li>
            <li>Payments are handled via Stripe on the Pay page.</li>
          </ul>
        </article>

        <article className="card">
          <h3 style={{marginTop:0}}>Still need help?</h3>
          <p>Reach us via the contact form. We usually reply within 1–2 business days.</p>
          <a className="btn" href="/contact">Go to Contact Us</a>
        </article>
      </div>
    </section>
  );
}
