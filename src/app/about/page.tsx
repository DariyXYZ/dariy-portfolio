import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section, SectionHead } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { experience, education, skillGroups } from "@/features/profile";
import { site } from "@/config/site";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "Обо мне",
  description:
    "Продуктовый дизайнер с архитектурным бэкграундом. Полный цикл: исследование, сценарий, дизайн-система, авторский надзор.",
};

export default function AboutPage() {
  return (
    <>
      <section className={styles.hero}>
        <Container>
          <Reveal>
            <p className="label">Обо мне</p>
            <h1 className={styles.title}>
              Вижу сценарий как структуру, <span className="dim">а не набор экранов</span>
            </h1>
            <p className={styles.lead}>
              Продуктовый дизайнер с четырьмя годами коммерческого опыта в AI SaaS,
              EdTech и e-commerce. Архитектурный бэкграунд МАРХИ даёт системное
              мышление: сначала понимаю, как устроено целое, потом рисую части.
            </p>
            <div className={styles.actions}>
              <ButtonLink href={site.resumeFile} variant="primary" size="lg" download>
                Скачать резюме PDF
              </ButtonLink>
              <ButtonLink href={"mailto:" + site.email} variant="secondary" size="lg" external>
                Написать
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ---------- Портрет-заглушка ---------- */}
      <Container>
        <Reveal>
          <div className={styles.portrait} aria-hidden="true">
            <span>Фото или рабочий кадр</span>
          </div>
        </Reveal>
      </Container>

      {/* ---------- Опыт ---------- */}
      <Section>
        <Container>
          <Reveal>
            <SectionHead kicker="Опыт" title="Где и что я делал" />
          </Reveal>

          <div className={styles.list}>
            {experience.map((item, i) => (
              <Reveal key={item.company} delay={i * 60}>
                <article className={styles.item}>
                  <div className={styles.itemAside}>
                    <p className={styles.period}>{item.period}</p>
                    <p className={styles.place}>{item.place}</p>
                  </div>
                  <div>
                    <h3 className={styles.company}>{item.company}</h3>
                    <p className={styles.role}>{item.role}</p>
                    <p className={styles.summary}>{item.summary}</p>
                    <ul className={styles.highlights}>
                      {item.highlights.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------- Навыки ---------- */}
      <Section tone="sand">
        <Container>
          <Reveal>
            <SectionHead kicker="Инструменты" title="Чем работаю" />
          </Reveal>

          <div className={styles.skills}>
            {skillGroups.map((group, i) => (
              <Reveal key={group.title} delay={i * 70}>
                <div className={styles.skillGroup}>
                  <h3 className={styles.skillTitle}>{group.title}</h3>
                  <div className={styles.chips}>
                    {group.items.map((skill) => (
                      <Pill key={skill}>{skill}</Pill>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------- Образование ---------- */}
      <Section>
        <Container>
          <Reveal>
            <SectionHead kicker="Образование" title="Учусь и учился" />
          </Reveal>

          <div className={styles.list}>
            {education.map((item, i) => (
              <Reveal key={item.school} delay={i * 60}>
                <article className={styles.item}>
                  <div className={styles.itemAside}>
                    <p className={styles.period}>{item.period}</p>
                  </div>
                  <div>
                    <h3 className={styles.company}>{item.school}</h3>
                    <p className={styles.role}>{item.degree}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className={styles.langs}>
              <p className="label">Языки</p>
              <p className={styles.langsText}>
                Русский — родной · Английский — B2, Upper-Intermediate
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
