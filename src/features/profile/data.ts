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
      "Два продукта параллельно: B2B-платформа архитектурных визуализаций на ИИ и B2C-платформа онлайн-образования.",
    highlights: [
      "Спроектировал B2B AI-платформу с нуля: 40+ экранов от концепции до релиза за три месяца",
      "Построил дизайн-систему и UI Kit: time-to-market новых фич сократился на 25%",
      "Объединил разрозненные сервисы в один рабочий поток: время ключевых операций упало на 30–40%",
      "Провёл UX-исследование в EdTech: LTV +20–25%, retention +15%",
      "Авторский надзор на разработке, ежедневная синхронизация с фронтендом и бэкендом",
    ],
  },
  {
    company: "Salini SRL",
    role: "Продуктовый дизайнер · e-commerce",
    period: "Апрель 2022 – ноябрь 2024",
    place: "Москва",
    summary:
      "E-commerce премиального мебельного бренда с высокой долей повторных покупок: каталог, карточка товара, онбординг.",
    highlights: [
      "UX/UI-оптимизация воронки продаж: конверсия ключевых этапов +10–15%",
      "Снижение количества отказов на этапе checkout",
      "Проработка форм, состояний, ошибок и адаптивных сценариев",
      "Адаптивные шаблоны масштабирования контента: скорость подготовки +30%",
    ],
  },
  {
    company: "RAUM",
    role: "Продуктовый дизайнер · B2B digital services",
    period: "Май – август 2024 · контракт",
    place: "Москва",
    summary:
      "Унификация разрозненных digital-решений нескольких команд в единый внутренний продукт.",
    highlights: [
      "Дизайн-система и UI Kit для внутренних и внешних B2B-продуктов",
      "Формализация визуальных и интерфейсных стандартов, гайдлайны для маркетинга",
      "Time-to-market сайта −20%, производство цифровых материалов быстрее на 35%",
    ],
  },
];

const educationRaw = [
  {
    school: "Томский государственный университет",
    degree: "Магистратура · прикладная информатика, продуктовый дизайн",
    period: "2025–2027",
  },
  {
    school: "Московский архитектурный институт (МАРХИ)",
    degree: "Бакалавриат · архитектура",
    period: "2020–2025",
  },
];

const skillGroupsRaw = [
  {
    title: "Методологии",
    items: [
      "Product Design",
      "UX Research",
      "CJM",
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
    title: "Отрасли",
    items: ["AI Products", "B2B SaaS", "B2C", "EdTech", "E-commerce", "Mobile"],
  },
];

/** Как я работаю — три шага для главной. */
const processRaw = [
  {
    step: "01",
    title: "Разбираюсь в сценарии, а не в экранах",
    body: "Исследование, CJM, разговоры с пользователями. На выходе не отчёт, а формулировка проблемы, из которой видно, что делать.",
  },
  {
    step: "02",
    title: "Собираю систему, а не набор макетов",
    body: "Компоненты, токены, состояния и краевые случаи. Архитектурный бэкграунд помогает видеть структуру раньше, чем интерфейс.",
  },
  {
    step: "03",
    title: "Довожу до релиза",
    body: "Спецификация, требования к данным, авторский надзор. Дизайн заканчивается не в Figma, а в проде.",
  },
];

/** Весь текст профиля проходит ту же микротипографику, что и кейсы. */
export const experience = typoDeep(experienceRaw);
export const education = typoDeep(educationRaw);
export const skillGroups = typoDeep(skillGroupsRaw);
export const process = typoDeep(processRaw);
