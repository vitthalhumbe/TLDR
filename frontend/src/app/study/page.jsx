"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ingestPDF, ingestYouTube, ingestURL } from "@/lib/api";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

export default function UploadPage() {
  const router = useRouter();
  
  // --- Upload State ---
  const [tab, setTab] = useState("pdf");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [urlInput, setUrlInput] = useState("");
  const fileRef = useRef(null);

  // --- Handlers ---
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f?.name.endsWith(".pdf")) setFile(f);
    else setError("Only PDF files accepted");
  };

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      let result;
      if (tab === "pdf") {
        if (!file) { setError("Select a PDF first"); setLoading(false); return; }
        result = await ingestPDF(file);
      } else if (tab === "youtube") {
        if (!urlInput) { setError("Enter a YouTube URL"); setLoading(false); return; }
        result = await ingestYouTube(urlInput);
      } else {
        if (!urlInput) { setError("Enter a URL"); setLoading(false); return; }
        result = await ingestURL(urlInput);
      }
      
      router.push(`/study/${result.material_id}`);
    } catch (e) {
      const msg = e?.response?.data?.detail || "Processing failed. Check your input and try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "pdf", label: "PDF DOCUMENT" },
    { id: "youtube", label: "YOUTUBE" },
    { id: "url", label: "WEB ARTICLE" },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans overflow-x-hidden flex flex-col">
      
      <Navbar />

      <main className="flex-1">
        {/* HERO & UPLOAD SECTION */}
        <section className="pt-32 pb-24 px-6 flex flex-col items-center justify-center text-center max-w-6xl mx-auto">
          <FadeIn delay={0}>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Start Learning</h1>
            <p className="text-gray-500 text-md md:text-lg mb-12 max-w-xl mx-auto">
              Upload your material to generate your interactive study guide instantly.
            </p>
          </FadeIn>

          <FadeIn delay={200} className="w-full max-w-3xl">
            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 md:p-12 text-left">
              
              {/* Tabs */}
              <div className="flex gap-6 md:gap-8 mb-8 border-b border-gray-100 px-2 overflow-x-auto whitespace-nowrap scrollbar-hide pb-1">
                {tabs.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setTab(t.id); setError(""); setUrlInput(""); setFile(null); }}
                    className={`pb-4 text-xs font-bold tracking-widest transition-colors relative flex-shrink-0 ${
                      tab === t.id ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {t.label}
                    {tab === t.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-t-md" />
                    )}
                  </button>
                ))}
              </div>

              {/* PDF Drop Zone */}
              {tab === "pdf" && (
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-10 md:p-16 text-center cursor-pointer transition-all mb-8 ${
                    dragOver ? "border-gray-900 bg-gray-50" : 
                    file ? "border-green-500 bg-green-50" : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
                  
                  {file ? (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <p className="text-gray-900 font-semibold">{file.name}</p>
                      <p className="text-gray-500 text-xs mt-2">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-[#f0f4ff] text-[#4f75ff] rounded-full flex items-center justify-center mb-4">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v6h6v10H6z"/>
                        </svg>
                      </div>
                      <p className="text-gray-900 font-medium mb-1 text-sm">Drop PDF here or click to browse</p>
                      <p className="text-gray-400 text-xs mt-1">Max 20MB</p>
                    </div>
                  )}
                </div>
              )}

              {/* URL Inputs */}
              {(tab === "youtube" || tab === "url") && (
                <div className="py-4 md:py-8">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && submit()}
                    placeholder={tab === "youtube" ? "Paste YouTube link here..." : "Paste Web Article URL here..."}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl px-6 py-5 outline-none mb-4 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-mono text-sm"
                  />
                </div>
              )}

              {error && <div className="text-red-500 text-sm text-center mb-6 font-medium bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}

              <button
                onClick={submit}
                disabled={loading}
                className="w-full bg-black text-white font-semibold px-6 py-4 rounded-full hover:bg-gray-800 transition-all disabled:opacity-75 flex justify-center items-center gap-3 text-sm tracking-wide shadow-md"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </span>
                ) : (
                  <>Generate Study Guide <span className="text-lg leading-none mt-[2px]">→</span></>
                )}
              </button>

            </div>
          </FadeIn>
        </section>

        {/* HOW IT WORKS SECTION (TIMELINE) */}
        <section className="py-16 md:py-24 px-6 max-w-6xl mx-auto">
          <FadeIn delay={400} className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it Works</h2>
            <p className="text-gray-500 text-md">From complex material to simple understanding in five steps.</p>
          </FadeIn>

          <div className="relative">
            {/* Vertical Line for Desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 transform -translate-x-1/2"></div>

            {[
              { num: "1", title: "Upload Material", desc: "Support for PDFs, YouTube links, and Web articles. Simply drag and drop or paste a link to get started.", align: "left" },
              { num: "2", title: "Read Summaries & Flashcards", desc: "Get instant highlights and active recall cards generated by AI to reinforce the most important concepts.", align: "right" },
              { num: "3", title: "Solve MCQs", desc: "Test your understanding with adaptive multiple-choice questions designed to identify your knowledge gaps.", align: "left" },
              { num: "4", title: "Chat with AI", desc: "Ask questions directly to your material for deep clarification. The AI grounds its answers entirely in your content.", align: "right" },
              { num: "5", title: "Mock Interview", desc: "Practice with an AI Interviewer and get instant feedback on your performance to prepare for the real thing.", align: "left" },
            ].map((step, i) => (
              <FadeIn key={step.num} delay={500 + (i * 100)} className="relative flex flex-col md:flex-row items-center justify-between mb-12 md:mb-16 group">
                
                {/* Left Card */}
                <div className={`w-full md:w-[45%] flex ${step.align === "left" ? "justify-end" : "justify-start md:opacity-0"}`}>
                  {step.align === "left" && (
                    <div className="bg-[#f8f9fc] rounded-3xl p-6 md:p-8 w-full md:max-w-md border border-gray-100 hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  )}
                </div>

                {/* Center Circle (Desktop) */}
                <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex w-10 h-10 bg-black text-white rounded-full items-center justify-center font-bold text-sm z-10 shadow-[0_0_0_8px_#fafafa]">
                  {step.num}
                </div>

                {/* Mobile Circle */}
                <div className="md:hidden w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm mb-4 self-start shadow-[0_0_0_4px_#fafafa]">
                  {step.num}
                </div>

                {/* Right Card */}
                <div className={`w-full md:w-[45%] flex ${step.align === "right" ? "justify-start" : "justify-end md:hidden"}`}>
                  {(step.align === "right" || true) && (
                    <div className={`bg-[#f8f9fc] rounded-3xl p-6 md:p-8 w-full md:max-w-md border border-gray-100 hover:shadow-md transition-shadow ${step.align === "left" ? "md:hidden" : ""}`}>
                      <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* KEY FEATURES SECTION */}
        <section className="bg-[#f2f3f5] py-16 md:py-24 px-6 rounded-t-[3rem]">
          <div className="max-w-6xl mx-auto">
            <FadeIn delay={600} className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
              <p className="text-gray-500 text-md">Everything you need to master your subjects faster.</p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 1 */}
              <div className="flex flex-col gap-6">
                <FadeIn delay={700}>
                  <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-[#eef2ff] text-blue-600 rounded-full flex items-center justify-center mb-6">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <h3 className="text-lg font-bold mb-3">AI Summaries</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Turn long documents into concise, readable summaries. Quickly grasp the core concepts without spending hours reading.</p>
                  </div>
                </FadeIn>
                <FadeIn delay={800}>
                  <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-[#eef2ff] text-blue-600 rounded-full flex items-center justify-center mb-6">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                    </div>
                    <h3 className="text-lg font-bold mb-3">AI Chat Assistant</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">A personal tutor that knows your content inside out. Ask specific questions, request explanations, or debate concepts securely.</p>
                  </div>
                </FadeIn>
              </div>

              {/* Column 2 */}
              <div className="flex flex-col gap-6 md:mt-12">
                <FadeIn delay={900}>
                  <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-[#fffbeb] text-yellow-500 rounded-full flex items-center justify-center mb-6">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path></svg>
                    </div>
                    <h3 className="text-lg font-bold mb-3">Flashcards</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Automated deck creation for efficient memorization. Spaced repetition algorithms ensure you focus on what you struggle with.</p>
                  </div>
                </FadeIn>
                <FadeIn delay={1000}>
                  <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-[#fef2f2] text-red-500 rounded-full flex items-center justify-center mb-6">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    </div>
                    <h3 className="text-lg font-bold mb-3">AI Mock Interview</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Simulate real interview scenarios with typing-based feedback. Test your ability to articulate answers under pressure.</p>
                  </div>
                </FadeIn>
              </div>

              {/* Column 3 */}
              <div className="flex flex-col gap-6">
                <FadeIn delay={1100}>
                  <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-[#f5f3ff] text-purple-600 rounded-full flex items-center justify-center mb-6">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                    </div>
                    <h3 className="text-lg font-bold mb-3">Quizzes</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Generate practice tests from your own study materials. Evaluate your readiness before the actual exam with varied difficulty levels.</p>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}