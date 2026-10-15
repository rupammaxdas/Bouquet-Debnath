/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from "react";

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let particles: Array<{
      x: number;
      y: number;
      r: number;
      v: number;
      a: number;
      phase: number;
    }> = [];
    let animationFrameId: number;

    function resize() {
      if (!canvas || !ctx) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const amount = reduced ? 0 : Math.min(50, Math.floor(w / 25));
      particles = Array.from({ length: amount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.5 + Math.random() * 1.5,
        v: 0.08 + Math.random() * 0.25,
        a: 0.18 + Math.random() * 0.45,
        phase: Math.random() * 6.28,
      }));
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.y -= p.v;
        p.phase += 0.012;
        p.x += Math.sin(p.phase) * 0.13;
        if (p.y < -4) {
          p.y = h + 4;
          p.x = Math.random() * w;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 232, 255, ${p.a * (0.65 + 0.35 * Math.sin(p.phase))})`;
        ctx.fill();
      });

      if (!reduced) {
        animationFrameId = requestAnimationFrame(draw);
      }
    }

    window.addEventListener("resize", resize, { passive: true });
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <>
      {/* Drifting blurred atmospheric glow orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
        <div 
          className="orb-one absolute w-[42vw] aspect-square rounded-full blur-[80px] opacity-20 -top-[18%] -left-[15%]"
          style={{ background: "#745bff" }}
        />
        <div 
          className="orb-two absolute w-[42vw] aspect-square rounded-full blur-[80px] opacity-15 -right-[18%] top-[35%]"
          style={{ background: "#38e8ff" }}
        />
      </div>

      {/* Interactive Starlight/Cyan Particle Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 w-full h-full pointer-events-none -z-10 opacity-60"
      />
    </>
  );
}
