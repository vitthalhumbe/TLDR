"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
            <Link href="/support" className={`flex items-center gap-2 text-sm transition-colors ${pathname === "/support" ? "font-bold text-gray-900" : "font-medium text-gray-500 hover:text-gray-900"}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.5v-.5a2.25 2.25 0 0 0-4.5 0v.5m-3 0h10.5a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-10.5a2.25 2.25 0 0 1-2.25-2.25v-7.5a2.25 2.25 0 0 1 2.25-2.25Z" />
              </svg>
              Buy me a coffee
            </Link>
          </li>
        </ul>

        {/* Mobile Hamburger Button */}
        <button 
          type="button"
          className="md:hidden relative z-[60] p-4 -mr-4 text-gray-900 bg-transparent outline-none cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-7 h-7 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
               <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown (Using CSS Transitions instead of Conditional Rendering) */}
      <div 
        className={`md:hidden fixed top-20 left-0 w-full h-screen bg-white transition-all duration-300 ease-in-out origin-top z-40 ${
          mobileMenuOpen ? "opacity-100 scale-y-100 visible" : "opacity-0 scale-y-0 invisible"
        }`}
      >
        <div className="flex flex-col gap-8 px-8 py-10">
          <Link href="/" className="text-xl font-medium text-gray-900 w-full border-b border-gray-100 pb-4">Overview</Link>
          <Link href="/study" className="text-xl font-medium text-gray-900 w-full border-b border-gray-100 pb-4">Study</Link>
          <Link href="/support" className="text-xl font-medium text-gray-900 w-full border-b border-gray-100 pb-4">Buy me a coffee</Link>
        </div>
      </div>
    </header>
  );
}