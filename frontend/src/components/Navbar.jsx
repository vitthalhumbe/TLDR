"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const initial = user?.email?.[0]?.toUpperCase();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#fafafa] border-b border-gray-200">
      <div className="flex items-center justify-between px-6 md:px-16 h-20 relative z-50 bg-[#fafafa]">
        <Link href="/" className="text-2xl font-bold tracking-tight relative z-[60]">TL;DR</Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 list-none">
          <li>
            <Link href="/" className={`text-sm transition-colors ${pathname === "/" ? "font-bold text-gray-900" : "font-medium text-gray-500 hover:text-gray-900"}`}>
              Overview
            </Link>
          </li>
          <li>
            <Link href="/study" className={`text-sm transition-colors ${pathname.includes("/study") ? "font-bold text-gray-900" : "font-medium text-gray-500 hover:text-gray-900"}`}>
              Study
            </Link>
          </li>
          <li>
            <Link href="/support" className={`text-sm transition-colors ${pathname === "/support" ? "font-bold text-gray-900" : "font-medium text-gray-500 hover:text-gray-900"}`}>
              Buy me a coffee
            </Link>
          </li>
          <li>
  <Link href="/dashboard" className={`text-sm transition-colors ${pathname === "/dashboard" ? "font-bold text-gray-900" : "font-medium text-gray-500 hover:text-gray-900"}`}>
    Dashboard
  </Link>
</li>
          <li>
            {user ? (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
                  {initial}
                </div>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="text-sm font-semibold bg-black text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
              >
                Log in
              </Link>
            )}
          </li>
        </ul>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className="md:hidden relative z-[60] p-4 -mr-4 text-gray-900 bg-transparent outline-none cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-7 h-7 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {mobileMenuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed top-20 left-0 w-full h-screen bg-white transition-all duration-300 ease-in-out origin-top z-40 ${
        mobileMenuOpen ? "opacity-100 scale-y-100 visible" : "opacity-0 scale-y-0 invisible"
      }`}>
        <div className="flex flex-col gap-8 px-8 py-10">
          <Link href="/" className="text-xl font-medium text-gray-900 w-full border-b border-gray-100 pb-4">Overview</Link>
          <Link href="/study" className="text-xl font-medium text-gray-900 w-full border-b border-gray-100 pb-4">Study</Link>
          <Link href="/support" className="text-xl font-medium text-gray-900 w-full border-b border-gray-100 pb-4">Buy me a coffee</Link>
          <Link href="/dashboard" className="text-xl font-medium text-gray-900 w-full border-b border-gray-100 pb-4">Dashboard</Link>
          {user ? (
            <div className="flex flex-col gap-4 border-b border-gray-100 pb-4">
              <span className="text-sm text-gray-500">{user.email}</span>
              <button onClick={logout} className="text-xl font-medium text-gray-900 text-left">Log out</button>
            </div>
          ) : (
            <Link href="/auth" className="text-xl font-medium text-gray-900 w-full border-b border-gray-100 pb-4">Log in</Link>
          )}
        </div>
      </div>
    </header>
  );
}