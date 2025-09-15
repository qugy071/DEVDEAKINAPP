import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Controlled as ControlledEditor } from "react-codemirror2";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/markdown/markdown.js";
import "codemirror/mode/javascript/javascript.js";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

const DEFAULT_TEXT = `# Hello DEV@Deakin

This post is **Markdown**. You can also include code blocks, e.g.:

\`\`\`js
function greet(name) {
  return \`Hello, \${name}!\`;
}
console.log(greet("Deakin"));
\`\`\`
`;

export default function Post() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [title, setTitle] = useState("My first markdown post");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async () => {
    setMsg("");
    if (!text?.trim()) return setMsg("❌ Please write something before submitting.");
    try {
      setLoading(true);
      await addDoc(collection(db, "markdown"), {
        title: title?.trim() || "Untitled",
        content: text,
        createdAt: serverTimestamp(),
      });
      setMsg("✅ Saved to Firestore collection 'markdown'.");
    } catch (err) {
      setMsg(`❌ Failed to save: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
      <div className="card">
        <h2>Editor</h2>
        <p className="small">Type Markdown or code here. Click <strong>Submit</strong> to save it.</p>

        <input
          className="input"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginBottom: 12 }}
        />

        <ControlledEditor
          value={text}
          onBeforeChange={(_editor, _data, value) => setText(value)}
          options={{
            mode: "markdown",
            theme: "material",
            lineNumbers: true,
            lineWrapping: true,
            tabSize: 2,
          }}
        />

        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button className="btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
          {msg && <span className="small">{msg}</span>}
        </div>
      </div>

      <div className="card">
        <h2>Preview</h2>
        <div className="small" style={{ marginBottom: 8 }}>
          Rendered with <code>react-markdown</code>.
        </div>
        <div style={{ whiteSpace: "pre-wrap" }}>
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
