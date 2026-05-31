"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24 px-6 max-w-3xl mx-auto w-full">
        <FadeIn delay={100}>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-gray-500 mb-12">Last updated: October 2024</p>
        </FadeIn>

        <FadeIn delay={200} className="space-y-8 text-gray-700 leading-loose">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you use TL;DR. This includes the documents, text, and URLs you submit for processing to generate study materials. We do not require an account creation to use the core features, meaning we collect minimal personal identifiable information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Data</h2>
            <p>
              The materials you upload (PDFs, URLs, YouTube links) are processed temporarily by our AI models (including Groq's LLaMA models) strictly to generate summaries, flashcards, and quizzes. 
              <strong> We do not use your personal data or uploaded organization materials to train our models.</strong> 
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Retention</h2>
            <p>
              Uploaded documents and generated study materials are retained temporarily to allow you to interact with the AI tutor and mock interview systems during your session. We routinely clear our servers of temporary files to maintain your privacy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Third-Party Services</h2>
            <p>
              We utilize third-party AI providers (such as Groq) to process text. These providers are bound by strict data processing agreements that prevent them from storing your data for their own training purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us through our Contact page.
            </p>
          </section>
        </FadeIn>
      </main>
      <Footer />
    </div>
  );
}