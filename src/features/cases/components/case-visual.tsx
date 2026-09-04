import Image from "next/image";
import type { CaseVisual as Visual, FrameworkTag } from "../types";
import { asset } from "@/config/site";
import { Diagram } from "./diagram";
import styles from "./case-visual.module.css";

type CaseVisualProps = {
  visual: Visual;
};

/** Один вход для всех схем и снимков внутри кейса. */
export function CaseVisual({ visual }: CaseVisualProps) {
  return (
    <figure className={styles.figure}>
      {visual.framework ? <FrameworkHead tag={visual.framework} /> : null}
      <Body visual={visual} />
      {visual.caption ? <figcaption className={styles.caption}>{visual.caption}</figcaption> : null}
    </figure>
  );
}

function FrameworkHead({ tag }: { tag: FrameworkTag }) {
  return (
    <div className={styles.fw}>
      <span className={styles.fwBadge}>Фреймворк</span>
      <p className={styles.fwName}>{tag.name}</p>
      <p className={styles.fwWhat}>{tag.what}</p>
    </div>
  );
}

function Body({ visual }: CaseVisualProps) {
  switch (visual.kind) {
    case "shot":
      return <Shot visual={visual} />;
    case "journey":
      return <Journey visual={visual} />;
    case "plot":
      return <Plot visual={visual} />;
    case "principles":
      return <Principles visual={visual} />;
    case "decisions":
      return <Decisions visual={visual} />;
    case "metrics":
      return <Metrics visual={visual} />;
    case "diagram":
      return (
        <div className={styles.panel}>
          <Diagram
            id={"dg-" + (visual.nodes[0]?.id ?? "x") + "-" + visual.width}
            width={visual.width}
            height={visual.height}
            nodes={visual.nodes}
            edges={visual.edges}
            legend={visual.legend}
          />
        </div>
      );
    default:
      return null;
  }
}

/* ---------------- снимок экрана ---------------- */

function Shot({ visual }: { visual: Extract<Visual, { kind: "shot" }> }) {
  return (
    <div className={styles.frame}>
      <div className={styles.frameBar}>
        <span className={styles.dots} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        {visual.url ? <span className={styles.frameUrl}>{visual.url}</span> : null}
      </div>
      <Image
        src={asset(visual.src)}
        alt={visual.alt}
        width={2162}
        height={1350}
        sizes="(max-width: 900px) 100vw, 780px"
        className={styles.shotImage}
      />
    </div>
  );
}

/* ---------------- путь и кривая настроения ---------------- */

function Journey({ visual }: { visual: Extract<Visual, { kind: "journey" }> }) {
  const { stages } = visual;
  const step = 100 / stages.length;
  const points = stages.map((s, i) => `${step * i + step / 2},${s.mood}`).join(" ");

  return (
    <div className={styles.panel}>
      <div className={styles.jRow} style={{ "--cols": stages.length } as React.CSSProperties}>
        {stages.map((s) => (
          <p key={s.stage} className={styles.jStage}>
            {s.stage}
          </p>
        ))}
      </div>

      <div className={styles.jCurve}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <polyline
            points={points}
            fill="none"
            stroke="var(--ink)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
        <div className={styles.jDots} style={{ "--cols": stages.length } as React.CSSProperties}>
          {stages.map((s) => (
            <i
              key={s.stage}
              className={s.drop ? styles.jDotDrop : undefined}
              style={{ height: `${s.mood}%` }}
            />
          ))}
        </div>
      </div>

      <div className={styles.jRow} style={{ "--cols": stages.length } as React.CSSProperties}>
        {stages.map((s) => (
          <div key={s.stage} className={s.drop ? styles.jCardDrop : styles.jCard}>
            <b>{s.emotion}</b>
            {s.barrier}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- поле с точками ---------------- */

function Plot({ visual }: { visual: Extract<Visual, { kind: "plot" }> }) {
  const [tl, tr, bl, br] = visual.quadrants;
  return (
    <div className={styles.plotWrap}>
      <span className={styles.axY}>{visual.yLabel}</span>
      <div className={styles.field}>
        <span className={styles.tint} />
        <span className={styles.midH} />
        <span className={styles.midV} />
        <span className={`${styles.qLab} ${styles.qTL}`}>{tl}</span>
        <span className={`${styles.qLab} ${styles.qTR}`}>{tr}</span>
        <span className={`${styles.qLab} ${styles.qBL}`}>{bl}</span>
        <span className={`${styles.qLab} ${styles.qBR}`}>{br}</span>

        {visual.dots.map((dot) => (
          <span
            key={dot.label}
            className={dot.hot ? styles.dotHot : styles.dot}
            style={{ left: `${dot.x}%`, bottom: `${dot.y}%` }}
          >
            <i />
            {dot.label}
          </span>
        ))}
      </div>
      <span />
      <span className={styles.axX}>{visual.xLabel}</span>
    </div>
  );
}

/* ---------------- принципы ---------------- */

function Principles({ visual }: { visual: Extract<Visual, { kind: "principles" }> }) {
  return (
    <ul className={styles.principles}>
      {visual.items.map((item, i) => (
        <li key={item.title} className={styles.principle}>
          <span className={`mono ${styles.principleNum}`}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <h4 className={styles.principleTitle}>{item.title}</h4>
          <p className={styles.principleBody}>{item.body}</p>
        </li>
      ))}
    </ul>
  );
}

/* ---------------- лог решений ---------------- */

function Decisions({ visual }: { visual: Extract<Visual, { kind: "decisions" }> }) {
  return (
    <div className={styles.decisions}>
      {visual.rows.map((row) => (
        <div key={row.took} className={styles.fork}>
          <div className={styles.forkTook}>
            <span className="label">Взял</span>
            <p>{row.took}</p>
          </div>
          <div className={styles.forkDrop}>
            <span className="label">Отверг</span>
            <p>{row.rejected}</p>
          </div>
          <div className={styles.forkCost}>
            <span className="label">Чем плачу</span>
            <p>{row.cost}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- воронка метрик ---------------- */

function Metrics({ visual }: { visual: Extract<Visual, { kind: "metrics" }> }) {
  return (
    <div className={styles.metrics}>
      <div className={styles.mHead}>
        <span className="label">Шаг воронки</span>
        <span className="label">Сейчас</span>
        <span className="label">Цель</span>
      </div>
      {visual.rows.map((row) => (
        <div key={row.stage} className={styles.mRow}>
          <div>
            <p className={styles.mStage}>{row.stage}</p>
            {row.note ? <p className={styles.mNote}>{row.note}</p> : null}
          </div>
          <p className={styles.mNow}>{row.value}</p>
          <p className={styles.mTarget}>{row.target}</p>
        </div>
      ))}
    </div>
  );
}
