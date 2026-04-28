export const EDUCATION_OPTIONS = [
  "고졸",
  "2년제 재학",
  "2년제 졸업",
  "3년제 재학",
  "3년제 졸업",
  "4년제 재학",
  "4년제 졸업",
] as const;

export const EDUCATION_SELECT_OPTIONS = EDUCATION_OPTIONS.map((option) => ({
  value: option,
  label: option,
}));

export const GRADE_OPTIONS = [
  { value: 0, label: "해당 없음" },
  { value: 1, label: "1학년" },
  { value: 2, label: "2학년" },
  { value: 3, label: "3학년" },
  { value: 4, label: "4학년" },
] as const;

export const TARGET_OPTIONS = ["사기업", "공기업", "스타트업"] as const;

export const SKILL_LEVELS = [
  { value: "하", desc: "처음 준비" },
  { value: "중", desc: "기본 개념 보유" },
  { value: "상", desc: "실전 경험 있음" },
] as const;

export const inputClass =
  "h-[46px] w-full rounded-[10px] border border-[#E8EDF5] bg-white px-4 text-[14px] text-[#0B1B3B] outline-none transition placeholder:text-[#C5CFDA] focus:border-[#0FA9CC]";

export const selectClass = `${inputClass} appearance-none pr-11`;

export const labelClass =
  "mb-2.5 text-[15px] font-semibold tracking-[-0.02em] text-[#0B1B3B]";
