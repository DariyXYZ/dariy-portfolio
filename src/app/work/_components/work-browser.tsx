"use client";

import { useMemo, useState } from "react";
import { CaseCard, industries, type CaseStudy } from "@/features/cases";
import styles from "./work-browser.module.css";

type WorkBrowserProps = {
  items: CaseStudy[];
};

export function WorkBrowser({ items }: WorkBrowserProps) {
  const [filter, setFilter] = useState<string>("all");

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    map.set("all", items.length);
    items.forEach((item) => {
      map.set(item.industry, (map.get(item.industry) ?? 0) + 1);
    });
    return map;
  }, [items]);

  const visible = useMemo(
    () => (filter === "all" ? items : items.filter((item) => item.industry === filter)),
    [items, filter],
  );

  return (
    <>
      <div className={styles.filters} role="group" aria-label="Фильтр кейсов по отрасли">
        {industries.map((industry) => {
          const count = counts.get(industry.id) ?? 0;
          if (count === 0) return null;
          const active = filter === industry.id;
          return (
            <button
              key={industry.id}
              type="button"
              className={[styles.chip, active ? styles.chipActive : ""].join(" ")}
              aria-pressed={active}
              onClick={() => setFilter(industry.id)}
            >
              {industry.label}
              <span className={styles.count}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.grid}>
        {visible.map((item, i) => (
          <CaseCard key={item.slug} item={item} index={i} />
        ))}
      </div>

      {visible.length === 0 ? (
        <p className={styles.empty}>В этой отрасли кейсов пока нет.</p>
      ) : null}
    </>
  );
}
