"use client";
import ReactMarkdown from "react-markdown";
import FadeIn from "@/components/FadeIn";

export default function SummaryTab({ summary, flashcardCount, quizCount }) {
  return (
    <FadeIn delay={100}>
      <div className="mb-8 flex flex-wrap gap-3">
        <span className="text-xs font-bold px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-600 shadow-sm">
          {flashcardCount} Flashcards Generated
        </span>
        <span className="text-xs font-bold px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-600 shadow-sm">
          {quizCount} Quiz Questions
        </span>
      </div>
      <div className="prose prose-gray max-w-none text-gray-700 leading-loose md:text-lg bg-white p-8 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <ReactMarkdown>{summary}</ReactMarkdown>
      </div>
    </FadeIn>
  );
}