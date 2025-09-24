// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Plans from "./pages/Plans.jsx";
import Pay from "./pages/Pay.jsx";
import Post from "./pages/Post.jsx";
import NewsletterNav from "./components/NewsletterNav.jsx";
import Login from "./pages/Login.jsx";
import Tutorials from "./pages/Tutorials.jsx";
import logo from "./assets/deakindev-logo.png";
import SiteFooter from "./components/SiteFooter.jsx";
import { AuthProvider } from "./state/AuthContext.jsx"; // global auth provider
import QA from "./pages/QA.jsx";
import QADetail from "./pages/QADetail.jsx";
import FAQs from "./pages/FAQs.jsx";
import Help from "./pages/Help.jsx";
import Contact from "./pages/Contact.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import CodeOfConduct from "./pages/CodeOfConduct.jsx";
import ChatWidget from "./components/ChatWidget.jsx";
import Signup from "./pages/Signup.jsx";

// 🆕 import the route guard
import ProtectedRoute from "./components/ProtectedRoute.jsx";

/**
 * App renders navbar, routes and footer.
 * Footer sits at the real page bottom (non-fixed).
 * Theme toggles via a data attribute on <html>.
 */
export default function App() {
  // Read theme from localStorage or default to "light"
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  // Apply theme to <html> so CSS variables switch globally
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isDark = theme === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    // AuthProvider wraps the whole app so ProtectedRoute can read user state
    <AuthProvider>
      {/* layout-shell ensures the footer naturally stays at the bottom */}
      <div className="layout-shell">
        <nav className="nav">
          <div className="nav-left">
            {/* brand logo */}
            <img className="logo" src={logo} alt="DEV@Deakin Logo" />
            <div className="nav-links">
              <NavLink to="/">DEV@Deakin</NavLink>
              <NavLink to="/plans">Plans</NavLink>
              <NavLink to="/pay">Pay</NavLink>
              <NavLink to="/post">Post</NavLink>
              <NavLink to="/qa">Question&Articles</NavLink>
              <NavLink to="/tutorials">Tutorial</NavLink>
            </div>
          </div>

          {/* newsletter signup centered in navbar */}
          <div className="nav-center">
            <NewsletterNav />
          </div>

          {/* login + theme on the right (button text切换放到后续再做) */}
          <div className="login-link">
            <NavLink to="/login" className="btn-login">Log in</NavLink>
          </div>
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            <span>{isDark ? "🌙" : "☀️"}</span>
            <span style={{ fontWeight: 700 }}>{isDark ? "Dark" : "Light"}</span>
          </button>
        </nav>

        {/* main grows to take remaining height; footer sits after it */}
        <main className="layout-main">
          <div className="container">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/help" element={<Help />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/conduct" element={<CodeOfConduct />} />

              {/* ✅ Protected routes: only accessible when user exists in AuthContext.
                  If not logged in, ProtectedRoute redirects to /login and
                  keeps the "from" pathname in state. */}
              <Route
                path="/pay"
                element={
                  <ProtectedRoute>
                    <Pay />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/post"
                element={
                  <ProtectedRoute>
                    <Post />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/qa"
                element={
                  <ProtectedRoute>
                    <QA />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/qa/:mode/:id"
                element={
                  <ProtectedRoute>
                    <QADetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/qa/:id"
                element={
                  <ProtectedRoute>
                    <QADetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tutorials"
                element={
                  <ProtectedRoute>
                    <Tutorials />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </main>

        <ChatWidget />
        <SiteFooter />
      </div>
    </AuthProvider>
  );
}
