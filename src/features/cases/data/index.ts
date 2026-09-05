import type { CaseStudy } from "../types";
import { typoDeep } from "@/lib/typo";
import { businessModelLab } from "./business-model-lab";
import { aiArchitectureRendering } from "./ai-architecture-rendering";
import { bnplCheckout } from "./bnpl-checkout";
import { compDesignBot } from "./comp-design-bot";
import { stempsCareer } from "./stemps-career";
import { drafts } from "./drafts";

/**
 * Порядок в этом массиве и есть порядок кейсов на сайте.
 * Весь текст прогоняется через микротипографику: короткие слова
 * не должны висеть в конце строки.
 */
export const cases: CaseStudy[] = typoDeep<CaseStudy[]>([
  ...businessModelLab,
  ...aiArchitectureRendering,
  ...compDesignBot,
  ...bnplCheckout,
  ...stempsCareer,
  ...drafts,
]);

export const industries = [
  { id: "all", label: "Все" },
  { id: "ai-saas", label: "AI SaaS" },
  { id: "edtech", label: "EdTech" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "b2b", label: "B2B" },
] as const;

export function getCase(slug: string): CaseStudy | undefined {
  return cases.find((item) => item.slug === slug);
}

export function getPublishedCases(): CaseStudy[] {
  return cases.filter((item) => item.status === "published");
}

export function getFeaturedCases(): CaseStudy[] {
  return cases.filter((item) => item.featured);
}
