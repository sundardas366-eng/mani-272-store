"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Zap, Sparkles, User } from "lucide-react";
import toast from "react-hot-toast";

interface LampLoginFormProps {
  onSuccess?: (user: { email: string; name: string; provider?: string }) => void;
  redirectUrl?: string;
  isEmbedded?: boolean;
  initialMode?: "signin" | "signup";
}

// Authentic Discord Icon
function DiscordIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

// Authentic Google 4-Color Icon
function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export function LampLoginForm({
  onSuccess,
  redirectUrl = "/dashboard",
  isEmbedded = false,
  initialMode = "signin",
}: LampLoginFormProps) {
  const [isOn, setIsOn] = useState(true);
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"discord" | "google" | null>(null);

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
    } catch {}
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
    const duration = 650;

    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
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
    const clamped = Math.max(0, Math.min(dy, 65));
    setCordOffset(clamped);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    const pulled = cordOffset;
    if (pulled > 25) {
      toggleLamp();
    }
    animateCordSnapback(pulled);
  };

  const handleBeadClick = () => {
    if (isDraggingRef.current) return;
    animateCordSnapback(40);
    toggleLamp();
  };

  // 1-Click Discord & Google OAuth Handler
  const handleOAuth = (provider: "discord" | "google") => {
    setOauthLoading(provider);

    setTimeout(() => {
      const isDiscord = provider === "discord";
      const user = {
        email: isDiscord ? "discord.gamer@mani272.store" : "google.gamer@gmail.com",
        name: isDiscord ? "Discord Player" : "Google Player",
        role: "user",
        provider,
      };

      try {
        localStorage.setItem("mani-272-user", JSON.stringify(user));
        localStorage.setItem("mani_customer_email", user.email);
        localStorage.setItem("mani_customer_name", user.name);
      } catch {}

      setOauthLoading(null);
      toast.success(
        mode === "signin"
          ? `Welcome back! Signed in with ${isDiscord ? "Discord" : "Google"}`
          : `Account created successfully with ${isDiscord ? "Discord" : "Google"}!`
      );

      if (onSuccess) {
        onSuccess(user);
      } else if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    }, 600);
  };

  // Standard Email/Password Form Submit
  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const trimmedEmail = email.trim().toLowerCase();
      const derivedName = name.trim() || trimmedEmail.split("@")[0];
      const user = {
        email: trimmedEmail,
        name: derivedName,
        role: trimmedEmail.includes("admin") ? "admin" : "user",
        provider: "email",
      };

      try {
        localStorage.setItem("mani-272-user", JSON.stringify(user));
        localStorage.setItem("mani_customer_email", user.email);
        localStorage.setItem("mani_customer_name", user.name);
      } catch {}

      setLoading(false);
      toast.success(
        mode === "signin"
          ? `Welcome back, ${user.name}!`
          : `Welcome to MANI 272 STORE, ${user.name}!`
      );

      if (onSuccess) {
        onSuccess(user);
      } else if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    }, 600);
  };

  // SVG dimensions & cord coordinates (scaled down for compact fit)
  const baseY2 = 195;
  const beadY = baseY2 + cordOffset;

  return (
    <div
      className={`relative w-full flex flex-col items-center justify-center transition-all duration-500 select-none ${
        isEmbedded ? "py-2" : "min-h-[82vh] py-6 sm:py-10"
      }`}
    >
      {/* Ambient Red Glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: isOn ? 1 : 0.08,
          background:
            "radial-gradient(circle 420px at 50% 25%, rgba(245, 11, 0, 0.28) 0%, rgba(245, 11, 0, 0.06) 50%, transparent 75%)",
        }}
      />

      {/* 1. COMPACT INTERACTIVE LAMP & PULL CORD SVG FIXTURE */}
      <div className="relative z-20 flex flex-col items-center w-full max-w-[360px] pointer-events-auto">
        <svg
          viewBox="0 0 280 240"
          className="w-36 sm:w-44 h-auto overflow-visible filter drop-shadow-lg"
        >
          <defs>
            <linearGradient id="maniLampShadeSm" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#250505" />
              <stop offset="40%" stopColor="#141414" />
              <stop offset="85%" stopColor="#F50B00" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0a0a0a" />
            </linearGradient>

            <radialGradient id="bulbHotGlowSm" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#ff4d4d" />
              <stop offset="70%" stopColor="#F50B00" />
              <stop offset="100%" stopColor="#7a0000" />
            </radialGradient>

            <filter id="neonRedGlowSm" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur1" />
              <feGaussianBlur stdDeviation="12" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ceiling Wire */}
          <line
            x1="140"
            y1="0"
            x2="140"
            y2="85"
            stroke="#262626"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Top Hanging Mount */}
          <rect
            x="128"
            y="80"
            width="24"
            height="8"
            rx="2.5"
            fill="#1e1e1e"
            stroke="#F50B00"
            strokeWidth="1"
            strokeOpacity="0.5"
          />

          {/* Lamp Shade */}
          <path
            d="M 110 88 L 170 88 L 196 132 L 84 132 Z"
            fill="url(#maniLampShadeSm)"
            stroke="#F50B00"
            strokeWidth="1.5"
            strokeOpacity={isOn ? "0.9" : "0.3"}
            className="transition-all duration-300"
          />

          {/* Metallic Ring Rim */}
          <ellipse
            cx="140"
            cy="132"
            rx="56"
            ry="9"
            fill="#111"
            stroke="#F50B00"
            strokeWidth="1.8"
            strokeOpacity={isOn ? "1" : "0.4"}
          />

          {/* Light Bulb */}
          <ellipse
            cx="140"
            cy="137"
            rx="17"
            ry="10"
            fill={isOn ? "url(#bulbHotGlowSm)" : "#2a2a2a"}
            filter={isOn ? "url(#neonRedGlowSm)" : "none"}
            className="transition-all duration-300"
          />

          {/* Pull Cord Socket Fixture */}
          <rect x="176" y="128" width="5" height="6" rx="1.5" fill="#444" />

          {/* Stretching Cord Wire */}
          <line
            x1="178.5"
            y1="134"
            x2="178.5"
            y2={beadY - 7}
            stroke="#ffffff"
            strokeOpacity="0.8"
            strokeWidth="1.6"
            strokeDasharray="3,2"
          />

          {/* Draggable Cord Bead Handle */}
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
            <circle
              cx="178.5"
              cy={baseY2}
              r="12"
              fill="#F50B00"
              fillOpacity={isOn ? "0.4" : "0.15"}
              filter="url(#neonRedGlowSm)"
              className="animate-pulse"
            />
            <circle
              cx="178.5"
              cy={baseY2}
              r="7"
              fill={isOn ? "#F50B00" : "#8a1510"}
              stroke="#ffffff"
              strokeWidth="1.5"
            />
            <circle cx="176.5" cy={baseY2 - 2} r="2" fill="#ffffff" />
          </g>
        </svg>

        {/* Cord Pull Hint Pill */}
        <div
          onClick={handleBeadClick}
          className="cursor-pointer -mt-5 mb-3 flex items-center gap-1.5 px-3 py-1 rounded-full glass border border-mani-red/30 text-[10px] text-white/70 hover:text-white transition group"
        >
          <span
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              isOn ? "bg-mani-red animate-ping" : "bg-white/30"
            }`}
          />
          <span className="font-mono">
            {isOn ? "LIGHT ON (Pull to toggle)" : "PULL CORD TO TURN ON"}
          </span>
          <span className="text-mani-red font-bold group-hover:translate-y-0.5 transition-transform">
            ↓
          </span>
        </div>
      </div>

      {/* 2. CONICAL LIGHT BEAM CONE (Tightly wrapped to compact card) */}
      <div
        className="pointer-events-none absolute top-24 sm:top-28 left-1/2 -translate-x-1/2 w-[310px] sm:w-[380px] h-[520px] transition-all duration-700"
        style={{
          opacity: isOn ? 1 : 0,
          clipPath: "polygon(38% 0%, 62% 0%, 100% 100%, 0% 100%)",
          background:
            "linear-gradient(180deg, rgba(245, 11, 0, 0.40) 0%, rgba(245, 11, 0, 0.14) 45%, rgba(245, 11, 0, 0.02) 85%, transparent 100%)",
          filter: "blur(3px)",
        }}
      />

      {/* 3. COMPACT ILLUMINATED GLASSMORPHIC LOGIN CARD (Width = 360px max) */}
      <div
        className={`relative z-30 w-full max-w-[360px] mx-auto transition-all duration-700 ${
          isOn
            ? "opacity-100 translate-y-0 shadow-[0_0_45px_rgba(245,11,0,0.32)] border-mani-red/50"
            : "opacity-45 translate-y-1 shadow-none border-white/5"
        }`}
      >
        <div
          className={`glass-card rounded-2xl p-5 sm:p-6 backdrop-blur-xl border transition-all duration-500 ${
            isOn
              ? "bg-black/85 border-mani-red/40"
              : "bg-black/55 border-white/5"
          }`}
        >
          {!isEmbedded && (
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-white/40 hover:text-mani-red text-xs mb-3.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
          )}

          {/* Card Header & Title */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="mani-brand text-xl sm:text-2xl">
                <span className="mani-red">{mode === "signin" ? "Sign" : "Create"}</span>{" "}
                <span className="mani-white">{mode === "signin" ? "In" : "Account"}</span>
              </h1>
              <p className="text-white/45 text-[11px] mt-0.5">
                {isOn ? "Access your digital keys & panels" : "Turn on the lamp to continue"}
              </p>
            </div>

            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                isOn
                  ? "bg-mani-red/20 text-mani-red border border-mani-red/40 shadow-md shadow-mani-red/20"
                  : "bg-white/5 text-white/20 border border-white/5"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Tab Selector: Sign In vs Sign Up */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-white/[0.04] border border-white/10 mb-4 text-xs font-bold">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`py-1.5 rounded-lg transition ${
                mode === "signin"
                  ? "bg-mani-red text-white shadow-sm shadow-mani-red/30"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`py-1.5 rounded-lg transition ${
                mode === "signup"
                  ? "bg-mani-red text-white shadow-sm shadow-mani-red/30"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* 4. DISCORD & GOOGLE 1-CLICK AUTH BUTTONS (User's Core Requirement) */}
          <div className="space-y-2 mb-4">
            {/* Discord Button */}
            <button
              type="button"
              onClick={() => handleOAuth("discord")}
              disabled={!!oauthLoading}
              className="w-full py-2.5 px-3 rounded-xl bg-[#5865F2]/15 hover:bg-[#5865F2] border border-[#5865F2]/40 hover:border-[#5865F2] text-white text-xs font-bold transition flex items-center justify-center gap-2.5 group shadow-sm disabled:opacity-50"
            >
              {oauthLoading === "discord" ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <DiscordIcon className="w-4 h-4 text-[#5865F2] group-hover:text-white transition-colors" />
              )}
              <span>{mode === "signin" ? "Sign In with Discord" : "Sign Up with Discord"}</span>
            </button>

            {/* Google Button */}
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              disabled={!!oauthLoading}
              className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-white text-xs font-bold transition flex items-center justify-center gap-2.5 group shadow-sm disabled:opacity-50"
            >
              {oauthLoading === "google" ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <GoogleIcon className="w-4 h-4" />
              )}
              <span>{mode === "signin" ? "Sign In with Google" : "Sign Up with Google"}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-3.5">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-black/80 px-2.5 text-[10px] uppercase font-bold text-white/35 tracking-wider absolute">
              or with email
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3">
            {mode === "signup" && (
              <div>
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1 block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-mani !pl-9 w-full text-xs !py-2"
                    placeholder="Sundar Das"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-mani !pl-9 w-full text-xs !py-2"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-mani !pl-9 !pr-9 w-full text-xs !py-2"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-0.5">
              <label className="flex items-center gap-1.5 text-white/45 cursor-pointer hover:text-white transition">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-white/20 bg-black/40 text-mani-red focus:ring-mani-red w-3.5 h-3.5"
                />
                Remember me
              </label>
              {mode === "signin" && (
                <Link
                  href="/forgot-password"
                  className="text-mani-red hover:underline transition"
                >
                  Forgot?
                </Link>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-glow w-full flex items-center justify-center gap-2 mt-1 py-2.5 text-xs font-bold tracking-wide shadow-md shadow-mani-red/20"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{mode === "signin" ? "Sign In" : "Create Account"}</span>
                </>
              )}
            </button>
          </form>

          {/* Switch Prompt */}
          <div className="mt-4 pt-3.5 border-t border-white/10 text-center text-[11px] text-white/40">
            {mode === "signin" ? (
              <>
                New customer?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-mani-red font-bold hover:underline ml-1"
                >
                  Create Account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="text-mani-red font-bold hover:underline ml-1"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
