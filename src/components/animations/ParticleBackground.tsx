"use client";

import { useEffect, useState } from "react";

export function ParticleBackground() {
  const [particles, setParticles] = useState<
    {
      left: number;
      duration: number;
      delay: number;
      size: number;
      opacity: number;
      color: string;
    }[]
  >([]);

  useEffect(() => {
    // Generate subtle cyber red/white floating embers
    const arr = Array.from({ length: 35 }).map(() => {
      const isRed = Math.random() > 0.3;
      return {
        left: Math.random() * 100,
        duration: 12 + Math.random() * 18,
        delay: Math.random() * 15,
        size: 1.5 + Math.random() * 3,
        opacity: 0.15 + Math.random() * 0.4,
        color: isRed ? "rgba(245, 11, 0, 0.7)" : "rgba(255, 255, 255, 0.4)",
      };
    });
    setParticles(arr);
  }, []);

  return (
    <div className="particles-bg">
      {/* 1. Slowly moving ambient gradient mesh */}
      <div className="absolute inset-0 bg-ambient-mesh opacity-40 pointer-events-none" />

      {/* 2. Soft pulsing red radial orbs */}
      <div className="absolute top-[-10%] left-[15%] w-[500px] h-[500px] rounded-full bg-mani-red/10 blur-[140px] animate-pulse-slow pointer-events-none" />
      <div className="absolute top-[45%] right-[-5%] w-[600px] h-[600px] rounded-full bg-mani-red/8 blur-[160px] animate-pulse-slow pointer-events-none animation-delay-3000" />
      <div className="absolute bottom-[-10%] left-[30%] w-[550px] h-[550px] rounded-full bg-mani-red/10 blur-[150px] animate-pulse-slow pointer-events-none animation-delay-6000" />

      {/* 3. Floating embers / particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
