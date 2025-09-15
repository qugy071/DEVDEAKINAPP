// Simple Privacy Policy page (non-legal advice). Customize as needed.
import React from "react";

export default function Privacy() {
  return (
    <section className="card" style={{ maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ marginTop: 0 }}>Privacy Policy</h1>
      <p className="small">Last updated: {new Date().toLocaleDateString()}</p>

      <h3>1. What we collect</h3>
      <ul>
        <li>Account info you provide (e.g., email, name).</li>
        <li>Content you post (questions, articles, images).</li>
        <li>Technical data (device, browser, IP, cookies).</li>
      </ul>

      <h3>2. How we use data</h3>
      <ul>
        <li>Provide and improve DEV@Deakin services.</li>
        <li>Send transactional emails (welcome, contact replies).</li>
        <li>Protect against fraud, abuse, and misuse.</li>
      </ul>

      <h3>3. Payments</h3>
      <p>
        Payments are processed by <strong>Stripe</strong>. Your card details are handled by Stripe and do not touch our
        servers.
      </p>

      <h3>4. Files & images</h3>
      <p>
        Images you upload may be stored in <strong>Firebase Storage</strong>. Do not upload confidential or illegal
        content.
      </p>

      <h3>5. Cookies</h3>
      <p>
        We use cookies/localStorage for things like session state and theme. You can block cookies in your browser, but
        some features may stop working.
      </p>

      <h3>6. Data retention</h3>
      <p>
        We keep data as long as needed for the purposes above or as required by law. You may request deletion of your
        account content subject to reasonable verification.
      </p>

      <h3>7. Third-party services</h3>
      <p>We rely on providers such as Stripe, Firebase, and Resend. Their processing is governed by their policies.</p>

      <h3>8. Your rights</h3>
      <p>
        You can request access, correction, or deletion of your personal data. Contact us via the <a href="/contact">Contact
        Us</a> page.
      </p>

      <h3>9. Changes</h3>
      <p>We may update this policy. Material changes will be highlighted on this page.</p>
    </section>
  );
}
