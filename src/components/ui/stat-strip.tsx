import type { CSSProperties } from "react";
import { Container } from "./container";
import { Reveal } from "./reveal";
import styles from "./stat-strip.module.css";

export type StatStripItem = {
  value: string;
  caption: string;
};

type StatStripProps = {
  items: StatStripItem[];
};

/** Полоса крупных чисел между секциями: факты на главной, метрики в кейсе. */
export function StatStrip({ items }: StatStripProps) {
  const cols = Math.min(items.length, 4);

  return (
    <div className={styles.root}>
      <Container>
        <ul className={styles.grid} style={{ "--cols": cols } as CSSProperties}>
          {items.map((item, i) => (
            <Reveal key={item.value + item.caption} as="li" delay={i * 60} className={styles.item}>
              <span className={styles.value}>{item.value}</span>
              <span className={styles.caption}>{item.caption}</span>
            </Reveal>
          ))}
        </ul>
      </Container>
    </div>
  );
}
