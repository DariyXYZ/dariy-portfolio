import type { ReactNode } from "react";
import styles from "./container.module.css";

type ContainerProps = {
  children: ReactNode;
  /** narrow — для длинного текста, wide — для сеток во всю ширину. */
  size?: "narrow" | "default" | "wide";
  className?: string;
};

export function Container({ children, size = "default", className }: ContainerProps) {
  return (
    <div className={[styles.root, styles[size], className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
