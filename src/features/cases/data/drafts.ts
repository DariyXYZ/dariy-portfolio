import type { CaseStudy } from "../types";

/** Кейсы в работе: показываем карточку, но не пускаем внутрь. */
export const drafts: CaseStudy[] = [
  {
    slug: "edtech-learning-paths",
    title: "Карьерные траектории в EdTech",
    outcome: "Разрозненные курсы стали связными карьерными траекториями",
    client: "IND",
    type: "B2C · EdTech",
    industry: "edtech",
    industryLabel: "EdTech",
    year: "2025",
    role: "Продуктовый дизайнер",
    timeline: "В работе",
    team: "Продукт, контент, разработка",
    summary:
      "Заглушка. Исследование барьеров в онбординге, переработка архитектуры контента, персональные образовательные пути внутри существующей дизайн-системы.",
    cover: {
      src: "/cases/edtech-learning-paths/cover.webp",
      alt: "Карьерные траектории в EdTech: обложка кейса в работе",
    },
    metrics: [
      { value: "+20–25%", label: "LTV пользователей" },
      { value: "+15%", label: "retention" },
      { value: "В работе", label: "точки оттока в онбординге" },
    ],
    tags: ["UX-исследование", "Архитектура контента", "Персонализация"],
    status: "draft",
    featured: false,
    blocks: [],
  },
  {
    slug: "salini-checkout",
    title: "Премиальная мебель: воронка покупки",
    outcome: "Конверсия ключевых этапов выросла на 10–15%",
    client: "Salini SRL",
    type: "E-commerce · оптимизация",
    industry: "ecommerce",
    industryLabel: "E-commerce",
    year: "2022–2024",
    role: "Продуктовый дизайнер",
    timeline: "Апрель 2022 – ноябрь 2024",
    team: "Продукт, маркетинг, разработка",
    summary:
      "Заглушка. Каталог, карточка товара, онбординг и checkout премиального мебельного бренда с высокой долей повторных покупок.",
    cover: {
      src: "/cases/salini-checkout/cover.webp",
      alt: "Воронка покупки премиальной мебели: обложка кейса в работе",
    },
    metrics: [
      { value: "+10–15%", label: "конверсия ключевых этапов" },
      { value: "+30%", label: "скорость подготовки контента" },
      { value: "25+", label: "экранов и адаптивных состояний" },
    ],
    tags: ["Воронка продаж", "Адаптивные шаблоны", "Состояния и ошибки"],
    status: "draft",
    featured: false,
    blocks: [],
  },
  {
    slug: "raum-design-system",
    title: "RAUM: единый внутренний продукт",
    outcome: "Разрозненные digital-решения команд собраны в одну систему",
    client: "RAUM",
    type: "B2B · дизайн-система",
    industry: "b2b",
    industryLabel: "B2B",
    year: "2024",
    role: "Продуктовый дизайнер, контракт",
    timeline: "Май – август 2024",
    team: "Несколько продуктовых команд",
    summary:
      "Заглушка. Дизайн-система и UI Kit для внутренних и внешних B2B-продуктов, формализация визуальных стандартов, гайдлайны для маркетинга.",
    cover: {
      src: "/cases/raum-design-system/cover.webp",
      alt: "Единая дизайн-система RAUM: обложка кейса в работе",
    },
    metrics: [
      { value: "−20%", label: "time-to-market сайта" },
      { value: "+35%", label: "скорость производства материалов" },
      { value: "1 система", label: "вместо решений нескольких команд" },
    ],
    tags: ["Дизайн-система", "UI Kit", "Гайдлайны"],
    status: "draft",
    featured: false,
    blocks: [],
  },
];
