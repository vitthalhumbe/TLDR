"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const submit = async () => {
    setError("");
    setInfo("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setInfo("Check your email to confirm your account, then log in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10">
        <h1 className="text-2xl font-bold mb-2">{mode === "login" ? "Welcome back" : "Create account"}</h1>
        <p className="text-gray-500 text-sm mb-8">
          {mode === "login" ? "Log in to your TLDR account." : "Sign up to start learning."}
        </p>

        <div className="flex flex-col gap-4 mb-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-100 rounded-lg px-4 py-3">{error}</p>}
        {info && <p className="text-green-600 text-sm mb-4 bg-green-50 border border-green-100 rounded-lg px-4 py-3">{info}</p>}

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-black text-white font-semibold py-4 rounded-full hover:bg-gray-800 transition-all disabled:opacity-70 text-sm"
        >
          {loading ? "Please wait..." : mode === "login" ? "Log In" : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setInfo(""); }}
            className="font-semibold text-gray-900 hover:underline"
          >
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}