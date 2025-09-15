// Stores a minimal user object in memory + localStorage.
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthCtx = createContext({ user: null, setUser: () => {} });

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);

  // Restore from localStorage
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      try { setUserState(JSON.parse(raw)); }
      catch { localStorage.removeItem("user"); }
    }
  }, []);

  // Setter that also syncs to localStorage
  function setUser(next) {
    setUserState(next);
    if (next) localStorage.setItem("user", JSON.stringify(next));
    else localStorage.removeItem("user");
  }

  return <AuthCtx.Provider value={{ user, setUser }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
