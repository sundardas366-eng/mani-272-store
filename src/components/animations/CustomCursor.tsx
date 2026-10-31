"use client";

import { useEffect, useRef, useState } from "react";

interface Spark {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [sparks, setSparks] = useState<Spark[]>([]);

  // Refs for high performance 60FPS animation without React re-renders
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const glowPos = useRef({ x: -100, y: -100 });
  const isHoveredRef = useRef(false);
  const isClickingRef = useRef(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Only enable on desktop with fine pointer (not touchscreens)
    const isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;

    if (isTouch) return;

    setEnabled(true);
    document.body.classList.add("has-custom-cursor");

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Mouse movement listener
    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    // Hover detection over interactive elements
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'a, button, [role="button"], input, select, textarea, .glass-card, [data-cursor-hover], .cursor-pointer'
      );

      if (interactive) {
        isHoveredRef.current = true;
        setHovered(true);
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'a, button, [role="button"], input, select, textarea, .glass-card, [data-cursor-hover], .cursor-pointer'
      );

      if (interactive) {
        isHoveredRef.current = false;
        setHovered(false);
      }
    };

    // Click effects
    const onMouseDown = (e: MouseEvent) => {
      isClickingRef.current = true;
      setClicking(true);

      // Create click ripple
      const rippleId = Date.now() + Math.random();
      setRipples((prev) => [
        ...prev.slice(-4), // keep maximum 5 active ripples
        { id: rippleId, x: e.clientX, y: e.clientY },
      ]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== rippleId));
      }, 600);

      // Create glowing particle burst (skip if reduced motion requested)
      if (!prefersReducedMotion) {
        const newSparks: Spark[] = Array.from({ length: 8 }).map((_, i) => ({
          id: Date.now() + i + Math.random(),
          x: e.clientX,
          y: e.clientY,
          angle: (i * 45 + Math.random() * 20) * (Math.PI / 180),
          speed: 25 + Math.random() * 35,
          size: 2 + Math.random() * 3,
        }));

        setSparks((prev) => [...prev.slice(-16), ...newSparks]);

        setTimeout(() => {
          setSparks((prev) =>
            prev.filter((s) => !newSparks.some((ns) => ns.id === s.id))
          );
        }, 500);
      }
    };

    const onMouseUp = () => {
      isClickingRef.current = false;
      setClicking(false);
    };

    // 60FPS animation loop for smooth spring/lerp movement
    const lerpFactor = prefersReducedMotion ? 1 : 0.16;
    const glowLerpFactor = prefersReducedMotion ? 1 : 0.08;

    const animate = () => {
      // Lerp ring position
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerpFactor;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerpFactor;

      // Lerp ambient glow position (slower lag for ethereal feel)
      glowPos.current.x +=
        (mousePos.current.x - glowPos.current.x) * glowLerpFactor;
      glowPos.current.y +=
        (mousePos.current.y - glowPos.current.y) * glowLerpFactor;

      if (ringRef.current) {
        const scale = isHoveredRef.current ? 1.6 : isClickingRef.current ? 0.85 : 1;
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) scale(${scale})`;
      }

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glowPos.current.x}px, ${glowPos.current.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* 1. Mouse-following soft ambient red glow */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 pointer-events-none -translate-x-1/2 -translate-y-1/2 will-change-transform z-0"
        style={{ width: "600px", height: "600px" }}
      >
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_center,rgba(245,11,0,0.06)_0%,rgba(245,11,0,0.02)_40%,transparent_70%)] blur-2xl" />
      </div>

      {/* 2. Custom Outer Cursor Ring (Spring follower) */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 pointer-events-none -translate-x-1/2 -translate-y-1/2 will-change-transform z-[999998] transition-colors duration-200 ${
          hovered ? "cursor-ring-hover" : ""
        } ${clicking ? "cursor-ring-active" : ""}`}
        style={{ width: "36px", height: "36px" }}
      >
        <div
          className={`w-full h-full rounded-full border border-mani-red/60 transition-all duration-200 ${
            hovered
              ? "border-mani-red bg-mani-red/20 shadow-[0_0_20px_rgba(245,11,0,0.7)]"
              : "bg-mani-red/5 shadow-[0_0_12px_rgba(245,11,0,0.35)]"
          }`}
        />
      </div>

      {/* 3. Custom Inner Cursor Dot (Immediate position) */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none -translate-x-1/2 -translate-y-1/2 will-change-transform z-[999999]"
        style={{ width: "8px", height: "8px" }}
      >
        <div
          className={`w-full h-full rounded-full bg-mani-red transition-transform duration-150 shadow-[0_0_8px_#F50B00,0_0_16px_rgba(245,11,0,0.8)] ${
            hovered ? "scale-150" : clicking ? "scale-75" : "scale-100"
          }`}
        />
      </div>

      {/* 4. Click Ripples */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[999997]">
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-mani-red/80 animate-cursor-ripple pointer-events-none"
            style={{
              left: `${ripple.x}px`,
              top: `${ripple.y}px`,
            }}
          />
        ))}
      </div>

      {/* 5. Click Particle Burst (Sparks) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[999997]">
        {sparks.map((spark) => {
          const dx = Math.cos(spark.angle) * spark.speed;
          const dy = Math.sin(spark.angle) * spark.speed;
          return (
            <div
              key={spark.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-mani-red animate-cursor-spark pointer-events-none shadow-[0_0_8px_#F50B00]"
              style={
                {
                  left: `${spark.x}px`,
                  top: `${spark.y}px`,
                  width: `${spark.size}px`,
                  height: `${spark.size}px`,
                  "--dx": `${dx}px`,
                  "--dy": `${dy}px`,
                } as React.CSSProperties
              }
            />
          );
        })}
      </div>
    </>
  );
}
