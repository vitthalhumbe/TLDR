"use client";
import { useState } from "react";
import FadeIn from "@/components/FadeIn";

export default function FlashcardsTab({ flashcards }) {
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!flashcards || flashcards.length === 0) return null;

  return (
    <FadeIn delay={100} className="flex flex-col items-center">
      <div className="w-full max-w-2xl flex items-center justify-between mb-8 px-2">
        <span className="text-sm font-bold text-gray-500 tracking-widest uppercase">
          Card {cardIdx + 1} / {flashcards.length}
        </span>
        <button 
          onClick={() => { setCardIdx(0); setFlipped(false); }}
          className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors"
        >
          Restart Deck
        </button>
      </div>

      <div 
        className="w-full max-w-2xl h-[350px] md:h-[400px] cursor-pointer group"
        style={{ perspective: "1000px" }}
        onClick={() => setFlipped(!flipped)}
      >
        <div 
          className="relative w-full h-full transition-all duration-700 ease-out"
          style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          {/* Front */}
          <div className="absolute inset-0 bg-white border border-gray-200 shadow-sm rounded-[2rem] flex flex-col items-center justify-center p-10 text-center backface-hidden" style={{ backfaceVisibility: "hidden" }}>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-8 bg-blue-50 px-4 py-1.5 rounded-full">Question</span>
            <p className="text-2xl md:text-3xl font-bold leading-snug text-gray-800">{flashcards[cardIdx].front}</p>
            <p className="text-gray-400 text-sm mt-10 absolute bottom-8 font-medium">Tap to flip</p>
          </div>
          {/* Back */}
          <div className="absolute inset-0 bg-black border border-black shadow-xl rounded-[2rem] flex flex-col items-center justify-center p-10 text-center backface-hidden text-white" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            <span className="text-xs font-bold uppercase tracking-widest text-green-400 mb-8 bg-green-900/30 px-4 py-1.5 rounded-full">Answer</span>
            <p className="text-2xl md:text-3xl font-medium leading-snug">{flashcards[cardIdx].back}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-12 w-full max-w-2xl">
        <button 
          onClick={() => { setCardIdx(i => Math.max(0, i - 1)); setFlipped(false); }}
          disabled={cardIdx === 0}
          className="flex-1 py-4 rounded-full font-bold text-gray-700 bg-white border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition-colors shadow-sm"
        >
          ← Previous
        </button>
        <button 
          onClick={() => { setCardIdx(i => Math.min(flashcards.length - 1, i + 1)); setFlipped(false); }}
          disabled={cardIdx === flashcards.length - 1}
          className="flex-1 py-4 rounded-full font-bold text-white bg-black disabled:opacity-50 hover:bg-gray-800 transition-colors shadow-md"
        >
          Next Card →
        </button>
      </div>
    </FadeIn>
  );
}