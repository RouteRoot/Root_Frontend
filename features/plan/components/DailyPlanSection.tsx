"use client";

export type DailyPlanSectionItem = {
  id: number;
  day: number;
  week: number;
  title: string;
  description: string;
  date: string;
  hours: number;
  examDate: string;
  isCompleted: boolean;
};

type DailyPlanSectionProps = {
  plan: DailyPlanSectionItem | null;
  onToggleComplete?: (dailyPlanId: number) => void;
};

function getDday(examDate: string) {
  const [y, m, d] = examDate.split(".").map(Number);
  const target = new Date(y, m - 1, d);

  const today = new Date();
  const base = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const diff = Math.ceil((target.getTime() - base.getTime()) / 86400000);

  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return "D-Day";
  return `D+${Math.abs(diff)}`;
}

export default function DailyPlanSection({
  plan,
  onToggleComplete,
}: DailyPlanSectionProps) {
  if (!plan) {
    return <p>No daily plan</p>;
  }

  const dday = getDday(plan.examDate);

  return (
    <>
      <button type="button" onClick={() => onToggleComplete?.(plan.id)}>
        Toggle complete
      </button>
      <pre>{JSON.stringify({ plan, dday }, null, 2)}</pre>
    </>
  );
}
