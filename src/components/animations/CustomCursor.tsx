"use client";

import { useEffect, useRef, useState } from "react";

interface TrailNode {
  x: number;
  y: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
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

  // DOM Refs
  const plusRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animation & Physics Refs
  const mousePos = useRef({ x: -200, y: -200 });
  const lastMousePos = useRef({ x: -200, y: -200 });
  const isHoveredRef = useRef(false);
  const isClickingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const rafId = useRef<number | null>(null);

  // Trail physics nodes (16 connected segments for elastic drag)
  const TRAIL_LENGTH = 16;
  const trailNodes = useRef<TrailNode[]>(
    Array.from({ length: TRAIL_LENGTH }, () => ({ x: -200, y: -200 }))
  );

  // Speed-reactive trailing particles / embers
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    // Always enable on client mount (never block on touchpoints)
    setEnabled(true);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI displays for crisp rendering
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Mouse movement listener
    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        for (let i = 0; i < TRAIL_LENGTH; i++) {
          trailNodes.current[i].x = e.clientX;
          trailNodes.current[i].y = e.clientY;
        }
        lastMousePos.current.x = e.clientX;
        lastMousePos.current.y = e.clientY;
      }

      // Immediately translate the head Plus (+) icon to match the mouse cursor
      if (plusRef.current) {
        plusRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        plusRef.current.style.opacity = "1";
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

    // Mousedown (active drag mode)
    const onMouseDown = (e: MouseEvent) => {
      isClickingRef.current = true;
      setClicking(true);

      // Trigger ripple
      const rippleId = Date.now() + Math.random();
      setRipples((prev) => [
        ...prev.slice(-3),
        { id: rippleId, x: e.clientX, y: e.clientY },
      ]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== rippleId));
      }, 550);

      // Spawn click spark burst
      if (!prefersReducedMotion) {
        for (let i = 0; i < 12; i++) {
          const angle = (i * 30 + Math.random() * 20) * (Math.PI / 180);
          const speed = 2.5 + Math.random() * 4.5;
          particles.current.push({
            x: e.clientX,
            y: e.clientY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 2 + Math.random() * 2.5,
            alpha: 1,
            life: 1,
          });
        }
      }
    };

    // Mouseup (release drag mode)
    const onMouseUp = () => {
      isClickingRef.current = false;
      setClicking(false);
    };

    // Main 60 FPS animation loop with spring physics & fluid rendering
    const render = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);

      // If mouse hasn't entered viewport yet, wait
      if (!hasMovedRef.current) {
        rafId.current = requestAnimationFrame(render);
        return;
      }

      // 1. Calculate instant mouse velocity & speed
      const mouseDx = mousePos.current.x - lastMousePos.current.x;
      const mouseDy = mousePos.current.y - lastMousePos.current.y;
      const mouseSpeed = Math.hypot(mouseDx, mouseDy);

      lastMousePos.current.x = mousePos.current.x;
      lastMousePos.current.y = mousePos.current.y;

      // 2. Physics update for trail nodes
      const nodes = trailNodes.current;
      nodes[0].x = mousePos.current.x;
      nodes[0].y = mousePos.current.y;

      // Elastic spring factor: tighter tension when dragging/holding click
      const isHolding = isClickingRef.current;
      const baseSpring = prefersReducedMotion ? 0.95 : isHolding ? 0.44 : 0.32;

      for (let i = 1; i < TRAIL_LENGTH; i++) {
        const factor = baseSpring * Math.pow(0.93, i);
        nodes[i].x += (nodes[i - 1].x - nodes[i].x) * factor;
        nodes[i].y += (nodes[i - 1].y - nodes[i].y) * factor;
      }

      // Stretch distance of the trail
      const headTailDist = Math.hypot(
        nodes[0].x - nodes[TRAIL_LENGTH - 1].x,
        nodes[0].y - nodes[TRAIL_LENGTH - 1].y
      );

      // 3. Spawn speed embers when moving fast
      if (!prefersReducedMotion && mouseSpeed > 5 && particles.current.length < 35) {
        particles.current.push({
          x: nodes[1].x + (Math.random() - 0.5) * 6,
          y: nodes[1].y + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 1.5 - mouseDx * 0.08,
          vy: (Math.random() - 0.5) * 1.5 - mouseDy * 0.08,
          size: 1.5 + Math.random() * 2.5,
          alpha: 0.85,
          life: 0.85,
        });
      }

      // 4. Draw fluid drag trail ribbon (when moving or dragging)
      if (headTailDist > 2 && !prefersReducedMotion) {
        ctx.save();

        // High glow pass
        ctx.shadowColor = "#F50B00";
        ctx.shadowBlur = isHolding ? 24 : isHoveredRef.current ? 18 : 12;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Draw segmented tapering spline
        for (let i = 0; i < TRAIL_LENGTH - 1; i++) {
          const p1 = nodes[i];
          const p2 = nodes[i + 1];

          // Progress along trail (0 = head, 1 = tail)
          const t = i / (TRAIL_LENGTH - 1);
          const alpha = (1 - t) * (isHolding ? 0.95 : 0.8);

          // Width tapers smoothly from head to tail
          const speedBoost = Math.min(mouseSpeed * 0.15, 3.5);
          const baseWidth = isHolding ? 6 : 4;
          const lineWidth = Math.max(0.8, (baseWidth + speedBoost) * (1 - t * 0.82));

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);

          ctx.strokeStyle = `rgba(245, 11, 0, ${alpha})`;
          ctx.lineWidth = lineWidth;
          ctx.stroke();
        }

        // Draw ghost plus crosshairs along trail when moving fast
        if (mouseSpeed > 7) {
          const ghostIndices = [3, 7, 12];
          ghostIndices.forEach((idx, gIdx) => {
            if (idx < TRAIL_LENGTH) {
              const gn = nodes[idx];
              const gAlpha = (1 - idx / TRAIL_LENGTH) * 0.5;
              const gSize = (isHolding ? 7 : 5) * (1 - gIdx * 0.2);

              ctx.beginPath();
              ctx.moveTo(gn.x - gSize, gn.y);
              ctx.lineTo(gn.x + gSize, gn.y);
              ctx.moveTo(gn.x, gn.y - gSize);
              ctx.lineTo(gn.x, gn.y + gSize);
              ctx.strokeStyle = `rgba(245, 11, 0, ${gAlpha})`;
              ctx.lineWidth = 1.8;
              ctx.stroke();
            }
          });
        }

        ctx.restore();
      }

      // 5. Update & draw trailing speed embers
      if (particles.current.length > 0) {
        ctx.save();
        for (let i = particles.current.length - 1; i >= 0; i--) {
          const p = particles.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.035;
          p.alpha = Math.max(0, p.life);

          if (p.life <= 0) {
            particles.current.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(245, 11, 0, ${p.alpha})`;
          ctx.shadowColor = "#F50B00";
          ctx.shadowBlur = 8;
          ctx.fill();
        }
        ctx.restore();
      }

      rafId.current = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    rafId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
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
      {/* 1. Fluid speed-reactive drag trail canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[999998]"
      />

      {/* 2. Sharp MANI Red Plus (+) Icon (follows mouse cursor) */}
      <div
        ref={plusRef}
        className="fixed top-0 left-0 pointer-events-none -translate-x-1/2 -translate-y-1/2 will-change-transform z-[999999] opacity-0 transition-opacity duration-300"
        style={{ width: "26px", height: "26px" }}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          className={`w-full h-full transition-transform duration-200 ${
            hovered ? "scale-130 rotate-45" : clicking ? "scale-85" : "scale-100"
          }`}
          style={{
            filter: hovered
              ? "drop-shadow(0 0 8px #F50B00) drop-shadow(0 0 16px rgba(245,11,0,0.9))"
              : clicking
              ? "drop-shadow(0 0 12px #F50B00) drop-shadow(0 0 24px #F50B00)"
              : "drop-shadow(0 0 5px #F50B00) drop-shadow(0 0 12px rgba(245,11,0,0.7))",
          }}
        >
          {/* Outer rotating tactical brackets on hover */}
          {hovered && (
            <circle
              cx="13"
              cy="13"
              r="10.5"
              stroke="rgba(245, 11, 0, 0.6)"
              strokeWidth="1.2"
              strokeDasharray="4 4"
              className="animate-spin"
              style={{ animationDuration: "5s" }}
            />
          )}

          {/* Plus Horizontal Bar */}
          <line
            x1="5"
            y1="13"
            x2="21"
            y2="13"
            stroke="#F50B00"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Plus Vertical Bar */}
          <line
            x1="13"
            y1="5"
            x2="13"
            y2="21"
            stroke="#F50B00"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Precision Center Point */}
          <circle cx="13" cy="13" r="1.5" fill="#FFFFFF" />
        </svg>
      </div>

      {/* 3. Click Ripples */}
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
    </>
  );
}
