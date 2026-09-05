export type CaseIndustry = "ai-saas" | "edtech" | "ecommerce" | "b2b";

export type CaseMetric = {
  value: string;
  label: string;
};

/* ---------- визуалы внутри кейса ---------- */

/** Подпись фреймворка над схемой: что за инструмент и что он показывает. */
export type FrameworkTag = {
  name: string;
  what: string;
  /** Что это на самом деле: фреймворк, метод, схема, документ. По умолчанию фреймворк. */
  label?: string;
};

export type JourneyStage = {
  stage: string;
  /** Положение точки на кривой: 0 — хорошо, 100 — плохо. */
  mood: number;
  emotion: string;
  barrier: string;
  /** Помечаем шаги, где человек чаще всего уходил. */
  drop?: boolean;
};

export type PlotDot = {
  label: string;
  /** Проценты от левого нижнего угла поля. */
  x: number;
  y: number;
  hot?: boolean;
};

/* ---------- схема с узлами и связями ---------- */

export type DiagramTone =
  | "outline"
  | "dashed"
  | "solid"
  | "muted"
  | "accent"
  /** Текст без рамки — подписи рядов и групп. */
  | "label";

export type DiagramShape = "box" | "pill" | "diamond";

export type DiagramNode = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Текст узла построчно, чтобы он никогда не вылезал за рамку. */
  lines: string[];
  note?: string;
  tone?: DiagramTone;
  shape?: DiagramShape;
  /** Номер в кружке слева, как в списках вариантов. */
  index?: number;
};

export type DiagramEdge = {
  from: string;
  to: string;
  fromSide?: "right" | "bottom" | "left" | "top";
  toSide?: "right" | "bottom" | "left" | "top";
  tone?: "default" | "muted";
  label?: string;
  dashed?: boolean;
  /** Кружок с галочкой или крестом на линии. */
  badge?: "yes" | "no";
  /** Доля пути до поворота: 0.5 ставит его посередине. */
  bend?: number;
};

type VisualBase = {
  framework?: FrameworkTag;
  caption?: string;
};

export type CaseVisual = VisualBase &
  (
    | { kind: "shot"; src: string; alt: string; url?: string }
    | {
        /** Кадр из презентации кейса: шире текстовой колонки, во всю ширину контейнера. */
        kind: "band";
        src: string;
        alt: string;
        /** Тёмные кадры показываем без рамки, она на них лишняя. */
        dark?: boolean;
      }
    | {
        /** Ряд мобильных экранов: показываем сценарий, а не один кадр. */
        kind: "screens";
        items: { src: string; alt: string; label: string; note?: string }[];
        /** sm для плотных рядов, md для мобильных, wide для десктопных экранов. */
        size?: "sm" | "md" | "wide";
      }
    | {
        /** Было и стало по одному экрану. */
        kind: "compare";
        pairs: { before: string; after: string; label: string; note: string }[];
      }
    | {
        /** Большой артефакт исследования: показываем целиком и мелко, детали по клику. */
        kind: "artifact";
        src: string;
        alt: string;
        title: string;
        scale?: "wide" | "tall";
      }
    | { kind: "journey"; stages: JourneyStage[] }
    | {
        kind: "plot";
        xLabel: string;
        yLabel: string;
        quadrants: [string, string, string, string];
        /** Какой угол подсветить: там лежит то, что берём в работу. */
        highlight?: "tl" | "tr" | "bl" | "br";
        dots: PlotDot[];
      }
    | { kind: "principles"; items: { title: string; body: string }[] }
    | {
        /** Таблица сравнения: конкуренты, состояния, требования. */
        kind: "table";
        columns: string[];
        rows: { cells: string[]; accent?: boolean }[];
        /** Первая колонка шире остальных: в ней обычно название строки. */
        wideFirst?: boolean;
      }
    | {
        /** Реплики из тестов и вывод, который из них следует. */
        kind: "quotes";
        items: { quote: string; who: string; insight: string; action?: string }[];
      }
    | {
        /** Истории пользователя с критериями приёмки. */
        kind: "stories";
        items: { id?: string; story: string; criteria: string[]; note?: string }[];
      }
    | {
        /** Структурированный документ: группы с заголовком и списком. */
        kind: "plan";
        groups: { title: string; items: string[] }[];
        columns?: 2 | 3 | 4;
      }
    | {
        /** Крупные числа с подписями. */
        kind: "stat";
        items: { value: string; label: string; note?: string }[];
      }
    | {
        /** Расшифровки сессий: участник, разделы, реплики. */
        kind: "transcript";
        sessions: {
          who: string;
          tag: string;
          sections: { title: string; lines: string[] }[];
        }[];
      }
    | {
        kind: "metrics";
        rows: { stage: string; value: string; target: string; note?: string }[];
      }
    | { kind: "decisions"; rows: { took: string; rejected: string; cost: string }[] }
    | {
        kind: "diagram";
        width: number;
        height: number;
        nodes: DiagramNode[];
        edges: DiagramEdge[];
        legend?: { tone: DiagramTone; label: string }[];
      }
  );

export type CaseBlock = {
  /** Порядковый номер раздела в кейсе. */
  kicker: string;
  title: string;
  body: string;
  visual?: CaseVisual;
  /** Несколько визуалов подряд, когда одного кадра не хватает. */
  visuals?: CaseVisual[];
  /** Помечаем разделы, которые входят в короткий режим чтения. */
  short?: boolean;
};

export type CaseStudy = {
  slug: string;
  /** Название проекта. */
  title: string;
  /** Заголовок карточки: результат, а не имя проекта. */
  outcome: string;
  client: string;
  type: string;
  industry: CaseIndustry;
  industryLabel: string;
  year: string;
  role: string;
  timeline: string;
  team: string;
  summary: string;
  /** Ради чего это делалось с точки зрения денег. */
  businessGoal?: {
    goal: string;
    money: string;
    lever: string;
  };
  /** Ссылка на живой продукт, если он публично доступен. */
  liveUrl?: string;
  /** Обложка для карточки и шапки кейса. */
  cover?: { src: string; alt: string };
  metrics: CaseMetric[];
  tags: string[];
  /** Черновики показываются с пометкой и без ссылки внутрь. */
  status: "published" | "draft";
  featured: boolean;
  blocks: CaseBlock[];
};
