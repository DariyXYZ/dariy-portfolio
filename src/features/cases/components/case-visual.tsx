import Image from "next/image";
import type { CaseVisual as Visual, FrameworkTag } from "../types";
import { asset } from "@/config/site";
import { Diagram } from "./diagram";
import { Zoomable } from "./zoomable";
import styles from "./case-visual.module.css";

type CaseVisualProps = {
  visual: Visual;
};

/** Один вход для всех схем и снимков внутри кейса. */
/** Экраны видны сразу. Всё, что помечено фреймворком, прячем под раскрытие. */
const ALWAYS_OPEN = new Set(["shot", "screens", "compare"]);

export function CaseVisual({ visual }: CaseVisualProps) {
  const caption = visual.caption ? (
    <figcaption className={styles.caption}>{visual.caption}</figcaption>
  ) : null;

  if (!visual.framework || ALWAYS_OPEN.has(visual.kind)) {
    return (
      <figure className={styles.figure}>
        {visual.framework ? <FrameworkHead tag={visual.framework} /> : null}
        <Body visual={visual} />
        {caption}
      </figure>
    );
  }

  return (
    <figure className={styles.figure}>
      <details className={styles.fold}>
        <summary className={styles.foldHead}>
          <span className={styles.pm} aria-hidden="true" />
          <span className={styles.foldMain}>
            <span className={styles.foldName}>{visual.framework.name}</span>
            <span className={styles.foldWhat}>{visual.framework.what}</span>
          </span>
          <span className={styles.foldTag}>Фреймворк</span>
        </summary>
        <div className={styles.foldBody}>
          <Body visual={visual} />
          {caption}
        </div>
      </details>
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
    case "screens":
      return <Screens visual={visual} />;
    case "compare":
      return <Compare visual={visual} />;
    case "artifact":
      return <Artifact visual={visual} />;
    case "journey":
      return <Journey visual={visual} />;
    case "plot":
      return <Plot visual={visual} />;
    case "principles":
      return <Principles visual={visual} />;
    case "table":
      return <Table visual={visual} />;
    case "quotes":
      return <Quotes visual={visual} />;
    case "stories":
      return <Stories visual={visual} />;
    case "plan":
      return <Plan visual={visual} />;
    case "stat":
      return <Stat visual={visual} />;
    case "transcript":
      return <Transcript visual={visual} />;
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

/* ---------------- ряд мобильных экранов ---------------- */

function Screens({ visual }: { visual: Extract<Visual, { kind: "screens" }> }) {
  const wide = visual.size === "wide";
  const cls = wide ? styles.scRowWide : visual.size === "sm" ? styles.scRowSm : styles.scRow;

  return (
    <ul className={cls}>
      {visual.items.map((item) => (
        <li key={item.src} className={styles.scItem}>
          <div className={wide ? styles.screenFrame : styles.phone}>
            <Image
              src={asset(item.src)}
              alt={item.alt}
              width={wide ? 1440 : 780}
              height={wide ? 1024 : 1688}
              sizes={wide ? "(max-width: 900px) 100vw, 1100px" : "(max-width: 700px) 45vw, 220px"}
              className={styles.phoneImage}
            />
          </div>
          <p className={styles.scLabel}>{item.label}</p>
          {item.note ? <p className={styles.scNote}>{item.note}</p> : null}
        </li>
      ))}
    </ul>
  );
}

/* ---------------- было и стало ---------------- */

function Compare({ visual }: { visual: Extract<Visual, { kind: "compare" }> }) {
  return (
    <div className={styles.cmpList}>
      {visual.pairs.map((pair) => (
        <div key={pair.label} className={styles.cmp}>
          <div className={styles.cmpText}>
            <p className={styles.cmpLabel}>{pair.label}</p>
            <p className={styles.cmpNote}>{pair.note}</p>
          </div>
          <div className={styles.cmpPair}>
            <figure className={styles.cmpSide}>
              <span className={styles.cmpBadgeWas}>Было</span>
              <div className={styles.phone}>
                <Image
                  src={asset(pair.before)}
                  alt={`До правки: ${pair.label}`}
                  width={780}
                  height={1688}
                  sizes="(max-width: 700px) 40vw, 200px"
                  className={styles.phoneImage}
                />
              </div>
            </figure>
            <span className={styles.cmpArrow} aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path
                  d="M4 11h13m0 0-4.5-4.5M17 11l-4.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <figure className={styles.cmpSide}>
              <span className={styles.cmpBadgeNow}>Стало</span>
              <div className={styles.phone}>
                <Image
                  src={asset(pair.after)}
                  alt={`После правки: ${pair.label}`}
                  width={780}
                  height={1688}
                  sizes="(max-width: 700px) 40vw, 200px"
                  className={styles.phoneImage}
                />
              </div>
            </figure>
          </div>
        </div>
      ))}
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
        {visual.highlight ? (
          <span className={`${styles.tint} ${styles["tint" + visual.highlight.toUpperCase()]}`} />
        ) : null}
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

/* ---------------- таблица сравнения ---------------- */

function Table({ visual }: { visual: Extract<Visual, { kind: "table" }> }) {
  const cols = visual.wideFirst
    ? `1.1fr repeat(${visual.columns.length - 1}, 1fr)`
    : `repeat(${visual.columns.length}, 1fr)`;

  return (
    <div className={styles.tableWrap}>
      <div className={styles.table} style={{ "--cols": cols } as React.CSSProperties}>
        <div className={styles.tHead}>
          {visual.columns.map((col) => (
            <span key={col} className="label">
              {col}
            </span>
          ))}
        </div>
        {visual.rows.map((row) => (
          <div key={row.cells[0]} className={row.accent ? styles.tRowAccent : styles.tRow}>
            {row.cells.map((cell, i) => (
              <p key={i} className={i === 0 ? styles.tKey : styles.tCell}>
                {cell}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- реплики и выводы ---------------- */

function Quotes({ visual }: { visual: Extract<Visual, { kind: "quotes" }> }) {
  return (
    <ul className={styles.quotes}>
      {visual.items.map((item) => (
        <li key={item.quote} className={styles.quote}>
          <p className={styles.qText}>{`«${item.quote}»`}</p>
          <p className={styles.qWho}>{item.who}</p>
          <p className={styles.qInsight}>{item.insight}</p>
          {item.action ? (
            <p className={styles.qAction}>
              <span className="label">Что сделал</span>
              {item.action}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

/* ---------------- истории и критерии ---------------- */

function Stories({ visual }: { visual: Extract<Visual, { kind: "stories" }> }) {
  return (
    <ul className={styles.stories}>
      {visual.items.map((item, i) => (
        <li key={item.story} className={styles.story}>
          <span className={"mono " + styles.stId}>{item.id ?? "US" + (i + 1)}</span>
          <div className={styles.stBody}>
            <p className={styles.stText}>{item.story}</p>
            <ul className={styles.stCrit}>
              {item.criteria.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            {item.note ? <p className={styles.stNote}>{item.note}</p> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ---------------- структурированный документ ---------------- */

function Plan({ visual }: { visual: Extract<Visual, { kind: "plan" }> }) {
  return (
    <div
      className={styles.plan}
      style={{ "--cols": visual.columns ?? 2 } as React.CSSProperties}
    >
      {visual.groups.map((group) => (
        <section key={group.title} className={styles.plGroup}>
          <h4 className={styles.plTitle}>{group.title}</h4>
          <ul className={styles.plList}>
            {group.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/* ---------------- крупные числа ---------------- */

function Stat({ visual }: { visual: Extract<Visual, { kind: "stat" }> }) {
  return (
    <ul className={styles.stats}>
      {visual.items.map((item) => (
        <li key={item.label} className={styles.statItem}>
          <span className={styles.statValue}>{item.value}</span>
          <span className={styles.statLabel}>{item.label}</span>
          {item.note ? <span className={styles.statNote}>{item.note}</span> : null}
        </li>
      ))}
    </ul>
  );
}

/* ---------------- расшифровки сессий ---------------- */

function Transcript({ visual }: { visual: Extract<Visual, { kind: "transcript" }> }) {
  return (
    <div className={styles.transcript}>
      {visual.sessions.map((session) => (
        <article key={session.who} className={styles.session}>
          <header className={styles.sHead}>
            <p className={styles.sWho}>{session.who}</p>
            <span className={styles.sTag}>{session.tag}</span>
          </header>
          {session.sections.map((section) => (
            <div key={section.title} className={styles.sSection}>
              <p className="label">{section.title}</p>
              <ul className={styles.sLines}>
                {section.lines.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </article>
      ))}
    </div>
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

/* ---------------- артефакт исследования ---------------- */

function Artifact({ visual }: { visual: Extract<Visual, { kind: "artifact" }> }) {
  return (
    <div className={styles.artifact}>
      <p className={styles.artifactTitle}>{visual.title}</p>
      <Zoomable src={asset(visual.src)} alt={visual.alt} />
    </div>
  );
}
