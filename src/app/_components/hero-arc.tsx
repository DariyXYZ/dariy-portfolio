import styles from "./hero-arc.module.css";

const DOT_COUNT = 54;
const RADIUS = 470;
const CENTER_X = 600;
const CENTER_Y = 520;

/**
 * Пунктирная дуга за первым экраном.
 * Несколько точек ближе к вершине подсвечены — взгляд ловит центр.
 */
export function HeroArc() {
  const dots = Array.from({ length: DOT_COUNT }, (_, i) => {
    const t = i / (DOT_COUNT - 1);
    const angle = Math.PI + t * Math.PI;
    const x = CENTER_X + Math.cos(angle) * RADIUS;
    const y = CENTER_Y + Math.sin(angle) * RADIUS;
    const distanceFromTop = Math.abs(t - 0.5);
    const accent = distanceFromTop < 0.07;
    const r = accent ? 3.2 : 2;
    const opacity = accent ? 1 : 0.26 + (0.5 - distanceFromTop) * 0.5;
    return { x, y, r, opacity, accent };
  });

  const ticks = Array.from({ length: 9 }, (_, i) => {
    const t = 0.16 + (i / 8) * 0.68;
    const angle = Math.PI + t * Math.PI;
    const inner = RADIUS - 44;
    const outer = RADIUS - 16;
    return {
      x1: CENTER_X + Math.cos(angle) * inner,
      y1: CENTER_Y + Math.sin(angle) * inner,
      x2: CENTER_X + Math.cos(angle) * outer,
      y2: CENTER_Y + Math.sin(angle) * outer,
    };
  });

  return (
    <svg
      className={styles.arc}
      viewBox="0 0 1200 540"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {ticks.map((tick, i) => (
        <line
          key={"t" + i}
          x1={tick.x1}
          y1={tick.y1}
          x2={tick.x2}
          y2={tick.y2}
          stroke="var(--line)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      ))}
      {dots.map((dot, i) => (
        <circle
          key={"d" + i}
          cx={dot.x}
          cy={dot.y}
          r={dot.r}
          fill={dot.accent ? "var(--ink)" : "var(--ink-4)"}
          opacity={dot.opacity}
        />
      ))}
    </svg>
  );
}
