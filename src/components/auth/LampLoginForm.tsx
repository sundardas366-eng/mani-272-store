"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Zap, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

interface LampLoginFormProps {
  onSuccess?: (user: { email: string; name: string }) => void;
  redirectUrl?: string;
  isEmbedded?: boolean;
}

export function LampLoginForm({
  onSuccess,
  redirectUrl = "/dashboard",
  isEmbedded = false,
}: LampLoginFormProps) {
  const [isOn, setIsOn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cord dragging physics state
  const [cordOffset, setCordOffset] = useState(0);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const cordAnimRef = useRef<number | null>(null);

  // Audio click synthesizer
  const playClickSound = useCallback((turningOn: boolean) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(turningOn ? 900 : 450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // AudioContext may be restricted by browser policy before user interaction
    }
  }, []);

  const toggleLamp = useCallback(() => {
    setIsOn((prev) => {
      const next = !prev;
      playClickSound(next);
      return next;
    });
  }, [playClickSound]);

  // Spring physics bounce snapback
  const animateCordSnapback = useCallback((fromY: number) => {
    if (cordAnimRef.current) cancelAnimationFrame(cordAnimRef.current);
    const start = performance.now();
    const duration = 650; // ms

    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // Damped harmonic oscillation curve
      const decay = Math.exp(-6 * t);
      const oscillation = Math.cos(20 * t);
      const current = fromY * decay * oscillation;

      setCordOffset(current);

      if (t < 1) {
        cordAnimRef.current = requestAnimationFrame(step);
      } else {
        setCordOffset(0);
      }
    };

    cordAnimRef.current = requestAnimationFrame(step);
  }, []);

  // Pointer drag handlers for cord bead
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dy = e.clientY - startYRef.current;
    // Constrain downward dragging between 0 and 70px
    const clamped = Math.max(0, Math.min(dy, 75));
    setCordOffset(clamped);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    const pulled = cordOffset;
    if (pulled > 30) {
      // Trigger toggle
      toggleLamp();
    }
    animateCordSnapback(pulled);
  };

  // Direct click fallback on the cord bead
  const handleBeadClick = () => {
    if (isDraggingRef.current) return;
    animateCordSnapback(45);
    toggleLamp();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const user = {
        email: email.trim().toLowerCase(),
        name: email.split("@")[0],
        role: email.includes("admin") ? "admin" : "user",
      };

      try {
        localStorage.setItem("mani-272-user", JSON.stringify(user));
        localStorage.setItem("mani_customer_email", user.email);
        localStorage.setItem("mani_customer_name", user.name);
      } catch {}

      setLoading(false);
      toast.success(`Welcome back, ${user.name}!`);

      if (onSuccess) {
        onSuccess(user);
      } else if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    }, 700);
  };

  // SVG dimensions & cord coordinates
  const baseY2 = 240;
  const beadY = baseY2 + cordOffset;

  return (
    <div
      className={`relative w-full flex flex-col items-center justify-center transition-all duration-700 select-none ${
        isEmbedded ? "py-4" : "min-h-[85vh] py-12"
      }`}
    >
      {/* Dynamic Ambient Background Glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: isOn ? 1 : 0.08,
          background:
            "radial-gradient(circle 500px at 50% 28%, rgba(245, 11, 0, 0.28) 0%, rgba(245, 11, 0, 0.08) 50%, transparent 75%)",
        }}
      />

      {/* 1. INTERACTIVE LAMP & PULL CORD SVG FIXTURE */}
      <div className="relative z-20 flex flex-col items-center w-full max-w-[420px] pointer-events-auto">
        <svg
          viewBox="0 0 320 290"
          className="w-48 sm:w-56 h-auto overflow-visible filter drop-shadow-xl"
        >
          <defs>
            {/* MANI RED Metallic Lamp Gradient */}
            <linearGradient id="maniLampShade" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#250505" />
              <stop offset="40%" stopColor="#141414" />
              <stop offset="85%" stopColor="#F50B00" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0a0a0a" />
            </linearGradient>

            {/* Glowing Bulb Gradient (Red & Hot White) */}
            <radialGradient id="bulbHotGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#ff4d4d" />
              <stop offset="70%" stopColor="#F50B00" />
              <stop offset="100%" stopColor="#7a0000" />
            </radialGradient>

            {/* Light Cone Gradient */}
            <linearGradient id="lightConeGrad" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#F50B00" stopOpacity="0.55" />
              <stop offset="25%" stopColor="#F50B00" stopOpacity="0.30" />
              <stop offset="70%" stopColor="#F50B00" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#F50B00" stopOpacity="0.00" />
            </linearGradient>

            {/* Neon Glow Filter */}
            <filter id="neonRedGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur1" />
              <feGaussianBlur stdDeviation="14" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ceiling Wire */}
          <line
            x1="160"
            y1="0"
            x2="160"
            y2="105"
            stroke="#262626"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Top Hanging Mount */}
          <rect
            x="146"
            y="98"
            width="28"
            height="10"
            rx="3"
            fill="#1e1e1e"
            stroke="#F50B00"
            strokeWidth="1"
            strokeOpacity="0.5"
          />

          {/* Lamp Shade (Conical Fixture) */}
          <path
            d="M 125 108 L 195 108 L 225 160 L 95 160 Z"
            fill="url(#maniLampShade)"
            stroke="#F50B00"
            strokeWidth="1.5"
            strokeOpacity={isOn ? "0.9" : "0.3"}
            className="transition-all duration-300"
          />

          {/* Metallic Ring Rim */}
          <ellipse
            cx="160"
            cy="160"
            rx="65"
            ry="11"
            fill="#111"
            stroke="#F50B00"
            strokeWidth="2"
            strokeOpacity={isOn ? "1" : "0.4"}
          />

          {/* Light Bulb */}
          <ellipse
            cx="160"
            cy="166"
            rx="20"
            ry="12"
            fill={isOn ? "url(#bulbHotGlow)" : "#2a2a2a"}
            filter={isOn ? "url(#neonRedGlow)" : "none"}
            className="transition-all duration-300"
          />

          {/* PULL CORD FIXTURE (Originates from lamp rim right side) */}
          {/* Upper socket fixture */}
          <rect x="202" y="156" width="6" height="7" rx="1.5" fill="#444" />

          {/* Stretching Cord Wire */}
          <line
            x1="205"
            y1="162"
            x2="205"
            y2={beadY - 8}
            stroke="#ffffff"
            strokeOpacity="0.8"
            strokeWidth="1.8"
            strokeDasharray="3,2"
          />

          {/* Draggable Cord Bead / Handle (Interactive Click & Drag) */}
          <g
            className="cursor-grab active:cursor-grabbing hover:scale-110 transition-transform origin-center"
            style={{
              transform: `translate(0px, ${cordOffset}px)`,
              transition: isDraggingRef.current ? "none" : "transform 0.05s ease-out",
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onClick={handleBeadClick}
          >
            {/* Glow Aura for cord bead */}
            <circle
              cx="205"
              cy={baseY2}
              r="14"
              fill="#F50B00"
              fillOpacity={isOn ? "0.35" : "0.15"}
              filter="url(#neonRedGlow)"
              className="animate-pulse"
            />
            {/* Inner Bead Sphere */}
            <circle
              cx="205"
              cy={baseY2}
              r="8"
              fill={isOn ? "#F50B00" : "#8a1510"}
              stroke="#ffffff"
              strokeWidth="1.8"
            />
            {/* Center metallic highlight */}
            <circle cx="203" cy={baseY2 - 2} r="2.5" fill="#ffffff" />
          </g>
        </svg>

        {/* Cord Pull Interactive Hint Tooltip */}
        <div
          onClick={handleBeadClick}
          className="cursor-pointer -mt-4 mb-2 flex items-center gap-1.5 px-3 py-1 rounded-full glass border border-mani-red/30 text-[11px] text-white/70 hover:text-white transition group"
        >
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              isOn ? "bg-mani-red animate-ping" : "bg-white/30"
            }`}
          />
          <span className="font-mono">
            {isOn ? "LIGHT: ON (Pull cord to switch)" : "PULL CORD TO TURN ON"}
          </span>
          <span className="text-mani-red font-bold group-hover:translate-y-0.5 transition-transform">
            ↓
          </span>
        </div>
      </div>

      {/* 2. CONICAL LIGHT BEAM CONE (Illuminates down onto the form) */}
      <div
        className="pointer-events-none absolute top-28 sm:top-36 left-1/2 -translate-x-1/2 w-[340px] sm:w-[480px] h-[550px] transition-all duration-700"
        style={{
          opacity: isOn ? 1 : 0,
          clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)",
          background:
            "linear-gradient(180deg, rgba(245, 11, 0, 0.42) 0%, rgba(245, 11, 0, 0.16) 45%, rgba(245, 11, 0, 0.02) 85%, transparent 100%)",
          filter: "blur(4px)",
        }}
      />

      {/* 3. ILLUMINATED GLASSMORPHIC LOGIN CARD */}
      <div
        className={`relative z-30 w-full max-w-md mx-auto transition-all duration-700 ${
          isOn
            ? "opacity-100 translate-y-0 shadow-[0_0_55px_rgba(245,11,0,0.30)] border-mani-red/50"
            : "opacity-40 translate-y-2 shadow-none border-white/5"
        }`}
      >
        <div
          className={`glass-card rounded-3xl p-6 sm:p-8 backdrop-blur-xl border transition-all duration-500 ${
            isOn
              ? "bg-black/80 border-mani-red/40"
              : "bg-black/50 border-white/5"
          }`}
        >
          {!isEmbedded && (
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/40 hover:text-mani-red text-xs sm:text-sm mb-5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          )}

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="mani-brand text-2xl sm:text-3xl">
                <span className="mani-red">Sign</span>{" "}
                <span className="mani-white">In</span>
              </h1>
              <p className="text-white/40 text-xs sm:text-sm mt-0.5">
                {isOn ? "Access your customer keys & dashboard" : "Turn on the lamp to sign in"}
              </p>
            </div>

            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                isOn
                  ? "bg-mani-red/20 text-mani-red border border-mani-red/40 shadow-lg shadow-mani-red/20"
                  : "bg-white/5 text-white/20 border border-white/5"
              }`}
            >
              <Zap className="w-4 h-4" />
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 mt-6">
            <div>
              <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-mani pl-10 w-full text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-mani pl-10 pr-10 w-full text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-white/50 cursor-pointer hover:text-white transition">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-white/20 bg-black/40 text-mani-red focus:ring-mani-red"
                />
                Remember me
              </label>
              <Link
                href="/forgot-password"
                className="text-mani-red hover:underline transition"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-glow w-full flex items-center justify-center gap-2 mt-2 py-3 text-sm font-bold tracking-wide"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center text-xs text-white/40">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-mani-red font-bold hover:underline ml-1">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
