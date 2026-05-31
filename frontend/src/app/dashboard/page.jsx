"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { api } from "@/lib/api";

function SourceIcon({ type }) {
  if (type === "pdf") return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v6h6v10H6z"/>
    </svg>
  );
  if (type === "youtube") return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

function typeLabel(type) {
  if (type === "pdf") return "PDF";
  if (type === "youtube") return "YouTube";
  return "Web Article";
}

function typeColors(type) {
  if (type === "pdf") return "bg-blue-50 text-blue-600";
  if (type === "youtube") return "bg-red-50 text-red-500";
  return "bg-purple-50 text-purple-600";
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    api.get("/material/")
      .then(res => setMaterials(res.data.materials))
      .catch(() => setError("Failed to load materials."))
      .finally(() => setLoading(false));
  }, [authLoading]);

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-6 max-w-6xl mx-auto w-full">
        <FadeIn delay={0} className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">My Library</h1>
            <p className="text-gray-500 mt-2 text-sm">All your uploaded study materials.</p>
          </div>
          <Link
            href="/study"
            className="bg-black text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            New Upload <span className="text-base leading-none">+</span>
          </Link>
        </FadeIn>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-[2rem] border border-gray-100 p-8 animate-pulse">
                <div className="w-10 h-10 bg-gray-100 rounded-full mb-6" />
                <div className="h-5 bg-gray-100 rounded-full w-3/4 mb-3" />
                <div className="h-3 bg-gray-100 rounded-full w-1/3" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-24 text-red-500 font-medium">{error}</div>
        )}

        {!loading && !error && materials.length === 0 && (
          <FadeIn delay={100} className="text-center py-32">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3">No materials yet</h2>
            <p className="text-gray-500 mb-8 text-sm">Upload a PDF, YouTube link, or web article to get started.</p>
            <Link href="/study" className="bg-black text-white font-semibold px-8 py-4 rounded-full hover:bg-gray-800 transition-colors text-sm">
              Upload your first material →
            </Link>
          </FadeIn>
        )}

        {!loading && !error && materials.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((m, i) => (
              <FadeIn key={m.id} delay={i * 60}>
                <Link href={`/study/${m.id}`} className="group block bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md hover:border-gray-200 transition-all">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${typeColors(m.source_type)}`}>
                      <SourceIcon type={m.source_type} />
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${typeColors(m.source_type)}`}>
                      {typeLabel(m.source_type)}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg leading-snug mb-3 group-hover:text-black line-clamp-2">
                    {m.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium">{formatDate(m.created_at)}</p>
                </Link>
              </FadeIn>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}