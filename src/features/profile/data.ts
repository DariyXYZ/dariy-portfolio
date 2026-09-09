import { typoDeep } from "@/lib/typo";

export type ExperienceItem = {
  company: string;
  companyUrl?: string;
  role: string;
  period: string;
  place: string;
  summary: string;
  highlights: string[];
};

const experienceRaw: ExperienceItem[] = [
  {
    company: "IND",
    companyUrl: "https://ind.studio",
    role: "Продуктовый дизайнер · AI Solutions и EdTech",
    period: "Сентябрь 2024 – сейчас",
    place: "Москва",
    summary:
      "Два продукта параллельно: B2B-платформа ИИ-визуализаций и B2C-платформа онлайн-образования.",
    highlights: [
      "AI-платформа с нуля: 40 экранов от концепции до релиза за три месяца",
      "Дизайн-система и UI Kit: Time to Market новых функций −25%",
      "Сервисы собраны в один поток: ключевые операции быстрее на 30–40%",
      "UX-исследование в EdTech: LTV +20–25%, Retention +15%",
      "Design QA: проверка реализации до релиза",
    ],
  },
  {
    company: "Salini SRL",
    role: "Продуктовый дизайнер · e-commerce",
    period: "Апрель 2022 – ноябрь 2024",
    place: "Москва",
    summary:
      "E-commerce премиального мебельного бренда: каталог, карточка товара, онбординг, checkout.",
    highlights: [
      "Воронка продаж: конверсия ключевых этапов +10–15%",
      "Меньше отказов на checkout: формы, состояния, ошибки",
      "Шаблоны масштабирования контента: подготовка быстрее на 30%",
    ],
  },
  {
    company: "RAUM",
    role: "Продуктовый дизайнер · B2B digital services",
    period: "Май – август 2024 · контракт",
    place: "Москва",
    summary:
      "Решения нескольких команд сведены в один внутренний продукт со своими стандартами.",
    highlights: [
      "Дизайн-система и UI Kit для B2B-продуктов бюро",
      "Гайдлайны для маркетинга: единый визуальный стандарт",
      "Time to Market сайта −20%, материалы быстрее на 35%",
    ],
  },
];

const educationRaw = [
  {
    school: "НИ ТГУ + Яндекс Практикум",
    degree: "Магистр · прикладная информатика, продуктовый дизайн",
    period: "2025–2027",
  },
  {
    school: "Московский архитектурный институт (МАРХИ)",
    degree: "Бакалавр · архитектура",
    period: "2020–2025",
  },
];

const skillGroupsRaw = [
  {
    title: "Методы и практики",
    items: [
      "Product Design",
      "UX Research",
      "Jobs to Be Done (JTBD)",
      "User Stories",
      "Job Stories",
      "Customer Journey Mapping",
      "Information Architecture",
      "User Flow",
      "Wireframing",
      "Prototyping",
      "Usability Testing",
      "Design Systems",
      "Developer Handoff",
    ],
  },
  {
    title: "Инструменты",
    items: ["Figma", "FigJam", "Maze", "Miro", "Notion", "Jira"],
  },
  {
    title: "Продукты и рынки",
    items: ["AI Products", "B2B SaaS", "B2C", "EdTech", "E-commerce", "Mobile"],
  },
];

/** Первое, что читает рекрутер: ответы на типовые вопросы одной строкой. */
const quickFactsRaw = [
  { term: "Роль", value: "Продуктовый дизайнер, senior-уровень задач" },
  { term: "Опыт", value: "4 года в продукте, из них 2 года в B2B и AI" },
  { term: "Продукты и рынки", value: "AI SaaS, EdTech, e-commerce, внутренние B2B-продукты" },
  { term: "Сильные стороны", value: "UX Research, Information Architecture, Design Systems, Design QA" },
  { term: "Формат", value: "Москва или удалённо, full-time или контракт" },
  { term: "Английский", value: "B2, работаю с англоязычной документацией" },
];

/** Как я работаю — три шага для главной. */
const processRaw = [
  {
    step: "01",
    title: "Определяю проблему и критерии успеха",
    body: "UX Research и JTBD помогают сформулировать Problem Statement. Связываю потребности пользователей с бизнес-целью и критериями проверки.",
  },
  {
    step: "02",
    title: "Проектирую сценарии и интерфейс",
    body: "User Stories, Information Architecture и User Flow задают логику продукта. Затем собираю прототип, компоненты и состояния интерфейса.",
  },
  {
    step: "03",
    title: "Довожу до релиза",
    body: "Developer Handoff и Design QA: описываю требования и состояния, проверяю реализацию вместе с разработкой.",
  },
];

/** Весь текст профиля проходит ту же микротипографику, что и кейсы. */
export const experience = typoDeep(experienceRaw);
export const quickFacts = typoDeep(quickFactsRaw);
export const education = typoDeep(educationRaw);
export const skillGroups = typoDeep(skillGroupsRaw);
export const process = typoDeep(processRaw);
