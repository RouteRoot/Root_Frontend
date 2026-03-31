"use client";

import { memo } from "react";

type TodayPlannerCardProps = {
  day?: string;
  month?: string;
  monthNumber?: string;
  weekday?: string;
  sectionTitle?: string;
  weekLabel?: string;
  dayLabel?: string;
  subject?: string;
  description?: string;
  hours?: string;
  status?: "in-progress" | "done";
  onToggleStatus?: () => void;
};

const titleFontStyle = {
  fontFamily: '"Georgia", "Times New Roman", serif',
} as const;

const numberFontStyle = {
  fontFamily:
    '"Arial Narrow", "HelveticaNeue-CondensedBold", "Helvetica Neue", "Impact", sans-serif',
  transform: "scaleY(1.3)",
  transformOrigin: "center",
} as const;

function TodayFocusCardComponent({
  day = "31",
  month = "MARCH",
  monthNumber = "03",
  weekday = "TUESDAY",
  sectionTitle = "Today's Focus",
  weekLabel = "1주차",
  dayLabel = "1DAY",
  subject = "소프트웨어 공학",
  description = "소프트웨어 공학의 개념과 개발 프로세스를 이해하고, 핵심 용어와 흐름을 정리합니다.",
  hours = "2시간",
  status = "in-progress",
  onToggleStatus,
}: TodayPlannerCardProps) {
  const isDone = status === "done";

  return (
    <section className="relative w-[300px] overflow-hidden rounded-[10px] border border-[#d0d0d0] bg-white px-5 py-4 text-[#2f2c28]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(#000000_0.35px,transparent_0.35px)] [background-size:10px_10px]" />

      <div className="relative mb-4 flex items-start justify-between">
        <div
          className={`mb-3 inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold tracking-[0.08em] transition ${
            isDone
              ? "border-black bg-black text-white"
              : "border-[#d8d0c5] bg-[#f6f1e9] text-[#6c6257]"
          }`}
        >
          {isDone ? "완료" : "진행중"}
        </div>
      </div>

      <div className="relative">
        <div className="relative flex items-end justify-center gap-8 px-2">
          <div className="pointer-events-none absolute left-0 right-0 top-[35%] z-10 h-px bg-white" />
          <MemoizedNumberBlock number={monthNumber} label={month} />
          <MemoizedNumberBlock number={day} label={weekday} />
        </div>
      </div>

      <div className="relative mt-6 flex items-center gap-2">
        <h3
          className="shrink-0 text-[12px] font-semibold text-[#2d2a26]"
          style={titleFontStyle}
        >
          {sectionTitle}
        </h3>
        <div className="mt-px h-px flex-1 bg-black/20" />
      </div>

      <div className="relative mt-4">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#7a746d]">
          <span>{weekLabel}</span>
          <span>•</span>
          <span>{dayLabel}</span>
        </div>

        <h4
          className="mt-2 text-[18px] font-semibold leading-[1.2] text-[#1f1c19]"
          style={titleFontStyle}
        >
          {subject}
        </h4>

        <p className="mt-3 text-[11px] leading-[1.75] text-[#4f4a43]">
          {description}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="inline-flex items-center rounded-full border border-black/20 bg-white px-3 py-1 text-[10px] font-medium tracking-[0.08em] text-[#5e5851]">
            {hours}
          </div>

          <button
            type="button"
            onClick={onToggleStatus}
            className={`inline-flex items-center rounded-md border px-3 py-1 text-[10px] font-bold tracking-[0.08em] transition ${
              isDone
                ? "border-black bg-black text-white"
                : "border-black/20 bg-white text-[#3f3a34] hover:bg-black hover:text-white"
            }`}
          >
            {isDone ? "완료됨" : "완료 체크"}
          </button>
        </div>
      </div>
    </section>
  );
}

type NumberBlockProps = {
  number: string;
  label: string;
};

function NumberBlock({ number, label }: NumberBlockProps) {
  return (
    <div className="relative flex flex-col items-center">
      <div
        className="relative text-[60px] font-black leading-[0.8] tracking-[-0.08em] text-[#23211e]"
        style={numberFontStyle}
      >
        <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[rgba(255,255,255,0.12)] to-transparent mix-blend-screen" />
        {number}
      </div>

      <div className="mt-4 text-[9px] font-semibold tracking-[0.22em] text-[#3f3a34]">
        {label}
      </div>
    </div>
  );
}

const MemoizedNumberBlock = memo(NumberBlock);
const TodayFocusCard = memo(TodayFocusCardComponent);

export default TodayFocusCard;