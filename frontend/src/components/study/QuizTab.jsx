"use client";
import { useState } from "react";
import FadeIn from "@/components/FadeIn";

export default function QuizTab({ quizzes }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const toggle = (qIndex, opt, type) => {
    if (submitted) return;
    setAnswers(prev => {
      const sel = prev[qIndex] || [];
      if (type === "mcq") return { ...prev, [qIndex]: [opt] };
      return sel.includes(opt)
        ? { ...prev, [qIndex]: sel.filter(o => o !== opt) }
        : { ...prev, [qIndex]: [...sel, opt] };
    });
  };

  const computeScore = () => {
    let s = 0;
    quizzes.forEach((q, i) => {
      const selected = answers[i] || [];
      if (q.type === "mcq") {
        if (selected[0] === q.answer) s++;
      } else {
        if ([...q.answer].sort().join() === [...selected].sort().join()) s++;
      }
    });
    return s;
  };

  if (submitted) {
    return (
      <FadeIn delay={100} className="max-w-3xl mx-auto text-center py-12">
        <p className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-6">Final Score</p>
        <div className="inline-flex items-center justify-center w-40 h-40 rounded-full border-8 border-gray-100 mb-8">
          <span className={`text-5xl font-black ${score / quizzes.length >= 0.6 ? "text-green-500" : "text-red-500"}`}>
            {Math.round(score / quizzes.length * 100)}%
          </span>
        </div>
        <div className="space-y-6 text-left">
          {quizzes.map((q, i) => {
            const sel = answers[i] || [];
            const isCorrect = q.type === "mcq"
              ? sel[0] === q.answer
              : [...q.answer].sort().join() === [...sel].sort().join();
            return (
              <div key={i} className={`p-6 md:p-8 rounded-[2rem] border ${isCorrect ? "bg-green-50/50 border-green-200" : "bg-red-50/50 border-red-200"}`}>
                <div className="flex gap-4 items-start mb-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isCorrect ? "bg-green-500" : "bg-red-500"}`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {isCorrect
                        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />}
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900 leading-snug mb-2">{q.question}</p>
                    <p className="text-sm text-gray-500 mb-3">
                      <span className="font-semibold">Correct: </span>
                      {Array.isArray(q.answer) ? q.answer.join(", ") : q.answer}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => { setAnswers({}); setSubmitted(false); setScore(0); }}
          className="mt-12 px-10 py-4 rounded-full font-bold text-white bg-black hover:bg-gray-800 transition-colors shadow-md"
        >
          Retry Quiz
        </button>
      </FadeIn>
    );
  }

  return (
    <FadeIn delay={100} className="max-w-3xl mx-auto space-y-8">
      {quizzes.map((q, i) => (
        <div key={i} className="bg-white border border-gray-200 p-8 md:p-10 rounded-[2rem] shadow-sm">
          <div className="mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 block">
              Question {i + 1} · {q.type === "mcq" ? "Single answer" : "Multiple answers"}
            </span>
            <p className="text-xl font-bold text-gray-900 leading-snug mt-3">{q.question}</p>
          </div>
          <div className="space-y-3 mt-6">
            {q.options.map(opt => {
              const sel = answers[i] || [];
              const isSelected = sel.includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => toggle(i, opt, q.type)}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all text-left ${
                    isSelected ? "border-black bg-gray-50" : "border-gray-100 hover:border-gray-300 hover:bg-gray-50/50"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected ? "border-black bg-black" : "border-gray-300"
                  }`}>
                    {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                  </div>
                  <span className={`text-md ${isSelected ? "font-bold text-black" : "font-medium text-gray-600"}`}>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <button
        onClick={() => { setScore(computeScore()); setSubmitted(true); }}
        className="w-full py-5 rounded-full font-bold text-white bg-black hover:bg-gray-800 transition-all text-lg shadow-lg"
      >
        Submit Answers
      </button>
    </FadeIn>
  );
}