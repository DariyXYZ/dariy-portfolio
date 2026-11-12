"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./preview-player.module.css";

type Props = { src: string; poster: string; label: string };

export function PreviewPlayer({ src, poster, label }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    let raf = 0;
    const tick = () => {
      if (bar.current && v.duration) bar.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };

  const seek = (e: React.PointerEvent<HTMLDivElement>) => {
    const v = video.current;
    if (!v || !v.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    v.currentTime = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * v.duration;
  };

  const full = () => {
    const el = wrap.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.();
  };

  return (
    <div ref={wrap} className={styles.wrap} data-paused={paused || undefined}>
      <video
        ref={video}
        className={styles.video}
        poster={poster}
        aria-label={label}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onClick={toggle}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
      >
        <source src={src} type="video/mp4" />
      </video>

      <div className={styles.ui}>
        <button type="button" className={styles.btn} onClick={toggle} aria-label={paused ? "Воспроизвести" : "Пауза"}>
          {paused ? (
            <svg viewBox="0 0 12 12" aria-hidden><path d="M3.5 2.2v7.6L9.6 6z" fill="currentColor" /></svg>
          ) : (
            <svg viewBox="0 0 12 12" aria-hidden><path d="M3.6 2.4v7.2M8.4 2.4v7.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          )}
        </button>
        <button type="button" className={styles.btn} onClick={full} aria-label="На весь экран">
          <svg viewBox="0 0 12 12" aria-hidden><path d="M2 4.5V2h2.5M7.5 2H10v2.5M10 7.5V10H7.5M4.5 10H2V7.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      <div className={styles.track} onPointerDown={seek} role="presentation">
        <span ref={bar} className={styles.fill} />
      </div>
    </div>
  );
}
