import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { cases } from "@/features/cases";
import { WorkBrowser } from "./_components/work-browser";
import styles from "./work.module.css";

export const metadata: Metadata = {
  title: "Кейсы",
  description:
    "Продуктовые кейсы: AI SaaS, EdTech и e-commerce. В заголовке каждого — результат, а не название проекта.",
};

export default function WorkPage() {
  return (
    <Section>
      <Container>
        <Reveal>
          <header className={styles.head}>
            <p className="label">Кейсы</p>
            <h1 className={styles.title}>
              Шесть проектов, <span className="dim">три разобраны подробно</span>
            </h1>
            <p className={styles.lead}>
              Каждый кейс отвечает на три вопроса: какая была проблема, что я решил
              и что из этого проверено на людях. Остальные разбираю — карточки
              помечены.
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
