"use client";

import { useEffect, useState } from "react";
import styles from "./case-nav.module.css";

type Item = {
  id: string;
  label: string;
  /** Номер раздела кейса. У вводных блоков его нет. */
  num?: string;
};

type CaseNavProps = {
  items: Item[];
};

/** Липкий рельс слева: где ты сейчас в кейсе и куда можно прыгнуть. */
export function CaseNav({ items }: CaseNavProps) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -62% 0px", threshold: 0 },
    );

    const nodes = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className={styles.root} aria-label="Разделы кейса">
      <ol className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={[styles.link, active === item.id ? styles.active : ""].join(" ")}
            >
              <span className={styles.num}>{item.num ?? "·"}</span>
              <span className={styles.label}>{item.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
