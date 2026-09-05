const NBSP = " ";

/** Трёхбуквенные предлоги и союзы, которые тоже нельзя оставлять в конце строки. */
const SHORT_WORDS = new Set([
  "для",
  "при",
  "над",
  "под",
  "без",
  "про",
  "как",
  "что",
  "чем",
  "или",
  "изо",
  "обо",
  "ото",
  "уже",
  "его",
  "её",
  "их",
]);

/** Слово короткое, если в нём одна-две буквы или оно из списка выше. */
function isShort(word: string): boolean {
  const clean = word.replace(/^[(«„"']+/, "");
  if (!/^[а-яёa-z]+$/i.test(clean)) return false;
  return clean.length <= 2 || SHORT_WORDS.has(clean.toLowerCase());
}

/**
 * Русская микротипографика: короткие слова цепляем к следующему,
 * числа и знаки валют не разрываем.
 */
export function typo(text: string): string {
  // Разбираем на слова и разделители, чтобы лечились и цепочки вроде «и в доме».
  const parts = text.split(/(\s+)/);

  for (let i = 0; i < parts.length - 2; i += 2) {
    if (parts[i + 1] !== " ") continue;
    const word = parts[i];
    const next = parts[i + 2];

    const bindShort = isShort(word);
    // 58 060 ₽ и «6 мес» остаются одним куском
    const bindNumber =
      /\d$/.test(word) && (/^[\d₽%$€]/.test(next) || /^[а-яёa-z]{1,4}[.,)]?$/i.test(next));

    if (bindShort || bindNumber) parts[i + 1] = NBSP;
  }

  return parts.join("");
}

/** Ключи, где лежат пути и служебные значения: их трогать нельзя. */
const RAW_KEYS = new Set([
  "src",
  "slug",
  "kind",
  "tone",
  "shape",
  "size",
  "industry",
  "status",
  "from",
  "to",
  "fromSide",
  "toSide",
  "badge",
  "url",
  "liveUrl",
  "id",
  "href",
  "companyUrl",
  "email",
  "telegram",
  "instagram",
  "resumeFile",
]);

/** Прогоняем через типографику всё дерево данных разом. */
export function typoDeep<T>(value: T, key?: string): T {
  if (typeof value === "string") {
    return (key && RAW_KEYS.has(key) ? value : typo(value)) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => typoDeep(item, key)) as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = typoDeep(v, k);
    }
    return out as T;
  }
  return value;
}
