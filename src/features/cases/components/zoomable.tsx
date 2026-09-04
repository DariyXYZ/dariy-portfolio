"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./zoomable.module.css";

type ZoomableProps = {
  src: string;
  alt: string;
  /** Подпись в углу превью, подсказывает, что можно открыть. */
  hint?: string;
};

/** Артефакт целиком и мелко. Детали читаются по клику, в полном размере. */
export function Zoomable({ src, alt, hint = "Открыть целиком" }: ZoomableProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button type="button" className={styles.trigger} onClick={() => setOpen(true)}>
        <Image
          src={src}
          alt={alt}
          width={2400}
          height={1400}
          sizes="(max-width: 900px) 100vw, 900px"
          className={styles.preview}
        />
        <span className={styles.hint}>{hint}</span>
      </button>

      {open ? (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
        >
          <span className={styles.close}>Esc или клик — закрыть</span>
          <div className={styles.scroll}>
            {/* Полный размер отдаём обычным img: оригинал без пересжатия */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} className={styles.full} />
          </div>
        </div>
      ) : null}
    </>
  );
}
