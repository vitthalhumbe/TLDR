"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMaterial } from "@/lib/api";
import { notFound } from "next/navigation";

import SummaryTab from "@/components/study/SummaryTab";
import FlashcardsTab from "@/components/study/FlashcardsTab";
import QuizTab from "@/components/study/QuizTab";
import TutorTab from "@/components/study/TutorTab";
import MockInterviewTab from "@/components/study/MockInterviewTab";

export default function StudyPage() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("summary");

  useEffect(() => {
    try {
      getMaterial(id)
        .then(setData)
        .catch(() => setError("Failed to load material"))
        .finally(() => setLoading(false));
    } catch (e) {
      const status = e?.response?.status;
      if (status === 404 || status === 403) notFound();
    }


  }, [id]);

  const tabs = [
    { id: "summary", label: "Summary" },
    { id: "flashcards", label: "Flashcards" },
    { id: "quiz", label: "Quiz" },
    { id: "tutor", label: "Tutor" },
    { id: "mock", label: "Mock Interview" },
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center font-sans">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 font-medium tracking-wide">Analyzing material...</p>
    </div>
  );

  if (error || !data) return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center font-sans">
      <div className="text-center bg-white p-10 rounded-[2rem] shadow-sm border border-red-100">
        <p className="text-red-500 mb-6 font-bold">{error || "Material not found"}</p>
        <button onClick={() => router.push("/")} className="px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors">
          ← Back to Home
        </button>
      </div>
    </div>
  );

  const { material, content } = data;

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans flex flex-col overflow-x-hidden">

      {/* HEADER */}
      <header className="sticky top-0 z-50 flex flex-col md:flex-row md:items-center justify-between px-6 md:px-12 py-4 bg-[#fafafa]/90 backdrop-blur-md border-b border-gray-200 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 text-gray-600 rounded-full hover:bg-gray-50 hover:text-black transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold tracking-tight truncate max-w-[200px] md:max-w-md">
              {material.title}
            </h2>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {material.source_type}
            </span>
          </div>
        </div>

        {/* Scrollable Tab Bar */}
        <div className="flex overflow-x-auto whitespace-nowrap scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2 text-xs font-bold tracking-widest transition-all rounded-full ${tab === t.id
                  ? "bg-black text-white shadow-md"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 md:py-16">
        {tab === "summary" && <SummaryTab summary={content.summary} flashcardCount={content.flashcards.length} quizCount={content.quizzes.length} />}
        {tab === "flashcards" && <FlashcardsTab flashcards={content.flashcards} />}
        {tab === "quiz" && <QuizTab quizzes={content.quizzes} />}
        {tab === "tutor" && <TutorTab materialId={id} />}
        {tab === "mock" && <MockInterviewTab materialId={id} />}
      </div>

    </div>
  );
}