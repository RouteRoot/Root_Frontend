const ENTITY_MAP: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeHtmlEntities(text: string) {
  return text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (_, entity: string) => {
    const key = entity.toLowerCase();
    if (key[0] === "#") {
      const codePoint =
        key[1] === "x"
          ? Number.parseInt(key.slice(2), 16)
          : Number.parseInt(key.slice(1), 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : "";
    }

    return ENTITY_MAP[key] ?? "";
  });
}

export function getCertificateDescriptionText(description: string | null) {
  if (!description) return "";

  return decodeHtmlEntities(
    description
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|h[1-6]|blockquote)>/gi, "\n")
      .replace(/<[^>]*>/g, " ")
  )
    .replace(/\r\n?/g, "\n")
    .replace(/[\t\f\v \u00a0]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function hasMeaningfulCertificateDescription(
  description: string | null
) {
  const normalized = getCertificateDescriptionText(description)
    .replace(/[.。·ㆍ-]/g, "")
    .replace(/\s+/g, "");

  if (!normalized) return false;

  const placeholders = [
    "설명",
    "설명없음",
    "정보없음",
    "자격증설명",
    "시험설명",
    "미등록",
    "없음",
    "null",
    "NULL",
  ];

  if (placeholders.includes(normalized)) return false;
  return normalized.length >= 100;
}
