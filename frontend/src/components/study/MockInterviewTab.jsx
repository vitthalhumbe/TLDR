"use client";
import { useState } from "react";
import FadeIn from "@/components/FadeIn";

export default function MockInterviewTab({ materialId }) {
  const [session, setSession] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const startMock = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/mock/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ material_id: materialId }),
      });
      const json = await res.json();
      setSession({ session_id: json.session_id, messages: [{ role: "assistant", content: json.message }] });
    } catch { } finally { setLoading(false); }
  };

  const submitAnswer = async () => {
    if (!input.trim() || loading || !session) return;
    const userMsg = { role: "user", content: input };
    const next = [...session.messages, userMsg];
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/mock/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: session.session_id,
          material_id: materialId,
          answer: userMsg.content,
          messages: next,
        }),
      });
      const json = await res.json();
      const updated = [...next, { role: "assistant", content: json.message }];
      setSession({ ...session, messages: updated });
      if (json.done && json.result) {
        setDone({ score: json.result.score, total: json.result.total, feedback: json.result.feedback });
      }
    } catch { } finally { setLoading(false); }
  };

  return (
    <FadeIn delay={100} className="flex flex-col h-[70vh] max-h-[800px] border border-gray-200 bg-white rounded-[2rem] shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-4">
        <div className="w-10 h-10 bg-purple-100 text-purple-600 flex items-center justify-center rounded-full">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
        </div>
        <div>
          <h3 className="font-bold">Mock Interview</h3>
          <p className="text-xs text-gray-500 font-medium">5 Questions. Immediate Feedback.</p>
        </div>
      </div>

      {!session && !done && (
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-[#fafafa]">
          <div className="w-20 h-20 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <svg className="w-10 h-10 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
          </div>
          <h4 className="text-2xl font-bold mb-4">Ready to test yourself?</h4>
          <p className="text-gray-500 mb-8 max-w-md leading-relaxed">
            The AI acts as your interviewer. Answer the questions naturally. You'll receive a full performance review at the end.
          </p>
          <button onClick={startMock} disabled={loading} className="px-8 py-4 rounded-full font-bold text-white bg-black hover:bg-gray-800 transition-colors shadow-md disabled:opacity-50">
            {loading ? "Preparing Interview..." : "Start Interview →"}
          </button>
        </div>
      )}

      {done && (
        <div className="flex-1 overflow-y-auto p-10 text-center bg-[#fafafa]">
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">Interview Complete</p>
          <div className="inline-flex items-center justify-center w-40 h-40 rounded-full border-8 border-gray-100 mb-8 relative bg-white">
            <span className={`text-5xl font-black ${done.score / done.total >= 0.6 ? "text-green-500" : "text-red-500"}`}>
              {done.score}/{done.total}
            </span>
          </div>
          <div className="bg-white border border-gray-200 rounded-[2rem] p-8 max-w-2xl w-full text-left mx-auto mb-8 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-purple-500 mb-4 bg-purple-50 px-3 py-1.5 rounded-full inline-block">Detailed Feedback</p>
            <p className="text-gray-700 leading-loose text-md">{done.feedback}</p>
          </div>
          <button onClick={() => { setSession(null); setDone(null); }} className="px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors">
            Restart Interview
          </button>
        </div>
      )}

      {session && !done && (
        <>
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fafafa]">
            {session.messages.map((m, i) => (
              <div key={i} className={`flex flex-col max-w-[85%] ${m.role === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}>
                <div className={`p-4 rounded-3xl ${m.role === "user" ? "bg-black text-white rounded-br-sm" : "bg-white border border-gray-200 text-gray-800 shadow-sm rounded-bl-sm"}`}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex flex-col bg-gray-50 border border-gray-200 rounded-[1.5rem] p-2 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
              <textarea
                rows="2"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && submitAnswer()}
                placeholder="Type your answer here..."
                className="w-full bg-transparent px-4 py-2 outline-none text-sm font-medium resize-none"
              />
              <div className="flex justify-end mt-2">
                <button onClick={submitAnswer} disabled={loading || !input.trim()} className="px-6 py-2 rounded-full font-bold text-white bg-black hover:bg-gray-800 disabled:opacity-50 transition-colors text-sm">
                  {loading ? "Sending..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </FadeIn>
  );
}