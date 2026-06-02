"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24 px-6 max-w-4xl mx-auto w-full flex flex-col md:flex-row gap-12 items-start">
        
        <div className="w-full md:w-1/2">
          <FadeIn delay={100}>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Get in touch</h1>
            <p className="text-gray-500 mb-8 text-lg leading-relaxed">
              Have a question, feedback, or need help with a generated study guide? We'd love to hear from you.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <span>support@tldr.academic</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
                <span>@tldr_academic</span>
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="w-full md:w-1/2">
          <FadeIn delay={200} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-gray-500">We'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold tracking-wide mb-2 text-gray-700">Name</label>
                  <input required type="text" className="w-full px-5 py-4 rounded-2xl border border-gray-200 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all bg-gray-50" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold tracking-wide mb-2 text-gray-700">Email</label>
                  <input required type="email" className="w-full px-5 py-4 rounded-2xl border border-gray-200 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all bg-gray-50" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold tracking-wide mb-2 text-gray-700">Message</label>
                  <textarea required rows="4" className="w-full px-5 py-4 rounded-[1.5rem] border border-gray-200 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all bg-gray-50 resize-none" placeholder="How can we help?"></textarea>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-black text-white font-bold px-6 py-4 rounded-full hover:bg-gray-800 transition-all disabled:opacity-50">
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </FadeIn>
        </div>

      </main>
      <Footer />
    </div>
  );
}