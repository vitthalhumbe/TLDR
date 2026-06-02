"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24 px-6 max-w-6xl mx-auto w-full">
        
        <FadeIn delay={100} className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Simple, transparent pricing</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Start learning immediately with our free tier, or upgrade for unlimited access when you need to master more subjects.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          <FadeIn delay={200}>
            <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-md border-2 border-black flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-black text-white text-xs font-bold px-4 py-1 rounded-bl-xl">ACTIVE</div>
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-gray-500 text-sm mb-6 min-h-[40px]">Perfect for occasional study sessions and essentialists.</p>
              <div className="mb-8">
                <span className="text-5xl font-black">₹0</span>
                <span className="text-gray-500 font-medium">/forever</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1 text-sm font-medium text-gray-700">
                <li className="flex items-start gap-3"><span className="text-green-500 mt-0.5">✔</span> 1 Upload every 3 days</li>
                <li className="flex items-start gap-3"><span className="text-green-500 mt-0.5">✔</span> AI Summaries & Flashcards</li>
                <li className="flex items-start gap-3"><span className="text-green-500 mt-0.5">✔</span> Basic AI Mock Interview</li>
                <li className="flex items-start gap-3"><span className="text-green-500 mt-0.5">✔</span> Up to 20MB file size</li>
              </ul>
              <button className="w-full py-4 rounded-full font-bold text-white bg-black hover:bg-gray-800 transition-colors">
                Current Plan
              </button>
            </div>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="bg-[#f8f9fc] p-8 md:p-10 rounded-[2rem] border border-gray-200 flex flex-col h-full relative opacity-75">
              <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1 rounded-bl-xl">COMING SOON</div>
              <h3 className="text-2xl font-bold mb-2">Go</h3>
              <p className="text-gray-500 text-sm mb-6 min-h-[40px]">For dedicated students needing weekly study power.</p>
              <div className="mb-8">
                <span className="text-5xl font-black">--</span>
                <span className="text-gray-500 font-medium">/month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1 text-sm font-medium text-gray-700">
                <li className="flex items-start gap-3"><span className="text-gray-400 mt-0.5">✔</span> Unlimited Uploads</li>
                <li className="flex items-start gap-3"><span className="text-gray-400 mt-0.5">✔</span> Advanced Contextual Chat</li>
                <li className="flex items-start gap-3"><span className="text-gray-400 mt-0.5">✔</span> Priority Model Access</li>
              </ul>
              <button disabled className="w-full py-4 rounded-full font-bold text-gray-400 bg-gray-200 cursor-not-allowed">
                Under Construction
              </button>
            </div>
          </FadeIn>
          <FadeIn delay={400}>
             <div className="bg-[#f8f9fc] p-8 md:p-10 rounded-[2rem] border border-gray-200 flex flex-col h-full relative opacity-75">
              <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1 rounded-bl-xl">COMING SOON</div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-gray-500 text-sm mb-6 min-h-[40px]">For researchers and professionals processing massive data.</p>
              <div className="mb-8">
                <span className="text-5xl font-black">--</span>
                <span className="text-gray-500 font-medium">/month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1 text-sm font-medium text-gray-700">
                <li className="flex items-start gap-3"><span className="text-gray-400 mt-0.5">✔</span> Everything in Go</li>
                <li className="flex items-start gap-3"><span className="text-gray-400 mt-0.5">✔</span> Enterprise API Access</li>
                <li className="flex items-start gap-3"><span className="text-gray-400 mt-0.5">✔</span> Up to 100MB file size</li>
              </ul>
              <button disabled className="w-full py-4 rounded-full font-bold text-gray-400 bg-gray-200 cursor-not-allowed">
                Under Construction
              </button>
            </div>
          </FadeIn>

        </div>
      </main>
      <Footer />
    </div>
  );
}