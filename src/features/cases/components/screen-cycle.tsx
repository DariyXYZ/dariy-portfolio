"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { asset } from "@/config/site";
import styles from "./screen-cycle.module.css";

type Variant = { src: string; alt: string; label: string };
export function ScreenCycle({ variants, frameClass, imageClass }: { variants: Variant[]; frameClass: string; imageClass: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPaused(query.matches);
    const initial = setTimeout(update, 0);
    query.addEventListener("change", update);
    return () => { clearTimeout(initial); query.removeEventListener("change", update); };
  }, []);
  useEffect(() => {
    if (paused || !visible) return;
    const timer = setInterval(() => { if (!document.hidden) setIndex(i => (i + 1) % variants.length); }, 2000);
    return () => clearInterval(timer);
  }, [paused, visible, variants.length]);
  return <div ref={root}>
    <div className={frameClass}>
      {variants.map((item, i) => <Image key={item.src} src={asset(item.src)} alt={item.alt} width={900} height={1968} sizes="(max-width: 640px) 45vw, 300px" className={imageClass} style={{ display: index === i ? "block" : "none" }} />)}
    </div>
    <div className={styles.controls}>
      <button type="button" aria-label="Показать другое состояние ошибки" onClick={() => { setPaused(true); setIndex(i => (i + 1) % variants.length); }}>{variants[index].label} ↔</button>
      <button type="button" aria-label={paused ? "Запустить смену экранов" : "Остановить смену экранов"} onClick={() => setPaused(v => !v)}>{paused ? "Старт" : "Пауза"}</button>
    </div>
  </div>;
}
