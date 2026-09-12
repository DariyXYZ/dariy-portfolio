import type { DiagramEdge, DiagramNode, DiagramTone } from "../types";
import styles from "./diagram.module.css";

type DiagramProps = {
  id: string;
  width: number;
  height: number;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  legend?: { tone: DiagramTone; label: string }[];
};

type Point = { x: number; y: number };
type Side = "right" | "bottom" | "left" | "top";

const CORNER = 18;
/** Стрелка в пользовательских единицах: не растёт и не тает при масштабе. */
const ARROW = 11;
/** Воздух между наконечником и блоком: стрелка не прилипает к рамке. */
const TOUCH = 9;
/** Запас вокруг холста, иначе рамки и стрелки срезает краем. */
const PAD = 18;
/** Разбег параллельных ветвей, выходящих из одного блока. */
const FAN_STEP = 18;

function anchor(node: DiagramNode, side: Side): Point {
  switch (side) {
    case "right":
      return { x: node.x + node.w, y: node.y + node.h / 2 };
    case "left":
      return { x: node.x, y: node.y + node.h / 2 };
    case "bottom":
      return { x: node.x + node.w / 2, y: node.y + node.h };
    case "top":
      return { x: node.x + node.w / 2, y: node.y };
  }
}

/** Точка входа: отодвинута от границы, чтобы перед блоком оставался зазор. */
function landing(p: Point, side: Side): Point {
  switch (side) {
    case "left":
      return { x: p.x - TOUCH, y: p.y };
    case "right":
      return { x: p.x + TOUCH, y: p.y };
    case "top":
      return { x: p.x, y: p.y - TOUCH };
    case "bottom":
      return { x: p.x, y: p.y + TOUCH };
  }
}

type Route = {
  d: string;
  badge?: Point;
  /** Середина последнего отрезка: там ярлык и значок не пересекают другие линии. */
  mark: Point;
  /** Начало последнего отрезка, чтобы понять, сколько места под ярлык. */
  tail: Point;
};

/**
 * Ортогональный маршрут с двумя мягкими поворотами и общим стволом.
 * `trunk` задаёт положение поворота, чтобы ветви одного блока шли параллельно,
 * а не ложились одна на другую.
 */
function route(rawA: Point, b: Point, fromSide: Side, toSide: Side, trunk: number): Route {
  // Зазор с обеих сторон: линия не касается ни блока-источника, ни блока-цели.
  const a = landing(rawA, fromSide);
  const end = landing(b, toSide);
  const horizontal = fromSide === "right" || fromSide === "left";
  const endHorizontal = toSide === "right" || toSide === "left";

  // При входе в перпендикулярную грань последний отрезок идёт по её нормали.
  if (horizontal !== endHorizontal) {
    const corner = horizontal ? { x: end.x, y: a.y } : { x: a.x, y: end.y };
    const first = Math.hypot(corner.x - a.x, corner.y - a.y);
    const last = Math.hypot(end.x - corner.x, end.y - corner.y);
    const r = Math.min(CORNER, first / 2, last / 2);
    const before = { x: corner.x + (a.x - corner.x) * r / (first || 1), y: corner.y + (a.y - corner.y) * r / (first || 1) };
    const after = { x: corner.x + (end.x - corner.x) * r / (last || 1), y: corner.y + (end.y - corner.y) * r / (last || 1) };
    return {
      d: `M ${a.x} ${a.y} L ${before.x} ${before.y} Q ${corner.x} ${corner.y} ${after.x} ${after.y} L ${end.x} ${end.y}`,
      mark: { x: (after.x + end.x) / 2, y: (after.y + end.y) / 2 },
      tail: after,
    };
  }

  if (horizontal) {
    if (Math.abs(a.y - end.y) < 0.5) {
      return {
        d: `M ${a.x} ${a.y} L ${end.x} ${end.y}`,
        mark: { x: a.x + (end.x - a.x) * 0.62, y: a.y },
        tail: { x: a.x, y: a.y },
      };
    }
    const t = trunk;
    const stepX = t > a.x ? 1 : -1;
    const stepY = end.y > a.y ? 1 : -1;
    const r = Math.min(
      CORNER,
      Math.abs(end.y - a.y) / 2,
      Math.abs(t - a.x),
      Math.abs(end.x - t) || CORNER,
    );
    return {
      d: [
        `M ${a.x} ${a.y}`,
        `L ${t - r * stepX} ${a.y}`,
        `Q ${t} ${a.y} ${t} ${a.y + r * stepY}`,
        `L ${t} ${end.y - r * stepY}`,
        `Q ${t} ${end.y} ${t + r * stepX} ${end.y}`,
        `L ${end.x} ${end.y}`,
      ].join(" "),
      mark: { x: t + (end.x - t) * 0.55, y: end.y },
      tail: { x: t, y: end.y },
      badge: Math.abs(end.x - t) < 56 ? { x: t, y: (a.y + end.y) / 2 } : undefined,
    };
  }

  if (Math.abs(a.x - end.x) < 0.5) {
    return {
      d: `M ${a.x} ${a.y} L ${end.x} ${end.y}`,
      mark: { x: a.x, y: a.y + (end.y - a.y) * 0.62 },
      tail: { x: a.x, y: a.y },
    };
  }
  const t = trunk;
  const stepY = t > a.y ? 1 : -1;
  const stepX = end.x > a.x ? 1 : -1;
  const r = Math.min(
    CORNER,
    Math.abs(end.x - a.x) / 2,
    Math.abs(t - a.y),
    Math.abs(end.y - t) || CORNER,
  );
  return {
    d: [
      `M ${a.x} ${a.y}`,
      `L ${a.x} ${t - r * stepY}`,
      `Q ${a.x} ${t} ${a.x + r * stepX} ${t}`,
      `L ${end.x - r * stepX} ${t}`,
      `Q ${end.x} ${t} ${end.x} ${t + r * stepY}`,
      `L ${end.x} ${end.y}`,
    ].join(" "),
    mark: { x: end.x, y: t + (end.y - t) * 0.55 },
    tail: { x: end.x, y: t },
    badge: Math.abs(end.y - t) < 56 ? { x: (a.x + end.x) / 2, y: t } : undefined,
  };
}

/**
 * Считаем положение ствола для каждой связи. Ветви, выходящие из одной стороны
 * одного блока, получают разные стволы: линии идут рядом, а не сливаются в одну.
 */
function trunks(nodes: Map<string, DiagramNode>, edges: DiagramEdge[]): number[] {
  const groups = new Map<string, number[]>();
  edges.forEach((edge, i) => {
    const key = `${edge.from}|${edge.fromSide ?? "right"}`;
    const list = groups.get(key);
    if (list) list.push(i);
    else groups.set(key, [i]);
  });

  const result = new Array<number>(edges.length).fill(0);

  groups.forEach((indices) => {
    const bent = indices.filter((i) => {
      const edge = edges[i];
      const from = nodes.get(edge.from);
      const to = nodes.get(edge.to);
      if (!from || !to) return false;
      const a = anchor(from, edge.fromSide ?? "right");
      const b = anchor(to, edge.toSide ?? "left");
      const horizontal = (edge.fromSide ?? "right") === "right" || edge.fromSide === "left";
      return horizontal ? Math.abs(a.y - b.y) >= 0.5 : Math.abs(a.x - b.x) >= 0.5;
    });

    bent.forEach((i, order) => {
      const edge = edges[i];
      const from = nodes.get(edge.from);
      const to = nodes.get(edge.to);
      if (!from || !to) return;
      const side = edge.fromSide ?? "right";
      const a = anchor(from, side);
      const b = anchor(to, edge.toSide ?? "left");
      const horizontal = side === "right" || side === "left";
      const span = horizontal ? Math.abs(b.x - a.x) : Math.abs(b.y - a.y);
      const dir = side === "right" || side === "bottom" ? 1 : -1;
      // База берётся от заданного bend, разбег — от порядка ветви в группе.
      const base = span * (edge.bend ?? 0.42);
      const margin = Math.min(28, span / 2);
      const off = Math.max(margin, Math.min(span - margin, base + order * FAN_STEP));
      result[i] = (horizontal ? a.x : a.y) + dir * off;
    });
  });

  return result;
}

export function Diagram({ id, width, height, nodes, edges, legend }: DiagramProps) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const trunkAt = trunks(byId, edges);

  return (
    <div className={styles.scroll}>
      <svg
        className={styles.svg}
        viewBox={`${-PAD} ${-PAD} ${width + PAD * 2} ${height + PAD * 2}`}
        style={{ minWidth: Math.min(width, 900) }}
        role="img"
      >
        <defs>
          {(["default", "muted"] as const).map((tone) => (
            <marker
              key={tone}
              id={`${id}-${tone}`}
              viewBox="0 0 10 10"
              refX="8.6"
              refY="5"
              markerWidth={ARROW}
              markerHeight={ARROW}
              markerUnits="userSpaceOnUse"
              orient="auto-start-reverse"
            >
              {/* Шеврон со скруглёнными концами читается мягче залитого шипа. */}
              <path
                d="M 3.6 2 L 8.4 5 L 3.6 8"
                fill="none"
                stroke={tone === "muted" ? "var(--ink-4)" : "var(--ink)"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </marker>
          ))}
        </defs>

        {edges.map((edge, i) => {
          const from = byId.get(edge.from);
          const to = byId.get(edge.to);
          if (!from || !to) return null;

          const fromSide = edge.fromSide ?? "right";
          const toSide = edge.toSide ?? "left";
          const muted = edge.tone === "muted";
          const a = anchor(from, fromSide);
          const { d, mark, tail, badge: routeBadge } = route(a, anchor(to, toSide), fromSide, toSide, trunkAt[i]);
          const horizontal = toSide === "right" || toSide === "left";
          const end = landing(anchor(to, toSide), toSide);
          // Значок садится у цели, ярлык у источника: так они не спорят за место.
          const badge = edge.badge ? routeBadge ?? nearEnd(end, tail, horizontal) : null;
          const label = edge.label
            ? edge.badge
              ? { x: horizontal ? (a.x + tail.x) / 2 : a.x, y: horizontal ? a.y : (a.y + tail.y) / 2 }
              : labelSpot(edge.label, a, mark, tail, horizontal)
            : null;

          return (
            <g key={`e-${i}`}>
              <path
                d={d}
                fill="none"
                stroke={muted ? "var(--ink-4)" : "var(--ink)"}
                strokeWidth={muted ? 1.1 : 1.4}
                strokeLinecap="butt"
                strokeDasharray={edge.dashed ? "6 6" : undefined}
                markerEnd={`url(#${id}-${muted ? "muted" : "default"})`}
              />
              {badge && edge.badge ? <Badge x={badge.x} y={badge.y} kind={edge.badge} /> : null}
              {label ? (
                <EdgeLabel x={label.x} y={label.y - 13} text={edge.label as string} />
              ) : null}
            </g>
          );
        })}

        {nodes.map((node) => (
          <Node key={node.id} node={node} />
        ))}
      </svg>

      {legend ? (
        <ul className={styles.legend}>
          {legend.map((item) => (
            <li key={item.label}>
              <span className={`${styles.chip} ${styles[item.tone]}`} aria-hidden="true" />
              {item.label}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/** Ширина подложки под ярлык при кегле 12. */
function labelWidth(text: string) {
  return text.length * 6.6 + 14;
}

/**
 * Подпись ставим на просвет последнего отрезка. Если там не хватает места,
 * уводим на первый отрезок: иначе она залезает на блок или на наконечник.
 */
function spot(
  need: number,
  a: Point,
  mark: Point,
  tail: Point,
  horizontal: boolean,
): { x: number; y: number; onTail: boolean } {
  const room = horizontal ? Math.abs(mark.x - tail.x) * 2 : Math.abs(mark.y - tail.y) * 2;
  if (room >= need + 12) return { x: mark.x, y: mark.y, onTail: true };
  return horizontal
    ? { x: (a.x + tail.x) / 2, y: a.y, onTail: false }
    : { x: a.x, y: (a.y + tail.y) / 2, onTail: false };
}

function labelSpot(text: string, a: Point, mark: Point, tail: Point, horizontal: boolean) {
  return spot(labelWidth(text), a, mark, tail, horizontal);
}

/** Значок ветви: фиксированный отступ от цели, чтобы не лечь на наконечник. */
function nearEnd(end: Point, tail: Point, horizontal: boolean): Point {
  const BACK = 25;
  if (horizontal) {
    const dir = end.x > tail.x ? -1 : 1;
    const reach = Math.abs(end.x - tail.x);
    return { x: end.x + dir * Math.min(BACK, reach * 0.55), y: end.y };
  }
  const dir = end.y > tail.y ? -1 : 1;
  const reach = Math.abs(end.y - tail.y);
  return { x: end.x, y: end.y + dir * Math.min(BACK, reach * 0.55) };
}

/** Ярлык на белой подложке: текст не ложится на линию. */
function EdgeLabel({ x, y, text }: { x: number; y: number; text: string }) {
  const w = labelWidth(text);
  return (
    <g>
      <rect x={x - w / 2} y={y - 11} width={w} height={18} rx={5} className={styles.labelPlate} />
      <text x={x} y={y + 2} textAnchor="middle" className={styles.edgeLabel}>
        {text}
      </text>
    </g>
  );
}

/** Значок ветви: тот же чёрно-белый язык, что и вся схема. */
function Badge({ x, y, kind }: { x: number; y: number; kind: "yes" | "no" }) {
  return (
    <g className={styles.badge}>
      <circle cx={x} cy={y} r={10} className={styles.badgeRing} />
      {kind === "yes" ? (
        <path
          d={`M ${x - 4} ${y} L ${x - 1} ${y + 3} L ${x + 4.5} ${y - 3.2}`}
          fill="none"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.badgeMark}
        />
      ) : (
        <path
          d={`M ${x - 3.4} ${y - 3.4} L ${x + 3.4} ${y + 3.4} M ${x + 3.4} ${y - 3.4} L ${x - 3.4} ${y + 3.4}`}
          fill="none"
          strokeWidth="1.6"
          strokeLinecap="round"
          className={styles.badgeMark}
        />
      )}
    </g>
  );
}

function Node({ node }: { node: DiagramNode }) {
  const tone = node.tone ?? "outline";
  const shape = node.shape ?? "box";
  const isLabel = tone === "label";
  const cx = node.x + node.w / 2;
  const cy = node.y + node.h / 2;

  const hasIndex = typeof node.index === "number";
  const textX = isLabel ? node.x : hasIndex ? node.x + 46 : cx;
  const total = node.lines.length + (node.note ? 1 : 0);
  const lineH = 19;
  const startY = cy - ((total - 1) * lineH) / 2 + 6;

  return (
    <g className={styles[tone]}>
      {isLabel ? null : shape === "diamond" ? (
        <polygon
          points={`${cx},${node.y} ${node.x + node.w},${cy} ${cx},${node.y + node.h} ${node.x},${cy}`}
          className={styles.box}
        />
      ) : (
        <rect
          x={node.x}
          y={node.y}
          width={node.w}
          height={node.h}
          rx={shape === "pill" ? node.h / 2 : 12}
          className={styles.box}
        />
      )}

      {hasIndex ? (
        <>
          <circle cx={node.x + 26} cy={cy} r={13} className={styles.indexRing} />
          <text x={node.x + 26} y={cy + 5} textAnchor="middle" className={styles.indexText}>
            {node.index}
          </text>
        </>
      ) : null}

      <text textAnchor={isLabel || hasIndex ? "start" : "middle"} className={styles.text}>
        {node.lines.map((line, i) => (
          <tspan key={line} x={textX} y={startY + i * lineH}>
            {line}
          </tspan>
        ))}
        {node.note ? (
          <tspan x={textX} y={startY + node.lines.length * lineH} className={styles.note}>
            {node.note}
          </tspan>
        ) : null}
      </text>
    </g>
  );
}
