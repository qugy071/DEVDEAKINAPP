// Community Code of Conduct (concise). Keep it visible and friendly.
import React from "react";

export default function CodeOfConduct() {
  return (
    <section className="card" style={{ maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ marginTop: 0 }}>Code of Conduct</h1>
      <p className="small">Last updated: {new Date().toLocaleDateString()}</p>

      <h3>Our values</h3>
      <ul>
        <li>Be respectful and inclusive. Assume good intent.</li>
        <li>Be helpful. Share knowledge constructively.</li>
        <li>Be honest. Give credit and cite sources.</li>
      </ul>

      <h3>Unacceptable behavior</h3>
      <ul>
        <li>Harassment, personal attacks, hate speech.</li>
        <li>Spam, scams, or commercial solicitation without permission.</li>
        <li>Illegal content or attempts to compromise security.</li>
      </ul>

      <h3>Reporting</h3>
      <p>
        If you experience or witness a violation, please report it via the <a href="/contact">Contact Us</a> page with
        details and evidence if possible.
      </p>

      <h3>Enforcement</h3>
      <p>
        We may warn, remove content, or suspend accounts that violate this Code. Serious or repeated violations may
        result in permanent bans.
      </p>
    </section>
  );
}
