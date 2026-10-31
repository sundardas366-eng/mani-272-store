"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { Navbar } from "@/components/layout/Navbar";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
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

    // Demo registration — replace with Supabase auth.signUp in production.
    // When Supabase is configured:
    //   const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
    setTimeout(() => {
      const user = { email, name, role: "user" };
      localStorage.setItem("mani-272-user", JSON.stringify(user));
      setLoading(false);
      toast.success("Account created successfully");
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
            <span className="mani-red">Create</span> <span className="mani-white">Account</span>
          </h1>
          <p className="text-white/40 text-sm mb-6">Join MANI 272 STORE today.</p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="input-mani pl-10" placeholder="Your name" />
              </div>
            </div>
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
            <div>
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type={showPass ? "text" : "password"} required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input-mani pl-10" placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-glow w-full disabled:opacity-50">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-mani-red hover:underline">Sign in</Link>
          </p>
        </div>
      </main>
    </>
  );
}
