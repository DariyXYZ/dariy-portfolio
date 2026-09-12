/** Сайт живёт в подпапке GitHub Pages, поэтому все прямые ссылки на файлы идут через префикс. */
export const basePath = "/dariy-portfolio";

/**
 * next/image с unoptimized не подставляет basePath сам,
 * поэтому все пути к файлам из public прогоняем через эту функцию.
 */
export function asset(path: string): string {
  return path.startsWith("/") ? basePath + path : path;
}

export const site = {
  name: "Дарий Назаров",
  role: "Продуктовый дизайнер",
  url: "https://dariyxyz.github.io/dariy-portfolio",
  /** Одна строка позиционирования — то, что рекрутер читает первым. */
  positioning:
    "Помогаю пользователям принимать сложные решения: исследую задачу, проектирую сценарий и довожу интерфейс до запуска.",
  location: "Москва · удалённо",
  timezone: "UTC+3",
  availability: {
    open: true,
    label: "Открыт к предложениям",
    detail: "Продуктовый дизайн, full-time или контракт",
  },
  email: "dariy.nazarov@gmail.com",
  phone: "+7 985 884-37-27",
  telegram: "https://t.me/dariy_nazarov",
  instagram: "https://www.instagram.com/dariy_nazarov/",
  resumeFile: basePath + "/dariy-nazarov-cv.pdf",
  logoFile: basePath + "/logo.svg",
} as const;

/** Цифры для полосы фактов под первым экраном. */
export const facts = [
  { value: "4 года", caption: "в продуктовом дизайне" },
  { value: "3 отрасли", caption: "AI SaaS · EdTech · e-commerce" },
  { value: "4 компании", caption: "IND · Salini · RAUM · ПИК" },
  { value: "8 кейсов", caption: "от исследований до интерфейсов" },
] as const;
