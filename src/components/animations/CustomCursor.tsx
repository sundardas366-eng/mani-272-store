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
  const mousePos = useRef({ x: -100, y: -100 });
  const lastMousePos = useRef({ x: -100, y: -100 });
  const isHoveredRef = useRef(false);
  const isClickingRef = useRef(false);
  const rafId = useRef<number | null>(null);

  // Trail physics nodes (16 connected segments for elastic drag)
  const TRAIL_LENGTH = 16;
  const trailNodes = useRef<TrailNode[]>(
    Array.from({ length: TRAIL_LENGTH }, () => ({ x: -100, y: -100 }))
  );

  // Speed-reactive trailing particles / embers
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    // Check for mobile or touchscreen devices
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

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI displays for ultra-sharp canvas rendering
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

      // Initialize trail positions on first mouse move so it doesn't shoot across screen
      if (trailNodes.current[0].x < 0) {
        for (let i = 0; i < TRAIL_LENGTH; i++) {
          trailNodes.current[i].x = e.clientX;
          trailNodes.current[i].y = e.clientY;
        }
      }

      // Immediately translate the head Plus (+) icon
      if (plusRef.current) {
        plusRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
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

    // Mousedown (active drag start)
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
        for (let i = 0; i < 10; i++) {
          const angle = (i * 36 + Math.random() * 20) * (Math.PI / 180);
          const speed = 2 + Math.random() * 4.5;
          particles.current.push({
            x: e.clientX,
            y: e.clientY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 1.5 + Math.random() * 2.5,
            alpha: 1,
            life: 1,
          });
        }
      }
    };

    // Mouseup (release drag)
    const onMouseUp = () => {
      isClickingRef.current = false;
      setClicking(false);
    };

    // Main 60 FPS animation loop with spring physics & fluid rendering
    const render = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);

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

      // Spring stiffness: stronger and tighter when holding click
      const isHolding = isClickingRef.current;
      const baseSpring = prefersReducedMotion ? 0.9 : isHolding ? 0.42 : 0.32;

      for (let i = 1; i < TRAIL_LENGTH; i++) {
        // Progressive elasticity: further nodes lag more to create stretching
        const factor = baseSpring * Math.pow(0.93, i);
        nodes[i].x += (nodes[i - 1].x - nodes[i].x) * factor;
        nodes[i].y += (nodes[i - 1].y - nodes[i].y) * factor;
      }

      // Calculate total stretch distance of the trail
      const headTailDist = Math.hypot(
        nodes[0].x - nodes[TRAIL_LENGTH - 1].x,
        nodes[0].y - nodes[TRAIL_LENGTH - 1].y
      );

      // 3. Spawn speed embers when moving fast
      if (!prefersReducedMotion && mouseSpeed > 6 && particles.current.length < 40) {
        particles.current.push({
          x: nodes[1].x + (Math.random() - 0.5) * 4,
          y: nodes[1].y + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 1.5 - mouseDx * 0.1,
          vy: (Math.random() - 0.5) * 1.5 - mouseDy * 0.1,
          size: 1 + Math.random() * 2,
          alpha: 0.8,
          life: 0.8,
        });
      }

      // 4. Draw fluid drag trail ribbon (only when moving or holding)
      if (headTailDist > 1.5 && !prefersReducedMotion) {
        ctx.save();

        // Outer glow pass
        ctx.shadowColor = "#F50B00";
        ctx.shadowBlur = isHolding ? 24 : isHoveredRef.current ? 18 : 10;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Draw segmented tapering spline
        for (let i = 0; i < TRAIL_LENGTH - 1; i++) {
          const p1 = nodes[i];
          const p2 = nodes[i + 1];

          // Normalized progress along the trail (0 at head, 1 at tail)
          const t = i / (TRAIL_LENGTH - 1);

          // Alpha fades to 0 at the tail
          const alpha = (1 - t) * (isHolding ? 0.95 : 0.75);

          // Width tapers smoothly from head to tail
          // Width also increases dynamically with speed & holding
          const speedBoost = Math.min(mouseSpeed * 0.12, 3);
          const baseWidth = isHolding ? 5.5 : 3.5;
          const lineWidth = Math.max(0.6, (baseWidth + speedBoost) * (1 - t * 0.85));

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);

          ctx.strokeStyle = `rgba(245, 11, 0, ${alpha})`;
          ctx.lineWidth = lineWidth;
          ctx.stroke();
        }

        // Draw ghost plus crosshairs along the trail when moving fast
        if (mouseSpeed > 8) {
          const ghostIndices = [3, 7, 12];
          ghostIndices.forEach((idx, gIdx) => {
            if (idx < TRAIL_LENGTH) {
              const gn = nodes[idx];
              const gAlpha = (1 - idx / TRAIL_LENGTH) * 0.45;
              const gSize = (isHolding ? 7 : 5) * (1 - gIdx * 0.2);

              ctx.beginPath();
              ctx.moveTo(gn.x - gSize, gn.y);
              ctx.lineTo(gn.x + gSize, gn.y);
              ctx.moveTo(gn.x, gn.y - gSize);
              ctx.lineTo(gn.x, gn.y + gSize);
              ctx.strokeStyle = `rgba(245, 11, 0, ${gAlpha})`;
              ctx.lineWidth = 1.5;
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
          ctx.shadowBlur = 6;
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
      document.body.classList.remove("has-custom-cursor");
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
      {/* 1. Fluid speed-reactive drag canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[999998]"
      />

      {/* 2. Sharp MANI Red Plus (+) Icon Cursor */}
      <div
        ref={plusRef}
        className="fixed top-0 left-0 pointer-events-none -translate-x-1/2 -translate-y-1/2 will-change-transform z-[999999]"
        style={{ width: "24px", height: "24px" }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className={`w-full h-full transition-transform duration-200 ${
            hovered ? "scale-125 rotate-45" : clicking ? "scale-85" : "scale-100"
          }`}
          style={{
            filter: hovered
              ? "drop-shadow(0 0 8px #F50B00) drop-shadow(0 0 16px rgba(245,11,0,0.85))"
              : clicking
              ? "drop-shadow(0 0 10px #F50B00) drop-shadow(0 0 20px #F50B00)"
              : "drop-shadow(0 0 5px #F50B00) drop-shadow(0 0 10px rgba(245,11,0,0.65))",
          }}
        >
          {/* Outer target micro-corner brackets on hover for tactical gaming feel */}
          {hovered && (
            <circle
              cx="12"
              cy="12"
              r="9.5"
              stroke="rgba(245, 11, 0, 0.45)"
              strokeWidth="1"
              strokeDasharray="4 4"
              className="animate-spin"
              style={{ animationDuration: "6s" }}
            />
          )}

          {/* Plus Horizontal Bar */}
          <line
            x1="4.5"
            y1="12"
            x2="19.5"
            y2="12"
            stroke="#F50B00"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Plus Vertical Bar */}
          <line
            x1="12"
            y1="4.5"
            x2="12"
            y2="19.5"
            stroke="#F50B00"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Ultra-sharp Center White Precision Point */}
          <circle cx="12" cy="12" r="1.3" fill="#FFFFFF" />
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
