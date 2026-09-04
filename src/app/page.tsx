import { Container } from "@/components/ui/container";
import { Section, SectionHead } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { Reveal } from "@/components/ui/reveal";
import { ArrowLink } from "@/components/ui/arrow-link";
import { BrowserFrame } from "@/components/ui/browser-frame";
import { CaseCard, getFeaturedCases } from "@/features/cases";
import { process, experience } from "@/features/profile";
import { site, facts } from "@/config/site";
import { HeroArc } from "./_components/hero-arc";
import styles from "./page.module.css";

export default function HomePage() {
  const featured = getFeaturedCases();

  return (
    <>
      {/* ---------- Первый экран ---------- */}
      <section className={styles.hero}>
        <HeroArc />
        <Container>
          <div className={styles.heroInner}>
            <div className={styles.fadeUp + " " + styles.d1}>
              <Pill tone="live">{site.availability.label}</Pill>
            </div>

            <h1 className={styles.heroTitle + " " + styles.fadeUp + " " + styles.d2}>
              Сложное&nbsp;решение&nbsp;&mdash;{" "}
              <span className="dim">за&nbsp;один&nbsp;экран</span>
            </h1>

            <p className={styles.heroLead + " " + styles.fadeUp + " " + styles.d3}>
              Продуктовый дизайнер с четырьмя годами в AI SaaS, EdTech и e-commerce.
              Веду полный цикл: исследование, сценарий, дизайн-система, авторский
              надзор на разработке.
            </p>

            <div className={styles.heroActions + " " + styles.fadeUp + " " + styles.d4}>
              <ButtonLink href="/work" variant="primary" size="lg">
                Смотреть кейсы
              </ButtonLink>
              <ButtonLink href={site.resumeFile} variant="secondary" size="lg" download>
                Резюме PDF
              </ButtonLink>
            </div>

            <p className={styles.heroPlace + " " + styles.fadeUp + " " + styles.d5}>
              {site.location} · {site.timezone} · {site.availability.detail}
            </p>
          </div>

          <div className={styles.heroShot + " " + styles.fadeUp + " " + styles.d6}>
            <BrowserFrame
              url="ai-rendering.ind.studio"
              caption="AI Rendering для архитекторов — ключевой экран платформы"
            />
          </div>
        </Container>
      </section>

      {/* ---------- Полоса фактов ---------- */}
      <div className={styles.facts}>
        <Container>
          <div className={styles.factsGrid}>
            {facts.map((fact, i) => (
              <Reveal key={fact.value} delay={i * 60}>
                <div className={styles.fact}>
                  <p className={styles.factValue}>{fact.value}</p>
                  <p className={styles.factCaption}>{fact.caption}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </div>

      {/* ---------- Кейсы ---------- */}
      <Section id="cases">
        <Container>
          <Reveal>
            <SectionHead
              kicker="Кейсы"
              title={
                <>
                  Что изменилось в продукте{" "}
                  <span className="dim">после моей работы</span>
                </>
              }
              lead="В заголовке каждого кейса — результат, а не название проекта. Внутри: контекст, решения и то, какие альтернативы я отверг."
              action={<ArrowLink href="/work">Все кейсы</ArrowLink>}
            />
          </Reveal>

          <div className={styles.caseGrid}>
            {featured.map((item, i) => (
              <Reveal key={item.slug} delay={i * 70}>
                <CaseCard item={item} wide={i === 0} index={i} />
              </Reveal>
            ))}
          </div>

          <div className={styles.moreRow}>
            <ButtonLink href="/work" variant="secondary" size="md">
              Ещё три кейса в работе
            </ButtonLink>
          </div>
        </Container>
      </Section>

      {/* ---------- Как я работаю ---------- */}
      <Section tone="sand">
        <Container>
          <Reveal>
            <SectionHead
              kicker="Как я работаю"
              title={
                <>
                  Дизайн заканчивается не в Figma,{" "}
                  <span className="dim">а в проде</span>
                </>
              }
            />
          </Reveal>

          <div className={styles.process}>
            {process.map((step, i) => (
              <Reveal key={step.step} delay={i * 80}>
                <article className={styles.step}>
                  <p className={"mono " + styles.stepNum}>{step.step}</p>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepBody}>{step.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------- Опыт ---------- */}
      <Section>
        <Container>
          <Reveal>
            <SectionHead
              kicker="Опыт"
              title="Где я это делал"
              action={<ArrowLink href="/about">Подробнее обо мне</ArrowLink>}
            />
          </Reveal>

          <div className={styles.expList}>
            {experience.map((item, i) => (
              <Reveal key={item.company} delay={i * 60}>
                <article className={styles.expItem}>
                  <p className={styles.expPeriod}>{item.period}</p>
                  <div>
                    <h3 className={styles.expCompany}>{item.company}</h3>
                    <p className={styles.expRole}>{item.role}</p>
                    <p className={styles.expSummary}>{item.summary}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------- Контакт ---------- */}
      <Section id="contact" tone="paper">
        <Container>
          <Reveal>
            <div className={styles.contact}>
              <Pill tone="live">{site.availability.label}</Pill>
              <h2 className={styles.contactTitle}>
                Расскажите о задаче — <span className="dim">отвечу за день</span>
              </h2>
              <p className={styles.contactLead}>
                Открыт к продуктовым командам, где дизайнер отвечает за сценарий
                целиком, а не только за макеты.
              </p>
              <div className={styles.contactActions}>
                <ButtonLink href={"mailto:" + site.email} variant="primary" size="lg" external>
                  Написать на почту
                </ButtonLink>
                <ButtonLink href={site.telegram} variant="secondary" size="lg" external>
                  Telegram
                </ButtonLink>
              </div>
              <p className={styles.contactMeta}>
                {site.email} · {site.phone}
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
