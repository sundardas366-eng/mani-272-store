"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  isRed: boolean;
  baseAlpha: number;
  pulse: number;
  pulseSpeed: number;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false });
  const rafId = useRef<number | null>(null);
  const isTabVisible = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic particle count based on screen size
    const getParticleCount = () => {
      if (width < 768) return 25;
      if (width < 1200) return 45;
      return 65;
    };

    const getConnectionDistance = () => {
      return width < 768 ? 75 : 115;
    };

    let particles: Particle[] = [];

    const createParticle = (): Particle => {
      const type = Math.random();
      const isRed = type < 0.55;
      const isWhite = !isRed && type < 0.85;

      const color = isRed
        ? "#F50B00"
        : isWhite
        ? "#FFFFFF"
        : "#9CA3AF";

      const speedMultiplier = prefersReducedMotion ? 0.08 : 0.35;
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.2 + Math.random() * 0.4) * speedMultiplier;

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: isRed ? 1.5 + Math.random() * 1.5 : 1.2 + Math.random() * 1.2,
        color,
        isRed,
        baseAlpha: isRed ? 0.45 + Math.random() * 0.4 : 0.3 + Math.random() * 0.35,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      };
    };

    const initParticles = () => {
      const count = getParticleCount();
      particles = Array.from({ length: count }, () => createParticle());
    };

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      initParticles();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Track mouse movement
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.active = true;
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    // Handle tab visibility to pause animations and conserve CPU/battery
    const onVisibilityChange = () => {
      isTabVisible.current = !document.hidden;
      if (isTabVisible.current && !rafId.current) {
        rafId.current = requestAnimationFrame(animate);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Smooth lerp for mouse glow
    let glowX = width / 2;
    let glowY = height / 2;

    const animate = () => {
      if (!isTabVisible.current) {
        rafId.current = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse position update
      if (mouseRef.current.active) {
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.2;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.2;
      } else {
        mouseRef.current.x = -1000;
        mouseRef.current.y = -1000;
      }

      // Smooth mouse ambient glow translation
      if (glowRef.current && mouseRef.current.active) {
        glowX += (mouseRef.current.x - glowX) * 0.08;
        glowY += (mouseRef.current.y - glowY) * 0.08;
        glowRef.current.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
        glowRef.current.style.opacity = "1";
      } else if (glowRef.current) {
        glowRef.current.style.opacity = "0";
      }

      const connectDist = getConnectionDistance();
      const mouseRadius = 140;

      // 1. Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen edges smoothly
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;

        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        // Subtle pulsing brightness
        p.pulse += p.pulseSpeed;
        const currentAlpha = Math.max(
          0.1,
          p.baseAlpha + Math.sin(p.pulse) * 0.2
        );

        // Mouse attraction & gentle repulsion
        if (mouseRef.current.active) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouseRadius && dist > 0) {
            // Repulsion force pushing away gently
            const force = (1 - dist / mouseRadius) * 1.6;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;

            // Connect subtle interactive laser line from mouse to nearby particle
            const mouseLineAlpha = (1 - dist / mouseRadius) * 0.22;
            ctx.beginPath();
            ctx.moveTo(mouseRef.current.x, mouseRef.current.y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(245, 11, 0, ${mouseLineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw particle dot with glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.isRed) {
          ctx.shadowColor = "#F50B00";
          ctx.shadowBlur = 8;
          ctx.fillStyle = `rgba(245, 11, 0, ${currentAlpha})`;
        } else {
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
          ctx.fillStyle =
            p.color === "#FFFFFF"
              ? `rgba(255, 255, 255, ${currentAlpha})`
              : `rgba(160, 160, 175, ${currentAlpha})`;
        }

        ctx.fill();
      }

      ctx.shadowBlur = 0;

      // 2. Draw connected lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < connectDist) {
            const lineAlpha = (1 - dist / connectDist) * 0.16;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);

            if (p1.isRed || p2.isRed) {
              ctx.strokeStyle = `rgba(245, 11, 0, ${lineAlpha})`;
            } else {
              ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha * 0.7})`;
            }

            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div className="particles-bg">
      {/* 1. Slowly moving ambient red & dark grey background mesh */}
      <div className="absolute inset-0 bg-ambient-mesh opacity-35 pointer-events-none" />

      {/* 2. Soft pulsing red radial orbs */}
      <div className="absolute top-[-10%] left-[15%] w-[550px] h-[550px] rounded-full bg-mani-red/10 blur-[150px] animate-pulse-slow pointer-events-none" />
      <div className="absolute top-[45%] right-[-5%] w-[650px] h-[650px] rounded-full bg-mani-red/8 blur-[160px] animate-pulse-slow pointer-events-none animation-delay-3000" />
      <div className="absolute bottom-[-10%] left-[30%] w-[580px] h-[580px] rounded-full bg-mani-red/10 blur-[150px] animate-pulse-slow pointer-events-none animation-delay-6000" />

      {/* 3. Mouse-following ambient red glow (soft 500px halo) */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 pointer-events-none -translate-x-1/2 -translate-y-1/2 will-change-transform z-0 transition-opacity duration-500 opacity-0"
        style={{ width: "500px", height: "500px" }}
      >
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_center,rgba(245,11,0,0.06)_0%,rgba(245,11,0,0.02)_40%,transparent_70%)] blur-2xl" />
      </div>

      {/* 4. Canvas for Connected Floating Particles with Constellation Network & Cursor Interaction */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
      />
    </div>
  );
}
