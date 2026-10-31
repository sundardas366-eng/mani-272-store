"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { Navbar } from "@/components/layout/Navbar";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Demo auth — replace with Supabase auth in production.
    // When Supabase is configured, use:
    //   const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setTimeout(() => {
      // Demo: store a mock session
      const user = { email, name: email.split("@")[0], role: "user" };
      localStorage.setItem("mani-272-user", JSON.stringify(user));
      setLoading(false);
      toast.success("Logged in successfully");
      window.location.href = "/dashboard";
    }, 800);
  };

  return (
    <>
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="glass-card rounded-3xl p-8 max-w-md w-full">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-mani-red text-sm mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <h1 className="mani-brand text-2xl mb-2">
            <span className="mani-red">Sign</span> <span className="mani-white">In</span>
          </h1>
          <p className="text-white/40 text-sm mb-6">Welcome back. Please sign in to continue.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-mani pl-10" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type={showPass ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="input-mani pl-10 pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-white/40 cursor-pointer">
                <input type="checkbox" className="rounded" /> Remember me
              </label>
              <Link href="/forgot-password" className="text-mani-red hover:underline">Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading} className="btn-glow w-full disabled:opacity-50">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-mani-red hover:underline">Sign up</Link>
          </p>
        </div>
      </main>
    </>
  );
}
