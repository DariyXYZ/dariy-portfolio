import type { ReactNode } from "react";
import styles from "./browser-frame.module.css";

type BrowserFrameProps = {
  /** Адрес в фейковой строке — для контекста продукта. */
  url?: string;
  children?: ReactNode;
  /** Подпись под макетом, как на референсе. */
  caption?: string;
  tone?: "paper" | "sand";
};

export function BrowserFrame({ url = "dariy.design", children, caption, tone = "sand" }: BrowserFrameProps) {
  return (
    <figure className={styles.wrap}>
      <div className={[styles.frame, styles[tone]].join(" ")}>
        <div className={styles.bar}>
          <span className={styles.dots} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className={styles.url}>{url}</span>
        </div>
        <div className={styles.body}>{children ?? <Placeholder />}</div>
      </div>
      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </figure>
  );
}

function Placeholder() {
  return (
    <div className={styles.placeholder} aria-hidden="true">
      <span className={styles.phLabel}>Макет</span>
    </div>
  );
}
