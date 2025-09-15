import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Floating chat widget (bottom-right).
 * - Streams tokens from /api/ai/chat-stream
 * - Keeps messages in memory (not persisted)
 */
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I’m your DEV@Deakin assistant. How can I help?" },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  // auto scroll to bottom on new msg
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;

    const history = [...messages, { role: "user", content: text }];
    setMessages(history);
    setInput("");
    setSending(true);

    // placeholder for streaming assistant message
    const idx = history.length;
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/ai/chat-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) throw new Error("Stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages(prev => {
          const next = [...prev];
          next[idx] = { role: "assistant", content: (next[idx]?.content || "") + chunk };
          return next;
        });
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => {
        const next = [...prev];
        next[idx] = { role: "assistant", content: "Sorry, streaming failed." };
        return next;
      });
    } finally {
      setSending(false);
    }
  }

  function onKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className={`chat-fab ${open ? "is-open" : ""}`}>
      {/* Toggle Button */}
      <button className="chat-fab__btn" onClick={() => setOpen(v => !v)}>
        {open ? "×" : "Chat"}
      </button>

      {/* Panel */}
      {open && (
        <div className="chat-fab__panel card">
          <div className="chat-fab__header">
            <strong>Assistant</strong>
          </div>

          <div className="chat-fab__history" ref={scrollRef}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`chat-bubble ${m.role === "user" ? "user" : "ai"}`}
              >
                {m.content}
              </div>
            ))}
          </div>

          <div className="chat-fab__input">
            <textarea
              className="input"
              rows={2}
              placeholder="Ask anything about DEV@Deakin…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
            />
            <button className="btn" disabled={sending} onClick={send}>
              {sending ? "Thinking…" : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
