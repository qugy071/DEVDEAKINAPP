// Simple FAQ accordion with client-only state.
import React, { useState } from "react";
import "./faqs.scoped.css";

const FAQS = [
  {
    q: "How do I create an account?",
    a: "Click the “Log in” button in the navbar and choose Create your account. You can also use social login if enabled.",
  },
  {
    q: "How do I submit a question or article?",
    a: "Go to Question&Articles. Pick a tab (Questions / Articles), fill the form, and submit. Image upload is supported.",
  },
  {
    q: "How is payment handled?",
    a: "Payments are processed securely via Stripe. Your card details never touch our servers.",
  },
  {
    q: "Where can I report a bug or ask for help?",
    a: "Use the Contact Us page. Your message will be emailed to the site admins.",
  },
];

export default function FAQs() {
  const [open, setOpen] = useState(0); // open index

  return (
    <section className="faqs">
      <header className="faqs__header">
        <h1>FAQs</h1>
        <p className="small">Common questions about DEV@Deakin.</p>
      </header>

      <ul className="faqs__list">
        {FAQS.map((item, i) => {
          const active = open === i;
          return (
            <li key={i} className={`faq card ${active ? "is-open" : ""}`}>
              <button
                className="faq__head"
                onClick={() => setOpen(active ? -1 : i)}
                aria-expanded={active}
              >
                <span className="faq__q">{item.q}</span>
                <span className="faq__chev" aria-hidden>▾</span>
              </button>
              {active && <div className="faq__body">{item.a}</div>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
