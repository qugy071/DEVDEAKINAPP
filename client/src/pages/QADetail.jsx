// client/src/pages/QADetail.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

/** Try read from a collection; return { ok, data } */
async function tryRead(coll, id) {
  const snap = await getDoc(doc(db, coll, id));
  return snap.exists() ? { ok: true, data: snap.data() } : { ok: false, data: null };
}

export default function QADetail() {
  const params = useParams();
  const modeParam = params.mode; // "question" | "article" | undefined
  const id = params.id || params.mode === "question" || params.mode === "article" ? params.id : params.mode;

  const navigate = useNavigate();
  const [state, setState] = useState({ loading: true, data: null, mode: "question" });

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        if (modeParam === "article" || modeParam === "question") {
          const coll = modeParam === "article" ? "articles" : "questions";
          const r = await tryRead(coll, id);
          if (!alive) return;
          setState({ loading: false, data: r.ok ? r.data : null, mode: modeParam });
          return;
        }
        let r = await tryRead("questions", id);
        if (!alive) return;
        if (r.ok) {
          setState({ loading: false, data: r.data, mode: "question" });
          return;
        }
        r = await tryRead("articles", id);
        if (!alive) return;
        setState({ loading: false, data: r.ok ? r.data : null, mode: "article" });
      } catch (e) {
        if (!alive) return;
        console.error(e);
        setState({ loading: false, data: null, mode: "question" });
      }
    }
    load();
    return () => { alive = false; };
  }, [modeParam, id]);

  if (state.loading) return <div style={{ padding: 16 }}>Loading…</div>;

  if (!state.data) {
    return (
      <section className="card" style={{ maxWidth: 860, margin: "16px auto" }}>
        <p style={{ marginTop: 0 }}>Sorry, this item was not found.</p>
        <button className="btn" onClick={() => navigate("/qa")}>← Back to list</button>
      </section>
    );
  }

  const d = state.data;
  const ts = d.createdAt?.toDate ? d.createdAt.toDate().toLocaleString() : "";

  return (
    <section className="card" style={{ maxWidth: 860, margin: "16px auto" }}>
      <button className="btn" onClick={() => navigate("/qa")} style={{ marginBottom: 12 }}>
        ← Back
      </button>

      <h2 style={{ marginTop: 0 }}>{d.title}</h2>
      <div className="small" style={{ color: "var(--muted)", marginBottom: 8 }}>
        Type: {state.mode} · Tag: {d.tag || "-"} · {ts}
      </div>

      {d.imageUrl && (
        <div style={{ margin: "12px 0" }}>
          <img
            src={d.imageUrl}
            alt=""
            style={{ maxWidth: "100%", borderRadius: 12, border: "1px solid var(--border)" }}
          />
        </div>
      )}

      <div
        style={{
          marginTop: 12,
          padding: 16,
          background: "var(--panel)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          lineHeight: 1.65,
          whiteSpace: "pre-wrap",
        }}
      >
        {d.description || "No content."}
      </div>
    </section>
  );
}
