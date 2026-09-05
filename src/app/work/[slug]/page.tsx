import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { BrowserFrame } from "@/components/ui/browser-frame";
import { ArrowLink } from "@/components/ui/arrow-link";
import { getCase, getPublishedCases, CaseVisual } from "@/features/cases";
import { site, asset } from "@/config/site";
import { CaseNav } from "./_components/case-nav";
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

  const navItems = [
    ...(item.businessGoal ? [{ id: "goal", label: "Зачем это бизнесу" }] : []),
    ...item.blocks.map((block) => ({
      id: "s-" + block.kicker,
      label: block.title,
      num: block.kicker,
    })),
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

      {/* ---------- Обложка во всю ширину ---------- */}
      <div className={styles.coverWrap}>
        {item.cover ? (
          <Image
            src={asset(item.cover.src)}
            alt={item.cover.alt}
            width={2400}
            height={1500}
            priority
            sizes="100vw"
            className={styles.cover}
          />
        ) : (
          <Container>
            <BrowserFrame url={item.slug + ".product"} />
          </Container>
        )}
      </div>

      {/* ---------- Тело кейса с навигацией ---------- */}
      <div className={styles.body}>
        <Container size="wide">
          <div className={styles.layout}>
            <CaseNav items={navItems} />

            <div className={styles.content}>
              {item.businessGoal ? (
                <section id="goal" className={styles.section}>
                  <p className="label">Зачем это бизнесу</p>
                  <h2 className={styles.goalTitle}>{item.businessGoal.goal}</h2>
                  <div className={styles.goalGrid}>
                    <div className={styles.goalCard}>
                      <span className="label">Где деньги</span>
                      <p>{item.businessGoal.money}</p>
                    </div>
                    <div className={styles.goalCardAccent}>
                      <span className="label">На что жму</span>
                      <p>{item.businessGoal.lever}</p>
                    </div>
                  </div>
                </section>
              ) : null}

              {item.blocks.map((block) => (
                <Reveal
                  key={block.kicker}
                  as="section"
                  id={"s-" + block.kicker}
                  className={styles.section}
                >
                  <p className={"mono " + styles.blockNum}>{block.kicker}</p>
                  <h2 className={styles.blockTitle}>{block.title}</h2>
                  <p className={styles.blockText}>{block.body}</p>
                  {block.visual ? <CaseVisual visual={block.visual} /> : null}
                  {block.visuals?.map((visual, i) => (
                    <CaseVisual key={block.kicker + "-" + i} visual={visual} />
                  ))}
                </Reveal>
              ))}

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
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
