import styles from "./hero-arc.module.css";

/** Separate geometry keeps the arc visible around the mobile hero. */
function Arc({ mobile = false }: { mobile?: boolean }) {
  const cx = mobile ? 210 : 600;
  const cy = mobile ? 405 : 520;
  const rx = mobile ? 202 : 470;
  const ry = mobile ? 370 : 470;
  const count = mobile ? 38 : 54;
  return (
    <svg className={mobile ? styles.mobile : styles.desktop}
      viewBox={mobile ? "0 0 420 430" : "0 0 1200 540"}
      fill="none" aria-hidden="true" focusable="false">
      {Array.from({ length: count }, (_, i) => {
        const t = i / (count - 1);
        const angle = Math.PI + t * Math.PI;
        const accent = Math.abs(t - 0.5) < 0.07;
        return (
          <g key={i} className={styles.mark} style={{ animationDelay: (100 + t * 650) + "ms" }}>
            <circle cx={cx + Math.cos(angle) * rx} cy={cy + Math.sin(angle) * ry}
              r={accent ? (mobile ? 2.5 : 3.2) : (mobile ? 1.8 : 2)}
              fill={accent ? "var(--ink)" : "var(--ink-4)"} opacity={accent ? 1 : 0.55} />
            {i % (mobile ? 6 : 7) === 0 && t > 0.1 && t < 0.9 ? (
              <line x1={cx + Math.cos(angle) * (rx - 14)} y1={cy + Math.sin(angle) * (ry - 14)}
                x2={cx + Math.cos(angle) * (rx - (mobile ? 25 : 38))}
                y2={cy + Math.sin(angle) * (ry - (mobile ? 25 : 38))}
                stroke="var(--line)" strokeLinecap="round" />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

export function HeroArc() {
  return <><Arc /><Arc mobile /></>;
}
