// src/pages/Login.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import bcrypt from "bcryptjs";
import { Link, useNavigate, useLocation } from "react-router-dom"; // 🆕 useLocation
import { useAuth } from "../state/AuthContext";
import AuthSplitLayout from "../components/AuthSplitLayout";
import AuthCard from "../components/AuthCard";
import { signOutWithRedirect } from "../auth/signOut";
import "./login.scoped.css";

const schema = z.object({
  email: z.string().email("please enter a valid email address"),
  password: z.string().min(1, "please enter your password"),
});

export default function Login() {
  const { user, setUser } = useAuth();
  const nav = useNavigate();
  const loc = useLocation(); // 🆕 read where user came from (set by ProtectedRoute)

  const [showPwd, setShowPwd] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  // same Firestore + bcrypt flow as 9.1c
  const onSubmit = async ({ email, password }) => {
    // 1) lookup by email
    const q = query(collection(db, "users"), where("email", "==", email));
    const snap = await getDocs(q);
    if (snap.empty) throw new Error("Invalid email or password");

    // 2) verify password hash
    const doc = snap.docs[0];
    const data = doc.data();
    const ok = await bcrypt.compare(password, data.passwordHash);
    if (!ok) throw new Error("Invalid email or password");

    // 3) persist to context/localStorage
    setUser({
      id: doc.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    // 4) 🆕 smart redirect:
    // If user was stopped by a ProtectedRoute, it will set state.from to the original path.
    // After successful login, send them back there; otherwise go home.
    const redirectTo = (loc.state && loc.state.from) || "/";
    nav(redirectTo, { replace: true });
  };

  return (
    <AuthSplitLayout
      subtitle={
        <>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: "#111827" }}>
            LOGIN
          </h1>
          <p style={{ margin: "6px 0 20px", color: "#6b7280" }}>
            Welcome Back! Sign in to your account
          </p>

          {/* Small sign-out block (same as 9.1c) */}
          {user && (
            <div style={{ margin: "8px 0 6px" }}>
              <small>
                You are logged in as <strong>{user.email}</strong>
              </small>{" "}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => signOutWithRedirect(() => setUser(null))}
              >
                Sign out
              </button>
            </div>
          )}
        </>
      }
    >
      <AuthCard
        title="DEV@Deakin"
        description="Please enter your email and password to continue."
      >
        <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-row">
            <label className="label" htmlFor="login-email">
              email
            </label>
            <input
              id="login-email"
              className={`input ${errors.email ? "invalid" : ""}`}
              type="email"
              placeholder="name@example.com"
              {...register("email")}
            />
            {errors.email && <div className="error">{errors.email.message}</div>}
          </div>

          <div className="form-row">
            <label className="label" htmlFor="login-password">
              password
            </label>
            <div className="input-wrap">
              <input
                id="login-password"
                className={`input ${errors.password ? "invalid" : ""}`}
                type={showPwd ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
              />
              <button
                type="button"
                aria-label={showPwd ? "hide your password" : "show your password"}
                className="eye"
                onClick={() => setShowPwd((s) => !s)}
              >
                {showPwd ? "👀" : "🫣"}
              </button>
            </div>
            {errors.password && <div className="error">{errors.password.message}</div>}
          </div>

          <div className="actions">
            <button className="btn" disabled={isSubmitting} type="submit">
              {isSubmitting ? "log in…" : "SUBMIT"}
            </button>
            <Link className="btn btn-secondary" to="/signup">
              Create your account
            </Link>
          </div>
        </form>
      </AuthCard>
    </AuthSplitLayout>
  );
}
