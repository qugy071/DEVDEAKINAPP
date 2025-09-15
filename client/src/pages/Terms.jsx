// Terms of Service (short, student-friendly). Customize before publishing.
import React from "react";

export default function Terms() {
  return (
    <section className="card" style={{ maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ marginTop: 0 }}>Terms of Service</h1>
      <p className="small">Last updated: {new Date().toLocaleDateString()}</p>

      <h3>1. Acceptance</h3>
      <p>
        By accessing DEV@Deakin you agree to these Terms and our Privacy Policy. If you do not agree, do not use the
        site.
      </p>

      <h3>2. Accounts</h3>
      <ul>
        <li>You are responsible for your account activity and keeping your credentials secure.</li>
        <li>Provide accurate information and comply with applicable laws.</li>
      </ul>

      <h3>3. Content</h3>
      <ul>
        <li>You own your content. You grant us a non-exclusive license to host, display, and distribute it on the site.</li>
        <li>Do not post illegal, harmful, infringing, or harassing content.</li>
      </ul>

      <h3>4. Acceptable use</h3>
      <ul>
        <li>No spam, scraping, or attempting to break/overload the service.</li>
        <li>Respect others and follow the <a href="/conduct">Code of Conduct</a>.</li>
      </ul>

      <h3>5. Payments & subscriptions</h3>
      <ul>
        <li>Payments are handled by Stripe. Prices and features may change.</li>
        <li>Where applicable, refunds follow our course policy and local law.</li>
      </ul>

      <h3>6. Third-party links</h3>
      <p>Links to third-party sites are provided for convenience; we are not responsible for their content.</p>

      <h3>7. Disclaimer</h3>
      <p>Service is provided “as is” without warranties. Use at your own risk.</p>

      <h3>8. Limitation of liability</h3>
      <p>To the extent permitted by law, we are not liable for indirect or consequential losses.</p>

      <h3>9. Termination</h3>
      <p>We may suspend or terminate accounts that violate these Terms or the law.</p>

      <h3>10. Changes</h3>
      <p>We may update these Terms. Continued use means you accept the updated Terms.</p>
    </section>
  );
}
