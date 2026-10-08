"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ProcessTrackProps = {
  children: ReactNode;
  className?: string;
};

/** Линия шага заполняется от этой доли высоты окна… */
const START = 0.85;
/** …и заканчивает заполняться здесь. */
const END = 0.35;

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Линии над шагами процесса заполняются при прокрутке, как полоса загрузки.
 * Шаги в одной строке делят общий ход поровну и заполняются по очереди;
 * в одну колонку каждая линия идёт по своему положению на экране.
 * Пишет только `--fill` в стиль шага, без перерисовки React.
 */
export function ProcessTrack({ children, className }: ProcessTrackProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-step]"));
    if (!steps.length) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const tops = steps.map((step) => step.getBoundingClientRect().top);
      const oneRow = tops.every((top) => Math.abs(top - tops[0]) < 40);
      const progress = (top: number) => clamp((START * vh - top) / ((START - END) * vh));

      steps.forEach((step, i) => {
        const fill = oneRow ? clamp(progress(tops[0]) * steps.length - i) : progress(tops[i]);
        step.style.setProperty("--fill", fill.toFixed(4));
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
