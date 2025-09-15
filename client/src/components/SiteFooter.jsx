import React from "react";
import { NavLink } from "react-router-dom";

/** Simple SVG icons that inherit currentColor */
function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13.32 10.09 20.91 2h-1.8l-6.63 7.16L7.7 2H2l8.03 11.53L2 22h1.8l7.04-7.61L16.3 22H22l-8.68-11.91Zm-2.49 2.69-.82-1.15L4.2 3.5h2.66l4.9 6.9.82 1.15 6.17 8.67h-2.66l-5.25-7.34Z"/>
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 12.07C22 6.5 17.52 2 11.93 2 6.35 2 2 6.5 2 12.07 2 17.1 5.66 21.23 10.44 22v-7.02H7.9v-2.9h2.54V9.41c0-2.5 1.5-3.88 3.78-3.88 1.1 0 2.25.2 2.25.2v2.47h-1.27c-1.25 0-1.64.78-1.64 1.58v1.9h2.79l-.45 2.9h-2.34V22C18.34 21.23 22 17.1 22 12.07Z"/>
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5Zm0 2a3.5 3.5 0 1 0 3.5 3.5A3.5 3.5 0 0 0 12 9.5ZM18 6.25a1.25 1.25 0 1 1-1.25 1.25A1.25 1.25 0 0 1 18 6.25Z"/>
    </svg>
  );
}

/**
 * Global footer with real social icons.
 * - "Questions" / "Articles" -> /qa
 * - "Tutorials" -> /tutorials
 * - Social links open in new tab (replace href with your profiles)
 */
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      {/* Explore */}
      <div>
        <h4>Explore</h4>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/qa">Questions</NavLink>
        <NavLink to="/qa">Articles</NavLink>
        <NavLink to="/tutorials">Tutorials</NavLink>
      </div>

      {/* Support */}
      <div>
        <h4>Support</h4>
        <NavLink to="/faqs">FAQs</NavLink>
        <NavLink to="/help">Help</NavLink>
        <NavLink to="/contact">Contact Us</NavLink>
      </div>

      {/* Social */}
      <div>
        <h4>Stay connected</h4>
        <div className="socials">
          {/* Replace href with your real profile URLs */}
          <a
            className="social-link"
            href="https://twitter.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Twitter"
            title="Twitter"
          >
            <TwitterIcon />
          </a>
          <a
            className="social-link"
            href="https://www.facebook.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            title="Facebook"
          >
            <FacebookIcon />
          </a>
          <a
            className="social-link"
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            title="Instagram"
          >
            <InstagramIcon />
          </a>
        </div>
      </div>

      {/* Bottom row */}
      <div className="footer-bottom">
        <div>DEV@Deakin</div>
        <div className="links">
            <NavLink to="/privacy">Privacy Policy</NavLink>
            <NavLink to="/terms">Terms</NavLink>
            <NavLink to="/conduct">Code of Conduct</NavLink>
        </div>
      </div>
    </footer>
  );
}
