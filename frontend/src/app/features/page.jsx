"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import Link from "next/link";

export default function FeaturesPage() {
  const features = [
    {
      title: "Smart Summaries",
      desc: "Turn dense, hundreds-of-pages textbooks into concise, readable summaries instantly. Save hours of manual reading.",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
      color: "text-blue-600 bg-[#eef2ff]"
    },
    {
      title: "Active Recall Flashcards",
      desc: "Automated deck creation optimized for spaced repetition. We extract the exact concepts you need to memorize.",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />,
      color: "text-yellow-500 bg-[#fffbeb]"
    },
    {
      title: "Adaptive Quizzes",
      desc: "Practice tests generated directly from your syllabus. We track your wrong answers and explain exactly why you missed them.",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />,
      color: "text-purple-600 bg-[#f5f3ff]"
    },
    {
      title: "Contextual AI Tutor",
      desc: "An AI that has actually read your specific document. Ask questions, request simpler explanations, or debate concepts securely.",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />,
      color: "text-indigo-500 bg-indigo-50"
    },
    {
      title: "Mock Interview Simulator",
      desc: "Simulate high-pressure exam scenarios. The AI asks contextual questions and grades your typed answers in real-time.",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />,
      color: "text-red-500 bg-[#fef2f2]"
    },
    {
      title: "Multi-Format Support",
      desc: "Don't just upload PDFs. We support extracting knowledge directly from YouTube videos and public web articles.",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />,
      color: "text-emerald-500 bg-emerald-50"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24 px-6 max-w-6xl mx-auto w-full">
        <FadeIn delay={100} className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Built for Deep Understanding</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Everything you need to turn raw information into actual knowledge.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <FadeIn key={i} delay={200 + (i * 100)}>
              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 ${f.color}`}>
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">{f.icon}</svg>
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{f.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={800} className="mt-20 text-center">
          <Link href="/study" className="inline-flex px-10 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors shadow-lg">
            Try it now →
          </Link>
        </FadeIn>
      </main>
      <Footer />
    </div>
  );
}