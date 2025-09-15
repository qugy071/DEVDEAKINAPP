// client/src/pages/Signup.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  collection, getDocs, query, where, addDoc, serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import bcrypt from "bcryptjs";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import AuthSplitLayout from "../components/AuthSplitLayout";
import AuthCard from "../components/AuthCard";
import "./login.scoped.css"; // reuse the same scoped styles

// simple schema for sign up
const schema = z.object({
  firstName: z.string().min(1, "please enter your first name"),
  lastName: z.string().min(1, "please enter your last name"),
  email: z.string().email("please enter a valid email address"),
  password: z.string().min(6, "password requires at least 6 characters"),
  confirm: z.string().min(1, "please confirm your password"),
}).refine((d) => d.password === d.confirm, {
  message: "passwords do not match",
  path: ["confirm"],
});

export default function Signup() {
  const { setUser } = useAuth();
  const nav = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values) {
    setSubmitting(true);
    try {
      const { firstName, lastName, email, password } = values;

      // 1) unique email check
      const existsQ = query(collection(db, "users"), where("email", "==", email));
      const existsSnap = await getDocs(existsQ);
      if (!existsSnap.empty) {
        throw new Error("This email is already registered");
      }

      // 2) hash password on client (keeps consistent with your 9.1c flow)
      const passwordHash = await bcrypt.hash(password, 10);

      // 3) create user doc
      const ref = await addDoc(collection(db, "users"), {
        firstName, lastName, email, passwordHash, createdAt: serverTimestamp(),
      });

      // 4) persist user to context/localStorage
      setUser({ id: ref.id, email, firstName, lastName });

      // 5) go home (change to another route if you want)
      nav("/", { replace: true });
    } catch (e) {
      alert(e.message || "Sign up failed, please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthSplitLayout
      subtitle={
        <>
          <h1 style={{margin:0, fontSize:32, fontWeight:800, color:"#111827"}}>CREATE ACCOUNT</h1>
          <p style={{margin:"6px 0 20px", color:"#6b7280"}}>Join DEV@Deakin today</p>
        </>
      }
    >
      <AuthCard title="DEV@Deakin" description="Fill in your details to create an account.">
        <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-row">
            <label className="label" htmlFor="su-first">first name</label>
            <input id="su-first" className={`input ${errors.firstName ? "invalid" : ""}`} {...register("firstName")} placeholder="Steven"/>
            {errors.firstName && <div className="error">{errors.firstName.message}</div>}
          </div>

          <div className="form-row">
            <label className="label" htmlFor="su-last">last name</label>
            <input id="su-last" className={`input ${errors.lastName ? "invalid" : ""}`} {...register("lastName")} placeholder="Qu"/>
            {errors.lastName && <div className="error">{errors.lastName.message}</div>}
          </div>

          <div className="form-row">
            <label className="label" htmlFor="su-email">email</label>
            <input id="su-email" type="email" className={`input ${errors.email ? "invalid" : ""}`} {...register("email")} placeholder="name@example.com"/>
            {errors.email && <div className="error">{errors.email.message}</div>}
          </div>

          <div className="form-row">
            <label className="label" htmlFor="su-pass">password</label>
            <input id="su-pass" type="password" className={`input ${errors.password ? "invalid" : ""}`} {...register("password")} placeholder="••••••••"/>
            {errors.password && <div className="error">{errors.password.message}</div>}
          </div>

          <div className="form-row">
            <label className="label" htmlFor="su-confirm">confirm password</label>
            <input id="su-confirm" type="password" className={`input ${errors.confirm ? "invalid" : ""}`} {...register("confirm")} placeholder="••••••••"/>
            {errors.confirm && <div className="error">{errors.confirm.message}</div>}
          </div>

          <div className="actions">
            <button className="btn" disabled={submitting} type="submit">
              {submitting ? "creating…" : "Create your account"}
            </button>
            <Link className="btn btn-secondary" to="/login">Back to login</Link>
          </div>
        </form>
      </AuthCard>
    </AuthSplitLayout>
  );
}
