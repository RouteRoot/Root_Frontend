"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";

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
        <h2 className="shrink-0 text-[19px] font-extrabold tracking-[-0.04em] text-[#0B1B3B]">
          오늘의 플랜
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
  if (!plan) {
    return <DailyPlanSectionSkeleton />;
  }

  const dday = getDday(plan.examDate);

  return (
    <section className="w-full">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <h2 className="shrink-0 text-[19px] font-semibold tracking-[-0.04em] text-[#0B1B3B] mb-4">
            오늘의 플랜
          </h2>
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

            <div className="relative flex flex-col pb-10">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  {!plan.isCompleted && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1606a5] opacity-30" />
                  )}
                  <span
                    className={`relative inline-flex h-3 w-3 rounded-full ${
                      plan.isCompleted ? "bg-[#CBD5E1]" : "bg-[#4876EF]"
                    }`}
                  />
                </span>

                <h3
                  className={`text-[14px] font-bold ${
                    plan.isCompleted
                      ? "text-[#94A3B8]"
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

              <button
                type="button"
                onClick={() => onToggleComplete?.(plan.id)}
                className={
                  plan.isCompleted
                    ? "absolute bottom-0 right-0 inline-flex h-[32px] items-center gap-1.5 rounded-[10px] border border-[#D1D5DB] bg-[#F3F4F6] px-4 text-[12px] font-semibold text-[#9CA3AF] transition hover:opacity-90"
                    : "absolute bottom-0 right-0 inline-flex h-[32px] items-center gap-1.5 rounded-[10px] bg-[#0075c3]/80 px-4 text-[12px] font-semibold text-white transition hover:opacity-90"
                }
              >
                {plan.isCompleted ? "학습 완료" : "완료"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}