"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./typed-headline.module.css";

/** Каждая реплика в две строки: верхняя обычная, нижняя приглушённая. */
const LINES: [string, string][] = [
  ["Привет!", "Меня зовут Дарий"],
  ["Я продуктовый дизайнер", "умею в UX-исследования"],
  ["Я продуктовый дизайнер", "умею в B2B-интерфейсы"],
  ["Я продуктовый дизайнер", "умею в ИИ-инструменты"],
  ["И даже во фронтенд могу!", "Так что разработка меня поймёт"],
];

const PHRASES = LINES.map(([a, b]) => a + "\n" + b);

/** Самая длинная реплика задаёт высоту блока на любой ширине экрана. */
const LONGEST = LINES.reduce((best, pair) =>
  pair[0].length + pair[1].length > best[0].length + best[1].length ? pair : best,
);

const TYPE = 52;
const ERASE = 24;
const HOLD = 2100;
const AFTER_ERASE = 260;

/** Сколько символов у соседних реплик совпадает: их не перенабираем. */
function commonPrefix(a: string, b: string): number {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i += 1;
  return i;
}

export function TypedHeadline() {
  const [shown, setShown] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    let index = 0;
    let length = 0;
    let erasing = false;
    const stop = false;

    const tick = () => {
      if (stop) return;
      const target = PHRASES[index];

      if (!erasing) {
        if (length < target.length) {
          length += 1;
          setShown(target.slice(0, length));
          timer.current = setTimeout(tick, TYPE + Math.random() * 45);
          return;
        }
        erasing = true;
        timer.current = setTimeout(tick, HOLD);
        return;
      }

      const next = PHRASES[(index + 1) % PHRASES.length];
      const keep = commonPrefix(target, next);

      if (length > keep) {
        length -= 1;
        setShown(target.slice(0, length));
        timer.current = setTimeout(tick, ERASE);
        return;
      }

      index = (index + 1) % PHRASES.length;
      erasing = false;
      timer.current = setTimeout(tick, AFTER_ERASE);
    };

    timer.current = setTimeout(tick, 700);
    return () => clearTimeout(timer.current);
  }, []);

  const [first = "", second = ""] = shown.split("\n");
  const onSecond = shown.includes("\n");

  return (
    <>
      <span className="visually-hidden">
        Дарий Назаров, продуктовый дизайнер: UX-исследования, B2B-интерфейсы, ИИ-инструменты
      </span>
      <span className={styles.root} aria-hidden="true">
        {/* Невидимая распорка по самой длинной реплике: высота не скачет при наборе. */}
        <span className={styles.sizer}>
          <span className={styles.line}>{LONGEST[0]}</span>
          <span className={styles.line}>{LONGEST[1]}</span>
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
