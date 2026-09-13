import styles from "./animated-icon.module.css";

/** Animate UI SVG geometry and default motion, adapted to CSS. See animate-ui.LICENSE.txt. */
export function AnimatedIcon({ name, size = 18, className = "" }: { name: "arrow" | "external" | "download" | "chevron" | "close" | "menu"; size?: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" className={[styles.icon, styles[name], className].join(" ")}>
    {name === "download" ? <><g className={styles.moving}><path d="M12 15V3" /><path d="m7 10 5 5 5-5" /></g><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /></> : null}
    {name === "arrow" || name === "external" ? <g transform={name === "external" ? "rotate(-45 12 12)" : undefined}><g className={styles.moving}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></g></g> : null}
    {name === "chevron" ? <path className={styles.moving} d="m6 9 6 6 6-6" /> : null}
    {name === "close" ? <g className={styles.moving}><path d="m6 18 12-12" /><path d="m6 6 12 12" /></g> : null}
    {name === "menu" ? <><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></> : null}
  </svg>;
}
