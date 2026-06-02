"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import Link from "next/link";

export default function UseCasesPage() {
  const cases = [
    {
      title: "University Students",
      desc: "Stop drowning in 50-page weekly reading assignments. Upload your syllabus and let TL;DR pull out the core concepts, generate practice exams, and quiz you before midterms.",
      badge: "ACADEMIA",
      icon: (
        <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
        </svg>
      )
    },
    {
      title: "Software Engineers",
      desc: "Learning a new framework? Paste the documentation URL or a 2-hour tutorial YouTube link. Chat directly with the docs to find exactly how to implement the specific feature you need.",
      badge: "TECH & DEV",
      icon: (
        <svg className="w-16 h-16 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
        </svg>
      )
    },
    {
      title: "Researchers",
      desc: "Process massive PDF research papers instantly. Use the AI Tutor to summarize methodology, critique findings, or extract specific data points without reading the entire paper.",
      badge: "RESEARCH",
      icon: (
        <svg className="w-16 h-16 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
      )
    },
    {
      title: "Lifelong Learners",
      desc: "Watching educational YouTube videos or reading long-form articles? Turn passive consumption into active learning by instantly generating flashcards from your favorite content.",
      badge: "PERSONAL GROWTH",
      icon: (
        <svg className="w-16 h-16 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24 px-6 max-w-5xl mx-auto w-full">
        <FadeIn delay={100} className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Who is TL;DR for?</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            From university students to professional developers, see how essentialists use our tools to learn faster.
          </p>
        </FadeIn>

        <div className="space-y-12">
          {cases.map((c, i) => (
            <FadeIn key={i} delay={200 + (i * 150)}>
              <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <span className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3 block">
                    {c.badge}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{c.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{c.desc}</p>
                </div>
                <div className="hidden md:flex w-48 h-48 bg-[#f8f9fc] rounded-full items-center justify-center border-8 border-gray-50 shrink-0">
                  {c.icon}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={800} className="mt-20 text-center">
          <Link href="/study" className="inline-flex px-10 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors shadow-lg">
            Upload your first material →
          </Link>
        </FadeIn>
      </main>
      <Footer />
    </div>
  );
}