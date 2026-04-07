"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, ChevronDown } from "lucide-react";

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

function DailyPlanSectionSkeleton() {
  return (
    <section className="w-full">
      <div className="mb-4 flex items-center gap-4">
        <h2 className="shrink-0 text-[28px] font-extrabold tracking-[-0.04em] text-[#0B1B3B]">
          DAILY PLAN
        </h2>
        <div className="h-px w-[160px] bg-[#f3f3f3]" />
      </div>

      <div className="w-full max-w-[450px] overflow-hidden rounded-[18px] border border-[#E8EDF5] bg-white">
        <div className="border-b border-[#EEF2F7] bg-[#FBFCFE] px-4 py-4">
          <div className="h-3 w-[120px] animate-pulse rounded bg-[#E9EDF3]" />
          <div className="mt-2 h-4 w-[180px] animate-pulse rounded bg-[#E9EDF3]" />
        </div>

        <div className="px-4 py-4">
          <div className="grid grid-cols-[110px_1fr] gap-4">
            <div className="flex flex-col gap-3 text-[12px]">
              <div className="rounded-[10px] border border-[#EEF2F7] bg-[#FBFCFE] px-3 py-3">
                <div className="h-3 w-[32px] animate-pulse rounded bg-[#E9EDF3]" />
                <div className="mt-2 h-4 w-[68px] animate-pulse rounded bg-[#E9EDF3]" />
              </div>

              <div className="rounded-[10px] border border-[#EEF2F7] bg-[#FBFCFE] px-3 py-3">
                <div className="h-3 w-[48px] animate-pulse rounded bg-[#E9EDF3]" />
                <div className="mt-2 h-4 w-[56px] animate-pulse rounded bg-[#E9EDF3]" />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 animate-pulse rounded-full bg-[#E9EDF3]" />
                <div className="h-4 w-[150px] animate-pulse rounded bg-[#E9EDF3]" />
              </div>

              <div className="mt-2 space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-[#E9EDF3]" />
                <div className="h-3 w-[92%] animate-pulse rounded bg-[#E9EDF3]" />
                <div className="h-3 w-[76%] animate-pulse rounded bg-[#E9EDF3]" />
              </div>

              <div className="mt-4 flex">
                <div className="ml-auto h-[32px] w-[72px] animate-pulse rounded-[10px] bg-[#E9EDF3]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DailyPlanSection({
  plan,
  onToggleComplete,
}: DailyPlanSectionProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current) return;

      if (!dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRegeneratePlan = () => {
    setIsMenuOpen(false);
    console.log("플랜 재생성하기 클릭");
  };

  const handleDeletePlan = () => {
    setIsMenuOpen(false);
    console.log("플랜 삭제하기 클릭");
  };

  if (!plan) {
    return <DailyPlanSectionSkeleton />;
  }

  const dday = getDday(plan.examDate);

  return (
    <section className="w-full">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <h2 className="shrink-0 text-[28px] font-extrabold tracking-[-0.04em] text-[#0B1B3B]">
            DAILY PLAN
          </h2>
          <div className="h-px w-[160px] bg-[#f3f3f3]" />
        </div>

        <div ref={dropdownRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="
              inline-flex h-10 min-w-[118px] items-center justify-center gap-2
              rounded-full bg-white px-4
              text-[13px] font-semibold text-[#111827]
              transition-all duration-200
              hover:border-[#D9E0EA] hover:bg-[#FAFBFC]
            "
          >
            플랜 관리하기
            <ChevronDown
              className={`h-4 w-4 text-[#6B7280] transition-transform duration-300 ${
                isMenuOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          <div
            className={`
              absolute right-0 top-[calc(100%+10px)] z-30 w-[132px]
              origin-top-right overflow-hidden rounded-2xl border border-[#E8EDF5] bg-white
              p-1.5 shadow-[0_18px_40px_rgba(15,23,42,0.12)]
              transition-all duration-200 ease-out
              ${
                isMenuOpen
                  ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
              }
            `}
          >
            <button
              type="button"
              onClick={handleRegeneratePlan}
              className="
                flex h-10 w-full items-center rounded-xl px-3
                text-left text-[13px] font-medium text-[#111827]
                transition-colors duration-150 hover:bg-[#F8FAFC]
              "
            >
              플랜 재생성하기
            </button>

            <button
              type="button"
              onClick={handleDeletePlan}
              className="
                flex h-10 w-full items-center rounded-xl px-3
                text-left text-[13px] font-medium text-[#111827]
                transition-colors duration-150 hover:bg-[#F8FAFC]
              "
            >
              플랜 삭제하기
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[450px] overflow-hidden rounded-[18px] border border-[#E8EDF5] bg-white">
        <div className="border-b border-[#EEF2F7] bg-[#FBFCFE] px-4 py-4">
          <p className="text-[11px] font-semibold text-[#A0AEC0]">
            시험일까지 {dday} 남았어요
          </p>

          <p className="mt-1 text-[14px] font-bold text-[#0B1B3B]">
            Week {plan.week} / Day {plan.day} 상세 계획
          </p>
        </div>

        <div className="px-4 py-4">
          <div className="grid grid-cols-[110px_1fr] gap-4">
            <div className="flex flex-col gap-3 text-[12px]">
              <div className="rounded-[10px] border border-[#EEF2F7] bg-[#FBFCFE] px-3 py-3">
                <p className="text-[11px] text-[#98A2B3]">날짜</p>
                <p className="mt-1 font-semibold text-[#0F172A]">
                  {plan.date}
                </p>
              </div>

              <div className="rounded-[10px] border border-[#EEF2F7] bg-[#FBFCFE] px-3 py-3">
                <p className="text-[11px] text-[#98A2B3]">예상 시간</p>
                <p className="mt-1 font-semibold text-[#0F172A]">
                  {plan.hours}시간
                </p>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  {!plan.isCompleted && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1606a5] opacity-30" />
                  )}
                  <span
                    className={`relative inline-flex h-3 w-3 rounded-full ${
                      plan.isCompleted ? "bg-[#16A34A]" : "bg-[#6D5DF6]"
                    }`}
                  />
                </span>

                <h3
                  className={`text-[14px] font-bold ${
                    plan.isCompleted
                      ? "text-[#94A3B8] line-through"
                      : "text-[#0F172A]"
                  }`}
                >
                  {plan.title}
                </h3>
              </div>

              <p
                className={`mt-2 text-[13px] leading-6 ${
                  plan.isCompleted ? "text-[#CBD5E1]" : "text-[#7B8798]"
                }`}
              >
                {plan.description}
              </p>

              <div className="mt-4 flex">
                <button
                  type="button"
                  onClick={() => onToggleComplete?.(plan.id)}
                  className={
                    plan.isCompleted
                      ? "mr-3 ml-auto inline-flex h-[32px] items-center gap-1.5 rounded-[10px] border border-[#CFEAD8] bg-[#EAF8EF] px-3 text-[12px] font-semibold text-[#16A34A] transition hover:opacity-90"
                      : "mr-3 ml-auto inline-flex h-[32px] items-center gap-1.5 rounded-[10px] bg-[#6D5DF6] px-3 text-[12px] font-semibold text-white transition hover:opacity-90"
                  }
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {plan.isCompleted ? "완료 취소" : "완료"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}