"use client";

import { useEffect, useState } from "react";

export function ParticleBackground() {
  const [particles, setParticles] = useState<
    { left: number; duration: number; delay: number; size: number; opacity: number }[]
  >([]);

  useEffect(() => {
    const arr = Array.from({ length: 30 }).map(() => ({
      left: Math.random() * 100,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 20,
      size: 2 + Math.random() * 4,
      opacity: 0.2 + Math.random() * 0.3,
    }));
    setParticles(arr);
  }, []);

  return (
    <div className="particles-bg">
      {particles.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
