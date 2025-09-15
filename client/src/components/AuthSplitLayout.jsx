import { Link } from "react-router-dom";
import bgImg from "../assets/auth-left.jpg";
import logo from "../assets/deakindev-logo.png";

export default function AuthSplitLayout({ children, subtitle }) {
  return (
    <div className="auth-page auth-split">
      {/* left side with image */}
      <aside
        className="auth-split__left"
        style={{ background: `#0b1221 url(${bgImg}) center/cover no-repeat` }}
      >
        <div className="auth-split__overlay" />
        <div className="auth-split__caption">
          <h3>Enjoy your web developing in Deakin!</h3>
          <p>
            Join our community of forward-thinking students solving real-world problems
            through innovation and cutting-edge technology.
          </p>
          <small>DEAKIN UNIVERSITY · DEV DEAKIN</small>
        </div>
      </aside>

      {/* right panel */}
      <main className="auth-split__right">
        <Link to="/" className="auth-split__logo" aria-label="DEV@Deakin Home">
          <img src={logo} alt="DEV@Deakin" />
        </Link>
        <div className="auth-split__panel">
          {subtitle ? <div className="auth-split__subtitle">{subtitle}</div> : null}
          {children}
        </div>
      </main>
    </div>
  );
}
