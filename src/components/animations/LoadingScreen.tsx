"use client";

import { useEffect, useState } from "react";

const LOGO_URL = "/images/logo/mani-272-logo.gif";

export function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-mani-black flex flex-col items-center justify-center">
      {/* Official logo with glow */}
      <div className="relative">
        <div className="absolute inset-0 bg-mani-red/20 rounded-full blur-2xl animate-glow-pulse" />
        <img
          src={LOGO_URL}
          alt="MANI 272"
          className="relative w-20 h-20 rounded-2xl object-cover shadow-glow-red-lg animate-scale-in"
        />
      </div>
      <div className="mt-6 mani-brand text-xl">
        <span className="mani-red">MANI</span> <span className="mani-white">272</span>
      </div>
      <div className="text-white/30 text-sm mt-2 animate-pulse">Loading...</div>
    </div>
  );
}
