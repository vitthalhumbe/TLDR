"use client";
import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function SupportPage() {
  // --- State for the form ---
  const [selectedCoffee, setSelectedCoffee] = useState(1); // 1, 2, 5, or 'custom'
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  // Calculate the total amount for the submit button
  const totalAmount = selectedCoffee === "custom" 
    ? (customAmount === "" ? 0 : parseInt(customAmount)) 
    : selectedCoffee * 100;

  // Coffee cup SVG icon
  const CoffeeIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M4 19h16v2H4v-2zm14-11V6c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v7c0 2.21 1.79 4 4 4h6c1.86 0 3.41-1.28 3.86-3h1.14c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2h-1zm-4 5H6V6h8v7zm3-1h-1V10h1v3z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans flex flex-col">
      
      {/* NAVBAR */}
      <Navbar/>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-24 animate-in fade-in duration-700">
        
        <div className="text-center mb-10 max-w-md">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Support TL;DR Academic</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            If you find our tools helpful, consider buying us a coffee to keep the project running.
          </p>
        </div>

        <div className="w-full max-w-2xl bg-transparent">
          
          {/* Section 1: Select Amount */}
          <div className="mb-8">
            <label className="block text-sm font-bold tracking-wide mb-3">Select Amount</label>
            <div className="flex flex-wrap gap-3">
              {[
                { value: 1, label: "1 (₹100)" },
                { value: 2, label: "2 (₹200)" },
                { value: 5, label: "5 (₹500)" }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSelectedCoffee(option.value);
                    setCustomAmount("");
                  }}
                  className={`flex items-center gap-2 px-6 py-3.5 rounded-full border transition-all ${
                    selectedCoffee === option.value
                      ? "bg-black text-white border-black font-semibold"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <CoffeeIcon />
                  {option.label}
                </button>
              ))}

              {/* Custom Amount Button/Input */}
              <div 
                className={`flex items-center px-4 py-2 rounded-full border transition-all bg-white ${
                  selectedCoffee === "custom" ? "border-black ring-1 ring-black" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedCoffee("custom")}
              >
                <span className="text-gray-500 mr-2 font-medium">₹</span>
                <input
                  type="number"
                  placeholder="Custom"
                  value={customAmount}
                  onChange={(e) => {
                    setSelectedCoffee("custom");
                    setCustomAmount(e.target.value);
                  }}
                  className="w-24 outline-none bg-transparent text-gray-700 placeholder-gray-400"
                />
                <div className="flex flex-col ml-1 text-gray-300">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8l4 4H8z"/></svg>
                  <svg className="w-3 h-3 -mt-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 16l-4-4h8z"/></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Name */}
          <div className="mb-8">
            <label className="block text-sm font-bold tracking-wide mb-3">Name (Optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-5 py-4 rounded-3xl border border-gray-200 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all bg-white text-gray-800"
            />
          </div>

          {/* Section 3: Message */}
          <div className="mb-10">
            <label className="block text-sm font-bold tracking-wide mb-3">Personal Message (Optional)</label>
            <textarea
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Thanks for the great tool!"
              className="w-full px-5 py-4 rounded-[2rem] border border-gray-200 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all bg-white text-gray-800 resize-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button 
            disabled={totalAmount <= 0}
            className="w-full bg-black text-white text-xl font-bold px-6 py-5 rounded-[2.5rem] hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/10"
          >
            Support with ₹{totalAmount || 0}
          </button>

        </div>
      </main>

      {/* DARK FOOTER */}
      <Footer/>
    </div>
  );
}