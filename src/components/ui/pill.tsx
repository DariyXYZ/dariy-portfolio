import type { ReactNode } from "react";
import styles from "./pill.module.css";

type PillProps = {
  children: ReactNode;
  tone?: "default" | "live" | "outline";
};

export function Pill({ children, tone = "default" }: PillProps) {
  return <span className={[styles.root, styles[tone]].join(" ")}>{children}</span>;
}
