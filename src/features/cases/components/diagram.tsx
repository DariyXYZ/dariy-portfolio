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

const CORNER = 16;
const ARROW = 10;
/** Запас вокруг холста, иначе рамки и стрелки срезает краем. */
const PAD = 16;

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

/** Ортогональный маршрут с одним мягким поворотом. */
function routePath(a: Point, b: Point, fromSide: Side, toSide: Side, bend: number) {
  const gap = 5;
  const end: Point =
    toSide === "left"
      ? { x: b.x - gap, y: b.y }
      : toSide === "right"
        ? { x: b.x + gap, y: b.y }
        : toSide === "top"
          ? { x: b.x, y: b.y - gap }
          : { x: b.x, y: b.y + gap };

  const horizontal = fromSide === "right" || fromSide === "left";
  const dirX = fromSide === "right" ? 1 : -1;
  const dirY = fromSide === "bottom" ? 1 : -1;

  if (horizontal) {
    if (Math.abs(a.y - end.y) < 1) {
      return { d: `M ${a.x} ${a.y} L ${end.x} ${end.y}`, mid: { x: (a.x + end.x) / 2, y: a.y } };
    }
    const mx = a.x + (end.x - a.x) * bend;
    const down = end.y > a.y ? 1 : -1;
    const r = Math.min(CORNER, Math.abs(end.y - a.y) / 2, Math.abs(mx - a.x), Math.abs(end.x - mx));
    return {
      d: [
        `M ${a.x} ${a.y}`,
        `L ${mx - r * dirX} ${a.y}`,
        `Q ${mx} ${a.y} ${mx} ${a.y + r * down}`,
        `L ${mx} ${end.y - r * down}`,
        `Q ${mx} ${end.y} ${mx + r * dirX} ${end.y}`,
        `L ${end.x} ${end.y}`,
      ].join(" "),
      mid: { x: mx, y: (a.y + end.y) / 2 },
    };
  }

  if (Math.abs(a.x - end.x) < 1) {
    return { d: `M ${a.x} ${a.y} L ${end.x} ${end.y}`, mid: { x: a.x, y: (a.y + end.y) / 2 } };
  }
  const my = a.y + (end.y - a.y) * bend;
  const right = end.x > a.x ? 1 : -1;
  const r = Math.min(CORNER, Math.abs(end.x - a.x) / 2, Math.abs(my - a.y), Math.abs(end.y - my));
  return {
    d: [
      `M ${a.x} ${a.y}`,
      `L ${a.x} ${my - r * dirY}`,
      `Q ${a.x} ${my} ${a.x + r * right} ${my}`,
      `L ${end.x - r * right} ${my}`,
      `Q ${end.x} ${my} ${end.x} ${my + r * dirY}`,
      `L ${end.x} ${end.y}`,
    ].join(" "),
    mid: { x: (a.x + end.x) / 2, y: my },
  };
}

export function Diagram({ id, width, height, nodes, edges, legend }: DiagramProps) {
  const byId = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div className={styles.scroll}>
      <svg
        className={styles.svg}
        viewBox={`${-PAD} ${-PAD} ${width + PAD * 2} ${height + PAD * 2}`}
        style={{ minWidth: Math.min(width, 640) }}
        role="img"
      >
        <defs>
          {(["default", "muted"] as const).map((tone) => (
            <marker
              key={tone}
              id={`${id}-${tone}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth={ARROW}
              markerHeight={ARROW}
              markerUnits="userSpaceOnUse"
              orient="auto-start-reverse"
            >
              <path
                d="M 1.5 1.5 L 9 5 L 1.5 8.5 z"
                fill={tone === "muted" ? "var(--ink-4)" : "var(--ink)"}
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
          const { d, mid } = routePath(
            anchor(from, fromSide),
            anchor(to, toSide),
            fromSide,
            toSide,
            edge.bend ?? 0.5,
          );

          return (
            <g key={`e-${i}`}>
              <path
                d={d}
                fill="none"
                stroke={muted ? "var(--ink-4)" : "var(--ink)"}
                strokeWidth={muted ? 1.25 : 1.5}
                strokeLinecap="round"
                strokeDasharray={edge.dashed ? "6 6" : undefined}
                markerEnd={`url(#${id}-${muted ? "muted" : "default"})`}
              />
              {/* точка выхода, как на инженерных схемах */}
              <circle
                cx={anchor(from, fromSide).x}
                cy={anchor(from, fromSide).y}
                r={3}
                className={styles.port}
              />
              {edge.badge ? <Badge x={mid.x} y={mid.y} kind={edge.badge} /> : null}
              {edge.label ? (
                <text x={mid.x} y={mid.y - 14} textAnchor="middle" className={styles.edgeLabel}>
                  {edge.label}
                </text>
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

function Badge({ x, y, kind }: { x: number; y: number; kind: "yes" | "no" }) {
  const yes = kind === "yes";
  return (
    <g className={yes ? styles.badgeYes : styles.badgeNo}>
      <circle cx={x} cy={y} r={11} className={styles.badgeRing} />
      {yes ? (
        <path
          d={`M ${x - 4.5} ${y} L ${x - 1} ${y + 3.5} L ${x + 5} ${y - 3.5}`}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.badgeMark}
        />
      ) : (
        <path
          d={`M ${x - 3.8} ${y - 3.8} L ${x + 3.8} ${y + 3.8} M ${x + 3.8} ${y - 3.8} L ${x - 3.8} ${y + 3.8}`}
          fill="none"
          strokeWidth="2"
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
          rx={shape === "pill" ? node.h / 2 : 14}
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

      <text
        textAnchor={isLabel || hasIndex ? "start" : "middle"}
        className={styles.text}
      >
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
