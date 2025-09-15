// Two modes: Questions / Articles, with direct image upload to Firebase Storage.
// Uses Firestore collections: "questions" and "articles" (one per mode).
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  addDoc, collection, deleteDoc, doc,
  onSnapshot, orderBy, query, serverTimestamp, updateDoc
} from "firebase/firestore";
import { db, storage } from "../lib/firebase";
import {
  ref as storageRef, uploadBytes, getDownloadURL, deleteObject
} from "firebase/storage";
import "./qa.scoped.css";

const TAGS = {
  question: ["general", "react", "firebase", "netlify"],
  article:  ["insight", "tutorial", "guide", "opinion"],
};

export default function QA() {
  /** ---------- page mode ---------- */
  const [mode, setMode] = useState("question"); // "question" | "article"

  /** ---------- create form ---------- */
  const [title, setTitle] = useState("");
  const [desc, setDesc]   = useState("");
  const [tag, setTag]     = useState(TAGS.question[0]);

  // image upload states
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  /** ---------- list + filters ---------- */
  const [rows, setRows] = useState([]);
  const [kw, setKw] = useState("");
  const [filterTag, setFilterTag] = useState("all");
  const [start, setStart] = useState(""); // yyyy-mm-dd
  const [end, setEnd]     = useState(""); // yyyy-mm-dd
  const [expandedId, setExpandedId] = useState(null);

  // switch tag options when mode changes
  useEffect(() => {
    setTag(TAGS[mode][0]);
    setFilterTag("all");
  }, [mode]);

  // subscribe current mode collection
  useEffect(() => {
    const coll = mode === "article" ? "articles" : "questions";
    const q = query(collection(db, coll), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setRows(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [mode]);

  // list filter
  const filtered = useMemo(() => {
    const kwLower = kw.trim().toLowerCase();
    const inRange = (ts, a, b) => {
      if (!ts?.toDate) return true;
      const t = ts.toDate().getTime();
      const from = a ? new Date(a + "T00:00:00").getTime() : -Infinity;
      const to   = b ? new Date(b + "T23:59:59").getTime() : Infinity;
      return t >= from && t <= to;
    };
    return rows.filter(x =>
      (!kwLower || x.title?.toLowerCase().includes(kwLower) || x.description?.toLowerCase().includes(kwLower)) &&
      (filterTag === "all" || x.tag === filterTag) &&
      inRange(x.createdAt, start, end)
    );
  }, [rows, kw, filterTag, start, end]);

  // create document (upload image first if provided)
  async function addItem() {
    if (!title.trim()) return alert("Title is required");
    try {
      setUploading(true);
      let imageUrl = "";

      if (file) {
        const ext = file.name.split(".").pop() || "png";
        const path = `${mode}s/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const r = storageRef(storage, path);
        await uploadBytes(r, file);
        imageUrl = await getDownloadURL(r);
      }

      const data = {
        title: title.trim(),
        description: desc.trim(),
        tag,
        imageUrl,
        createdAt: serverTimestamp(),
        kind: mode, // redundancy, helpful for analytics
      };

      const docRef = await addDoc(collection(db, mode === "article" ? "articles" : "questions"), data);

      // optional: if you want to save storagePath for later delete, update with it
      if (file) {
        await updateDoc(docRef, { storagePath: imageUrl }); // using url is enough to delete via ref(storage, url)
      }

      setTitle(""); setDesc(""); setFile(null);
    } catch (e) {
      console.error(e);
      alert("Failed to create.");
    } finally {
      setUploading(false);
    }
  }

  // delete item and try to delete storage file if it's from our bucket
  async function removeItem(id, imageUrl) {
    if (!confirm("Delete this item?")) return;
    const coll = mode === "article" ? "articles" : "questions";
    await deleteDoc(doc(db, coll, id));
    // best-effort storage delete
    try {
      if (imageUrl) {
        const r = storageRef(storage, imageUrl); // ref() 支持 https 下载地址
        await deleteObject(r);
      }
    } catch {}
    if (expandedId === id) setExpandedId(null);
  }

  const clearFilters = () => {
    setKw(""); setFilterTag("all"); setStart(""); setEnd("");
  };

  return (
    <section className="qa-page">

      {/* MODE TABS */}
      <div className="qa-tabs card">
        <button
          className={`qa-tab ${mode === "question" ? "active" : ""}`}
          onClick={() => setMode("question")}
          type="button"
          aria-pressed={mode === "question"}
        >
          Questions
        </button>
        <button
          className={`qa-tab ${mode === "article" ? "active" : ""}`}
          onClick={() => setMode("article")}
          type="button"
          aria-pressed={mode === "article"}
        >
          Articles
        </button>
      </div>

      {/* HEADER */}
      <div className="qa-header">
        <h1>{mode === "article" ? "Articles" : "Questions"} </h1>
        <p className="small">Create, search by keyword/tag/date. Click a title to view details.</p>
      </div>

      {/* FILTERS */}
      <div className="qa-filters card">
        <input
          className="input"
          type="search"
          placeholder="Search keyword…"
          value={kw}
          onChange={(e) => setKw(e.target.value)}
        />
        <select
          className="input"
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
        >
          <option value="all">All tags</option>
          {TAGS[mode].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <input className="input" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        <input className="input" type="date" value={end}   onChange={(e) => setEnd(e.target.value)} />
        <button className="btn" type="button" onClick={clearFilters}>Clear</button>
      </div>

      {/* CREATE */}
      <div className="qa-create card">
        <h3 style={{marginTop:0}}>
          {mode === "article" ? "Create an article" : "Create a question"}
        </h3>

        <div className="qa-grid">
          <label>
            <span className="small">Title</span>
            <input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Short, clear summary…" />
          </label>

          <label>
            <span className="small">Tag</span>
            <select className="input" value={tag} onChange={e=>setTag(e.target.value)}>
              {TAGS[mode].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>

          <label className="qa-col-span">
            <span className="small">{mode === "article" ? "Content" : "Description"}</span>
            <textarea className="input" rows={4} value={desc} onChange={e=>setDesc(e.target.value)}
              placeholder={mode === "article" ? "Write your article summary or content…" : "Describe your problem…"} />
          </label>

          <label>
            <span className="small">Image (optional)</span>
            <input
              className="input"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>

          {file && (
            <div className="qa-file small">
              Selected: <strong>{file.name}</strong>
            </div>
          )}
        </div>

        <button className="btn" disabled={uploading} onClick={addItem}>
          {uploading ? "Uploading…" : (mode === "article" ? "Add article" : "Add question")}
        </button>
      </div>

      {/* LIST */}
      <ul className="qa-list">
        {filtered.map(item => {
          const ts = item.createdAt?.toDate ? item.createdAt.toDate().toLocaleString() : "—";
          const isOpen = expandedId === item.id;
          const to = `/qa/${mode}/${item.id}`;
          return (
            <li key={item.id} className="qa-item card">
              <div className="qa-item__head">
                <div className="qa-title-wrap">
                  <Link className="qa-title" to={to} title="Open detail">{item.title}</Link>
                  <span className="qa-tag">{item.tag || TAGS[mode][0]}</span>
                </div>
                <div className="qa-actions">
                  <button className="btn" onClick={() => setExpandedId(p => p===item.id ? null : item.id)}>
                    {isOpen ? "Hide" : "Preview"}
                  </button>
                  <button className="btn" onClick={() => removeItem(item.id, item.imageUrl)}>Delete</button>
                </div>
              </div>

              {isOpen && (
                <div className="qa-preview">
                  {item.imageUrl && <img className="qa-thumb" src={item.imageUrl} alt="" />}
                  <div className="qa-desc">{item.description || "No description."}</div>
                </div>
              )}
              <div className="qa-meta small">Created at {ts} · Type: {mode}</div>
            </li>
          );
        })}
      </ul>

      {!filtered.length && (
        <div className="small" style={{ color: "var(--muted)", marginTop: 16 }}>
          No results. Try other filters.
        </div>
      )}
    </section>
  );
}
