"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./typed-headline.module.css";

/** Каждая реплика в две строки: верхняя обычная, нижняя приглушённая. */
const LINES: [string, string][] = [
  ["Привет, я Дарий", "продуктовый дизайнер"],
  ["Я делаю", "UX-исследования"],
  ["Я делаю", "интерфейсы продуктов"],
  ["Я делаю", "AI-инструменты"],
  ["Я делаю", "работающие прототипы"],
];

const PHRASES = LINES.map(([a, b]) => a + "\n" + b);

/** Самая длинная реплика задаёт высоту блока на любой ширине экрана. */
const LONGEST = LINES.reduce((best, pair) =>
  pair[0].length + pair[1].length > best[0].length + best[1].length ? pair : best,
);

const TYPE = 78;
const ERASE = 38;
const HOLD = 2400;
const AFTER_ERASE = 340;

/** Uneven keystrokes, short word-boundary pauses and occasional hesitation. */
function keystrokeDelay(character: string, erasing = false): number {
  const base = erasing ? ERASE : TYPE;
  const jitter = Math.random() * (erasing ? 48 : 85);
  const boundary = /[\s,.:—]/.test(character) ? (erasing ? 35 : 110) : 0;
  const hesitation = Math.random() < 0.08 ? (erasing ? 90 : 170) : 0;
  return base + jitter + boundary + hesitation;
}

/** Сколько символов у соседних реплик совпадает: их не перенабираем. */
function commonPrefix(a: string, b: string): number {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i += 1;
  return i;
}

export function TypedHeadline() {
  const [shown, setShown] = useState(LINES[0][0] + "\n");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    let index = 0;
    let length = LINES[0][0].length + 1;
    let erasing = false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timer.current = setTimeout(() => setShown(PHRASES[0]), 0);
      return () => clearTimeout(timer.current);
    }

    const tick = () => {
      const target = PHRASES[index];

      if (!erasing) {
        if (length < target.length) {
          length += 1;
          setShown(target.slice(0, length));
          timer.current = setTimeout(tick, keystrokeDelay(target[length - 1]));
          return;
        }
        erasing = true;
        timer.current = setTimeout(tick, HOLD + Math.random() * 500);
        return;
      }

      const next = PHRASES[(index + 1) % PHRASES.length];
      const keep = commonPrefix(target, next);

      if (length > keep) {
        length -= 1;
        setShown(target.slice(0, length));
        timer.current = setTimeout(tick, keystrokeDelay(target[length], true));
        return;
      }

      index = (index + 1) % PHRASES.length;
      erasing = false;
      timer.current = setTimeout(tick, AFTER_ERASE + Math.random() * 220);
    };

    timer.current = setTimeout(tick, 300);
    return () => clearTimeout(timer.current);
  }, []);

  const [first = "", second = ""] = shown.split("\n");
  const onSecond = shown.includes("\n");

  return (
    <>
      <span className="visually-hidden">
        Дарий Назаров, продуктовый дизайнер: UX-исследования, интерфейсы продуктов, AI-инструменты, работающие прототипы
      </span>
      <span className={styles.root} aria-hidden="true">
        {/* Невидимая распорка по самой длинной реплике: высота и ширина не скачут
            при наборе. Курсор считаем тоже, иначе строка переносится в момент,
            когда он стоит в её конце. */}
        <span className={styles.sizer}>
          <span className={styles.line}>
            {LONGEST[0]}
            <i className={styles.caret} />
          </span>
          <span className={styles.line}>
            {LONGEST[1]}
            <i className={styles.caret} />
          </span>
        </span>

        <span className={styles.text}>
          <span className={styles.line}>
            {first}
            {onSecond ? null : <i className={styles.caret} />}
          </span>
          <span className={styles.line + " dim"}>
            {second}
            {onSecond ? <i className={styles.caret} /> : null}
          </span>
        </span>
      </span>
    </>
  );
}
