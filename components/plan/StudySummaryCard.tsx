"use client";

import { memo } from "react";

type StudySummaryCardProps = {
  title?: string;
  totalDays?: number;
  completedDays?: number;
  currentWeek?: string;
  totalHours?: string;
};

const titleFontStyle = {
  fontFamily: '"Georgia", "Times New Roman", serif',
} as const;

function StudySummaryCardComponent({
  title = "Study Summary",
  totalDays = 12,
  completedDays = 4,
  currentWeek = "2주차",
  totalHours = "24시간",
}: StudySummaryCardProps) {
  const progress =
    totalDays > 0 ? Math.min((completedDays / totalDays) * 100, 100) : 0;

  return (
    <section className="w-[300px] rounded-[10px] border border-[#d0d0d0] bg-white px-5 py-4 text-[#2f2c28]">
      <div className="mb-4 flex items-center gap-2">
        <h3
          className="shrink-0 text-[12px] font-semibold text-[#2d2a26]"
          style={titleFontStyle}
        >
          {title}
        </h3>
        <div className="mt-px h-px flex-1 bg-black/20" />
      </div>

      <div className="space-y-2">
        <SummaryRow label="전체 학습일" value={`${totalDays}일`} />
        <SummaryRow label="완료한 학습" value={`${completedDays}일`} />
        <SummaryRow label="현재 진행 주차" value={currentWeek} />
        <SummaryRow label="예상 총 시간" value={totalHours} />
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-[10px] tracking-[0.08em] text-[#6c6257]">
          <span>PROGRESS</span>
          <span>{Math.round(progress)}%</span>
        </div>

        <div className="h-[6px] overflow-hidden rounded-full bg-[#f1ede7]">
          <div
            className="h-full rounded-full bg-[#2f2c28] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  );
}

type SummaryRowProps = {
  label: string;
  value: string;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-[#ebe6df] py-2 last:border-b-0">
      <span className="text-[11px] text-[#6a6259]">{label}</span>
      <span
        className="text-[13px] font-semibold text-[#1f1c19]"
        style={titleFontStyle}
      >
        {value}
      </span>
    </div>
  );
}

const StudySummaryCard = memo(StudySummaryCardComponent);

export default StudySummaryCard;