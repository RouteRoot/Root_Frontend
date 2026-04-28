export const LEVEL_MAP: Record<string, string> = {
  하: "하",
  중: "중",
  상: "상",
  BEGINNER: "하",
  INTERMEDIATE: "중",
  ADVANCED: "상",
};

export const DAYS = [
  { key: "MON", label: "월" },
  { key: "TUE", label: "화" },
  { key: "WED", label: "수" },
  { key: "THU", label: "목" },
  { key: "FRI", label: "금" },
  { key: "SAT", label: "토" },
  { key: "SUN", label: "일" },
] as const;

export type DayKey = (typeof DAYS)[number]["key"];

export const SKILL_LEVELS = [
  { value: "하", desc: "처음 접하는 분야" },
  { value: "중", desc: "기본 개념 파악" },
  { value: "상", desc: "어느 정도 학습함" },
] as const;

export function getDday(dateStr: string): string {
  if (!dateStr) return "";

  const [y, m, d] = dateStr.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const today = new Date();
  const base = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = Math.ceil((target.getTime() - base.getTime()) / 86400000);

  if (diff > 0) return `D-${diff} · 오늘부터 ${diff}일 남음`;
  if (diff === 0) return "D-Day · 오늘이 시험일이에요";
  return `D+${Math.abs(diff)} · 시험일이 지났어요`;
}
