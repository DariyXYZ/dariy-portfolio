import Link from "next/link";
import Image from "next/image";
import type { CaseStudy } from "../types";
import { asset } from "@/config/site";
import { Pill } from "@/components/ui/pill";
import styles from "./case-card.module.css";

type CaseCardProps = {
  item: CaseStudy;
  /** Первая карточка в списке занимает всю ширину — задаёт акцент. */
  wide?: boolean;
  index?: number;
};

export function CaseCard({ item, wide, index }: CaseCardProps) {
  const draft = item.status === "draft";
  const className = [styles.card, wide ? styles.wide : "", draft ? styles.draft : ""]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      <div className={styles.visual}>
        {item.cover ? (
          <div className={styles.coverWrap}>
            <Image
              src={asset(item.cover.src)}
              alt={item.cover.alt}
              width={2162}
              height={1350}
              sizes={wide ? "(max-width: 900px) 100vw, 1140px" : "(max-width: 900px) 100vw, 560px"}
              className={styles.cover}
            />
          </div>
        ) : (
          <div className={styles.visualInner} aria-hidden="true">
            <span className={styles.visualLabel}>Обложка кейса</span>
          </div>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.meta}>
          {typeof index === "number" ? (
            <span className={"mono " + styles.num}>
              {String(index + 1).padStart(2, "0")}
            </span>
          ) : null}
          <span className={styles.type}>{item.type}</span>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.type}>{item.year}</span>
          {draft ? <Pill tone="outline">Готовлю</Pill> : null}
        </div>

        <h3 className={styles.outcome}>{item.outcome}</h3>
        <p className={styles.project}>{item.title}</p>

        <ul className={styles.metrics}>
          {item.metrics.slice(0, 3).map((metric) => (
            <li key={metric.label} className={styles.metric}>
              <span className={styles.metricValue}>{metric.value}</span>
              <span className={styles.metricLabel}>{metric.label}</span>
            </li>
          ))}
        </ul>

        <div className={styles.footer}>
          <span className={styles.cta}>
            {draft ? "Скоро" : "Смотреть кейс"}
            {!draft ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M3 11L11 3M11 3H5M11 3V9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : null}
          </span>
          <span className={styles.tags}>{item.tags.slice(0, 2).join(" · ")}</span>
        </div>
      </div>
    </>
  );

  if (draft) {
    return <article className={className}>{inner}</article>;
  }

  return (
    <article className={className}>
      <Link href={"/work/" + item.slug} className={styles.link}>
        <span className="visually-hidden">{item.title}</span>
      </Link>
      {inner}
    </article>
  );
}
