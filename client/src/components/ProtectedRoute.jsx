// src/components/ProtectedRoute.jsx
// Tiny route guard: redirect to /login if there's no user.
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) {
    // remember where user wanted to go
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  }
  return children;
}
