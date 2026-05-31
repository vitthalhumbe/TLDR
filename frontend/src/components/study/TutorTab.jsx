"use client";
import { useState } from "react";
import FadeIn from "@/components/FadeIn";

export default function TutorTab({ materialId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/tutor/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ material_id: materialId, messages: next }),
      });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";
      setMessages(m => [...m, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const text = line.slice(6);
            if (text === "[DONE]") break;
            reply += text;
            setMessages(m => {
              const updated = [...m];
              updated[updated.length - 1] = { role: "assistant", content: reply };
              return updated;
            });
          }
        }
      }
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Error — please try again." }]);
    } finally {
      setLoading(false);
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
          <p className="text-xs text-gray-500 font-medium">Powered by Gemini. Knows your document.</p>
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
              {m.content || <div className="flex gap-1 py-1"><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span></div>}
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