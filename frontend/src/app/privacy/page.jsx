"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import ReactMarkdown from "react-markdown";

export default function PrivacyPage() {
  const [content, setContent] = useState("");

  useEffect(() => {
    // Fetch the raw markdown file from the public directory
    fetch("/privacy_policy.md")
      .then((res) => res.text())
      .then((text) => setContent(text))
      .catch((err) => console.error("Failed to load privacy policy:", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24 px-6 max-w-3xl mx-auto w-full">
        <FadeIn delay={100} className="text-gray-700 leading-loose">
          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
              B.Tech AI/ML Student Learning Project
            </span>
          </div>
          <ReactMarkdown
            components={{
              // Map markdown tags to your Tailwind classes for custom styling
              h1: ({ node, ...props }) => (
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="mb-6" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc pl-6 mb-6 space-y-2" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li {...props} />
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-bold text-gray-900" {...props} />
              ),
              em: ({ node, ...props }) => (
                <em className="italic text-gray-500" {...props} />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </FadeIn>
      </main>
      <Footer />
    </div>
  );
}