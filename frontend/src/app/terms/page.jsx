"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24 px-6 max-w-3xl mx-auto w-full">
        <FadeIn delay={100}>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Terms of Service</h1>
          <p className="text-gray-500 mb-12">Last updated: October 2024</p>
        </FadeIn>

        <FadeIn delay={200} className="space-y-8 text-gray-700 leading-loose">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using TL;DR, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p>
              TL;DR provides AI-powered educational tools, including document summarization, flashcard generation, quizzes, and mock interviews. The service is provided "as is" and "as available" without any warranties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Conduct and Fair Use</h2>
            <p>
              You agree not to misuse the TL;DR services. This includes attempting to bypass rate limits, uploading malicious files, or using the service to process illegal or highly sensitive material. The "Free" tier is subject to strict rate limits (e.g., 1 upload per 3 days) to ensure fair access for all users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Intellectual Property</h2>
            <p>
              You retain all rights to the documents you upload. By uploading them, you grant TL;DR a temporary license to process the text strictly for the purpose of returning your generated study materials.
            </p>
          </section>
        </FadeIn>
      </main>
      <Footer />
    </div>
  );
}