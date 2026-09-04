import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { BrowserFrame } from "@/components/ui/browser-frame";
import { ArrowLink } from "@/components/ui/arrow-link";
import { getCase, getPublishedCases, CaseVisual } from "@/features/cases";
import { site } from "@/config/site";
import styles from "./case.module.css";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Статический экспорт: собираем страницы только для опубликованных кейсов. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedCases().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.outcome,
  };
}

export default async function CasePage({ params }: PageProps) {
  const { slug } = await params;
  const item = getCase(slug);

  if (!item || item.status === "draft") {
    notFound();
  }

  const published = getPublishedCases();
  const currentIndex = published.findIndex((entry) => entry.slug === item.slug);
  const next = published[(currentIndex + 1) % published.length];

  const meta = [
    { label: "Клиент", value: item.client },
    { label: "Роль", value: item.role },
    { label: "Сроки", value: item.timeline },
    { label: "Команда", value: item.team },
  ];

  return (
    <>
      {/* ---------- Шапка кейса ---------- */}
      <section className={styles.hero}>
        <Container>
          <Link href="/work" className={styles.back}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M8.5 3L4.5 7L8.5 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Все кейсы
          </Link>

          <div className={styles.heroMeta}>
            <Pill>{item.industryLabel}</Pill>
            <span className={styles.heroType}>{item.type}</span>
            <span className={styles.heroDot} aria-hidden="true" />
            <span className={styles.heroType}>{item.year}</span>
          </div>

          <h1 className={styles.title}>{item.outcome}</h1>
          <p className={styles.project}>{item.title}</p>
          <p className={styles.summary}>{item.summary}</p>

          {item.liveUrl ? (
            <p className={styles.live}>
              <ArrowLink href={item.liveUrl} external>
                Открыть вживую
              </ArrowLink>
            </p>
          ) : null}

          <dl className={styles.metaGrid}>
            {meta.map((entry) => (
              <div key={entry.label} className={styles.metaItem}>
                <dt className="label">{entry.label}</dt>
                <dd className={styles.metaValue}>{entry.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ---------- Метрики ---------- */}
      <div className={styles.metricsBand}>
        <Container>
          <ul className={styles.metrics}>
            {item.metrics.map((metric, i) => (
              <Reveal key={metric.label} as="li" delay={i * 60} className={styles.metric}>
                <span className={styles.metricValue}>{metric.value}</span>
                <span className={styles.metricLabel}>{metric.label}</span>
              </Reveal>
            ))}
          </ul>
        </Container>
      </div>

      {/* ---------- Ключевой визуал ---------- */}
      <Section>
        <Container>
          <Reveal>
            {item.cover ? (
              <CaseVisual
                visual={{
                  kind: "shot",
                  src: item.cover.src,
                  alt: item.cover.alt,
                  url: item.liveUrl?.replace(/^https?:\/\//, ""),
                }}
              />
            ) : (
              <BrowserFrame
                url={item.slug + ".product"}
                caption="Заглушка: сюда встанет ключевой экран кейса"
              />
            )}
          </Reveal>
        </Container>
      </Section>

      {/* ---------- Разделы ---------- */}
      <Section tone="sand">
        <Container>
          <div className={styles.blocks}>
            {item.blocks.map((block) => (
              <Reveal key={block.kicker}>
                <article className={styles.block}>
                  <div className={styles.blockHead}>
                    <span className={"mono " + styles.blockNum}>{block.kicker}</span>
                    <h2 className={styles.blockTitle}>{block.title}</h2>
                  </div>
                  <div className={styles.blockBody}>
                    <p className={styles.blockText}>{block.body}</p>
                    {block.visual ? (
                      <CaseVisual visual={block.visual} />
                    ) : (
                      <div className={styles.blockPlaceholder} aria-hidden="true">
                        <span>Блок фреймворка или визуал</span>
                      </div>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------- Следующий кейс ---------- */}
      <Section>
        <Container>
          <Reveal>
            <Link href={"/work/" + next.slug} className={styles.next}>
              <div>
                <p className="label">Следующий кейс</p>
                <p className={styles.nextTitle}>{next.outcome}</p>
                <p className={styles.nextProject}>{next.title}</p>
              </div>
              <span className={styles.nextArrow} aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M5 15L15 5M15 5H8M15 5V12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </Reveal>

          <div className={styles.cta}>
            <p className={styles.ctaText}>Хотите обсудить похожую задачу?</p>
            <ButtonLink href={"mailto:" + site.email} variant="primary" size="md" external>
              Написать
            </ButtonLink>
            <ArrowLink href="/about">Обо мне</ArrowLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
