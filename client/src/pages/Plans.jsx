import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Plans page shows Free vs Premium.
 * Cards carry a subtle neon flowing border via global CSS.
 */
export default function Plans() {
  const navigate = useNavigate();

  return (
    <div className="grid">
      <div className="card">
        <h2>Free</h2>
        <ul>
          <li>Read posts</li>
          <li>Basic themes</li>
          <li>Community access</li>
        </ul>
        <p className="small">Perfect to get started.</p>
      </div>

      <div className="card">
        <h2>Premium</h2>
        <ul>
          <li>Custom banners & themes</li>
          <li>Content controls</li>
          <li>Analytics dashboard</li>
          <li>Priority support</li>
        </ul>
        <p className="small">Everything you need to level up.</p>
        <button className="btn" onClick={() => navigate("/pay")}>
          Choose Premium → Pay
        </button>
      </div>
    </div>
  );
}
