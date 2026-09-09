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
    "Продуктовые кейсы в AI SaaS, EdTech и e-commerce: задачи, исследования, решения и результаты.",
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
                "Каждый кейс показывает проблему, мою роль, принятые решения и то, что удалось проверить.",
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
