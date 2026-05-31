"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Page() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
  {
    q: "What sources can I upload?",
    a: "PDF documents (up to 20MB), YouTube video links, and any publicly accessible web article URL.",
  },
  {
    q: "How many uploads do I get?",
    a: "Each account gets 1 upload every 3 days. This keeps the service free and sustainable for everyone.",
  },
  {
    q: "Do I need an account?",
    a: "Yes. A free account is required to upload material and generate study guides.",
  },
  {
    q: "What does TLDR generate from my material?",
    a: "A full summary, 12–15 flashcards, 8–10 quiz questions (MCQ and multi-select), an AI tutor you can chat with, and a 5-question mock interview — all grounded in your uploaded content.",
  },
  {
    q: "How does the mock interview work?",
    a: "The AI asks 5 questions based specifically on your material, evaluates each answer in real time, and gives you a score and detailed feedback at the end.",
  },
  {
    q: "Is my data used to train AI models?",
    a: "No. Your uploaded content is used only to generate your study material and is never used for model training.",
  },
];

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans overflow-x-hidden flex flex-col">
      
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-16">
          <h1 className="text-5xl md:text-8xl font-bold leading-tight tracking-tight max-w-4xl mb-6">
            Learn Anything
          </h1>
          
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed mb-10 mx-auto">
            Upload PDFs, YouTube links, or web articles. Get summaries, flashcards, and AI-powered interviews in seconds.
          </p>

          <Link
            href="/study"
            className="bg-black text-white text-md font-semibold px-12 py-4 rounded-full hover:bg-gray-800 transition-colors shadow-lg shadow-black/10 flex items-center gap-2"
          >
            Try TLDR <span className="text-xl leading-none mb-[2px]">→</span>
          </Link>
        </section>

        {/* FEATURES SECTION */}
        <section className="flex flex-col items-center justify-center px-6 md:px-10 pt-24 pb-16 max-w-6xl mx-auto">
          <div className="text-center w-full mb-16">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight max-w-2xl mx-auto">
                Faster understanding powered by smart AI
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch justify-center w-full">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                ),
                title: "Smart Summaries",
                desc: "Reading long textbooks, research papers, class notes, and PDFs can take hours and still leave you confused. Smart Summaries helps you understand the important ideas quickly.",
                color: "bg-[#eef2ff] text-blue-600"
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                ),
                title: "Active Recall",
                desc: "Learn in a smarter way by automatically creating flashcards, quizzes, and practice questions from your own study material to remember concepts actively.",
                color: "bg-[#fffbeb] text-yellow-500"
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                  </svg>
                ),
                title: "Contextual Chat",
                desc: "You can ask questions, request simpler explanations, summarize chapters, or explore topics deeply. The AI understands the context of your documents.",
                color: "bg-[#f5f3ff] text-purple-600"
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                ),
                title: "AI Mock Interview",
                desc: "The AI asks questions & responds like an actual interviewer. Students can improve communication skills, problem-solving, and topic understanding.",
                color: "bg-[#fef2f2] text-red-500"
              },
            ].map((f, i) => (
              <div key={f.title} className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow h-full">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PRIVACY BANNER */}
        <section className="px-6 py-12">
          <div className="bg-black text-white rounded-[2rem] flex flex-col items-center justify-center py-20 px-6 md:px-10 text-center max-w-6xl mx-auto shadow-xl">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight max-w-3xl tracking-tight">
                We value your privacy and never use your organization's data to train our models.
            </h2>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="px-6 py-24 max-w-3xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Frequently Asked
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200 border-t border-gray-200">
            {faqs.map((f, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-6 text-left hover:text-gray-600 transition-colors"
                >
                  <span className="text-md font-bold">{f.q}</span>
                  <span className="text-2xl text-gray-400 ml-4 font-light">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="pb-6">
                    <p className="text-md text-gray-500 leading-relaxed">{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />

    </div>
  );
}