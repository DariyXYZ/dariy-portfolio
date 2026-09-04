"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./reveal.module.css";

type RevealProps = {
  children: ReactNode;
  /** Задержка внутри группы, чтобы элементы появлялись каскадом. */
  delay?: number;
  as?: "div" | "li" | "section";
  className?: string;
  id?: string;
};

/**
 * Появление при попадании в область просмотра.
 * Режим «меньше движения» обрабатывается в CSS, поэтому здесь его нет.
 */
export function Reveal({ children, delay = 0, as = "div", className, id }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Старые браузеры без наблюдателя: показываем сразу, но не в теле эффекта.
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Tag = as;

  return (
    <Tag
      // Полиморфный тег: тип ссылки различается для div, li и section.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      id={id}
      className={[styles.root, shown ? styles.shown : "", className]
        .filter(Boolean)
        .join(" ")}
      style={{ transitionDelay: delay + "ms" }}
    >
      {children}
    </Tag>
  );
}
