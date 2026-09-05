import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { cases, getPublishedCases } from "@/features/cases";
import { WorkBrowser } from "./_components/work-browser";
import styles from "./work.module.css";
import { typo } from "@/lib/typo";

export const metadata: Metadata = {
  title: "Кейсы",
  description:
    "Продуктовые кейсы: AI SaaS, EdTech и e-commerce. В заголовке каждого стоит результат, а не название проекта.",
};

export default function WorkPage() {
  const published = getPublishedCases().length;

  return (
    <Section>
      <Container>
        <Reveal>
          <header className={styles.head}>
            <p className="label">Кейсы</p>
            <h1 className={styles.title}>
              {typo(cases.length + " проектов, ")}
              <span className="dim">{typo(published + " разобраны подробно")}</span>
            </h1>
            <p className={styles.lead}>
              {typo(
                "Каждый кейс отвечает на три вопроса: какая была проблема, что я решил и что из этого проверено на людях. Остальные ещё разбираю, их карточки помечены.",
              )}
            </p>
          </header>
        </Reveal>

        <Reveal delay={80}>
          <WorkBrowser items={cases} />
        </Reveal>
      </Container>
    </Section>
  );
}
