import type { ReactNode } from "react";
import styles from "./section.module.css";

type SectionProps = {
  children: ReactNode;
  /** sand — тонированная полоса, чтобы задать ритм страницы. */
  tone?: "paper" | "sand";
  id?: string;
  className?: string;
};

export function Section({ children, tone = "paper", id, className }: SectionProps) {
  return (
    <section
      id={id}
      className={[styles.section, styles[tone], className].filter(Boolean).join(" ")}
    >
      {children}
    </section>
  );
}

type SectionHeadProps = {
  kicker?: string;
  title: ReactNode;
  /** Вторая строка заголовка, приглушённая — приём с референса. */
  lead?: ReactNode;
  action?: ReactNode;
};

export function SectionHead({ kicker, title, lead, action }: SectionHeadProps) {
  return (
    <header className={styles.head}>
      <div className={styles.headMain}>
        {kicker ? <p className={`label ${styles.kicker}`}>{kicker}</p> : null}
        <h2 className="h2">{title}</h2>
        {lead ? <p className={`lead ${styles.lead}`}>{lead}</p> : null}
      </div>
      {action ? <div className={styles.headAction}>{action}</div> : null}
    </header>
  );
}
