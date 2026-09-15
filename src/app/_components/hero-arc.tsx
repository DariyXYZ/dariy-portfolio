"use client";

import { useEffect, useRef } from "react";
import styles from "./hero-arc.module.css";

const COUNT = 54;
const DOTS = Array.from({ length: COUNT }, (_, i) => {
  const angle = Math.PI + (i / (COUNT - 1)) * Math.PI;
  return { x: 600 + Math.cos(angle) * 470, y: 600 + Math.sin(angle) * 470 };
});

export function HeroArc() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const hero = svg?.closest("section");
    if (!svg || !hero) return;
    const accents = Array.from(svg.querySelectorAll<SVGCircleElement>("[data-accent]"));
    let frame = 0;
    let cursor: { x: number; y: number } | null = null;
    const paint = () => {
      frame = 0;
      const matrix = svg.getScreenCTM();
      if (!matrix) return;
      accents.forEach((dot, i) => {
        const point = new DOMPoint(DOTS[i].x, DOTS[i].y).matrixTransform(matrix);
        const distance = cursor ? Math.hypot(point.x - cursor.x, point.y - cursor.y) : Infinity;
        dot.style.opacity = String(Math.max(0, 1 - distance / 220));
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      cursor = { x: event.clientX, y: event.clientY };
      schedule();
    };
    const clear = () => { cursor = null; schedule(); };
    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", clear);
    window.addEventListener("scroll", clear, { passive: true });
    window.addEventListener("blur", clear);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", clear);
      window.removeEventListener("scroll", clear);
      window.removeEventListener("blur", clear);
    };
  }, []);

  return (
    <svg ref={svgRef} className={styles.ring} viewBox="0 0 1200 1200"
      fill="none" aria-hidden="true" focusable="false">
      {DOTS.map((dot, i) => (
        <g key={i} className={styles.mark} style={{ animationDelay: (150 + i * 48) + "ms" }}>
          <circle cx={dot.x} cy={dot.y} r="2.2" fill="var(--ink-4)" opacity="0.65" />
          <circle cx={dot.x} cy={dot.y} r="3.2" fill="var(--accent)" className={styles.lead} style={{ animationDelay: (150 + i * 48) + "ms" }} />
          <circle data-accent cx={dot.x} cy={dot.y} r="3.4" fill="var(--accent)" className={styles.accent} />
        </g>
      ))}
    </svg>
  );
}
