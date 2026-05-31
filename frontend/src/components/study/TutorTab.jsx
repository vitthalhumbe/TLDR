"use client";
import { useState, useEffect, useRef } from "react";
import FadeIn from "@/components/FadeIn";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";

async function authHeaders() {
  const { data } = await supabase.auth.getSession();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${data.session?.access_token}`,
  };
}
function TypingMessage({ text }) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    indexRef.current = 0;
    const interval = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) clearInterval(interval);
    }, 8);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayed}</span>;
}

export default function TutorTab({ materialId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingIndex, setStreamingIndex] = useState(null);
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    const placeholderIndex = next.length;
    setMessages(m => [...m, { role: "assistant", content: "" }]);
    setStreamingIndex(placeholderIndex);

    try {
      const res = await fetch(`${API}/tutor/chat`, {
        method: "POST",
        headers: await authHeaders(),
        body: JSON.stringify({ material_id: materialId, messages: next }),
      });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (line.startsWith("data: ")) {
           const text = line.slice(6).replace(/\{\{NL\}\}/g, "\n");
if (text === "[DONE]") break;
reply += text;
            setMessages(m => {
              const updated = [...m];
              updated[placeholderIndex] = { role: "assistant", content: reply };
              return updated;
            });
          }
        }
      }
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Error — please try again." }]);
    } finally {
      setLoading(false);
      setStreamingIndex(null);
    }
  };

  return (
    <FadeIn delay={100} className="flex flex-col h-[70vh] max-h-[800px] border border-gray-200 bg-white rounded-[2rem] shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-4">
        <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <div>
          <h3 className="font-bold">AI Tutor</h3>
          <p className="text-xs text-gray-500 font-medium">Knows your document.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fafafa]">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-2xl">👋</div>
            <p className="font-medium">Say hello to start learning.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col max-w-[85%] ${m.role === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}>
            <div className={`p-4 rounded-3xl ${m.role === "user" ? "bg-black text-white rounded-br-sm" : "bg-white border border-gray-200 text-gray-800 shadow-sm rounded-bl-sm"}`}>
              {m.role === "assistant" && i === streamingIndex
                ? <span>{m.content}</span>
                : m.role === "assistant"
                  ? (
                    <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  )
                  : m.content || (
                    <div className="flex gap-1 py-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                    </div>
                  )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-2 py-2 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Ask a question..."
            className="flex-1 bg-transparent px-4 py-2 outline-none text-sm font-medium"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center disabled:opacity-50 transition-opacity"
          >
            <svg className="w-5 h-5 -ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>
    </FadeIn>
  );
}