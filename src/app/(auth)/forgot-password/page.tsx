"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { Navbar } from "@/components/layout/Navbar";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Demo — replace with Supabase auth.resetPasswordForEmail in production.
    //   await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/reset-password` })
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast.success("Reset link sent to your email");
    }, 800);
  };

  return (
    <>
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="glass-card rounded-3xl p-8 max-w-md w-full">
          <Link href="/login" className="inline-flex items-center gap-2 text-white/40 hover:text-mani-red text-sm mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>

          <h1 className="mani-brand text-2xl mb-2">
            <span className="mani-red">Forgot</span> <span className="mani-white">Password</span>
          </h1>

          {sent ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📧</div>
              <p className="text-white/60 mb-2">Reset link sent!</p>
              <p className="text-white/30 text-sm">Check your email for instructions to reset your password.</p>
              <Link href="/login" className="btn-glow inline-block mt-6">Back to Login</Link>
            </div>
          ) : (
            <>
              <p className="text-white/40 text-sm mb-6">Enter your email to receive a password reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-mani pl-10" placeholder="you@example.com" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-glow w-full disabled:opacity-50">
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </>
  );
}
