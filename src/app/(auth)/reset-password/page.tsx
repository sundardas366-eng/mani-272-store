"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, ArrowLeft } from "lucide-react";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { Navbar } from "@/components/layout/Navbar";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);

    // Demo — replace with Supabase auth.updateUser in production.
    //   const { error } = await supabase.auth.updateUser({ password })
    setTimeout(() => {
      setLoading(false);
      toast.success("Password reset successfully");
      window.location.href = "/login";
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
            <span className="mani-red">Reset</span> <span className="mani-white">Password</span>
          </h1>
          <p className="text-white/40 text-sm mb-6">Enter your new password.</p>

          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-mani pl-10" placeholder="••••••••" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input-mani pl-10" placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-glow w-full disabled:opacity-50">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
