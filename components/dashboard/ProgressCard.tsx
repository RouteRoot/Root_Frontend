"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import Link from "next/link";
import { getPlanByExamTaskId, getPlanTabs } from "@/app/api/plan/plan";
import type { DailyPlan, PlanResponse } from "@/app/api/plan/types";

type ProgressCardProps = {
  variant?: "dashboard" | "guest";
};

type TodayPlanSlide = {
  examTaskId: number;
  taskName: string;
  weekNumber: number;
  dayNumber: number;
  topic: string;
  description: string;
  examDate: string;
  estimatedHours: number;
  isCompleted: boolean;
};

function getTodayInSeoul(): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .replace(/-/g, ".");
}

function formatStudyDate(studyDate: string): string {
  if (!studyDate) return "-";
  if (/^\d{4}-\d{2}-\d{2}$/.test(studyDate)) {
    return studyDate.replace(/-/g, ".");
  }

  const sliced = studyDate.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(sliced)) {
    return sliced.replace(/-/g, ".");
  }

  if (/^\d{4}\.\d{2}\.\d{2}$/.test(studyDate)) return studyDate;
  return studyDate;
}

function getExamDateFromPlan(plan: PlanResponse): string {
  const allDates = plan.weeklyPlans
    .flatMap((week) => week.dailyPlans)
    .map((daily) => formatStudyDate(daily.studyDate))
    .filter((date) => date !== "-")
    .sort();

  return allDates[allDates.length - 1] ?? "";
}

function getDday(examDate: string): string {
  if (!examDate) return "";

  const [y, m, d] = examDate.split(".").map(Number);
  const target = new Date(y, m - 1, d);
  const today = new Date();
  const base = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = Math.ceil((target.getTime() - base.getTime()) / 86400000);

  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return "D-Day";
  return `D+${Math.abs(diff)}`;
}

function findTodayPlan(
  plan: PlanResponse
): { weekNumber: number; daily: DailyPlan } | null {
  const today = getTodayInSeoul();

  for (const week of plan.weeklyPlans) {
    for (const daily of week.dailyPlans) {
      if (formatStudyDate(daily.studyDate) === today && !daily.isRest) {
        return { weekNumber: week.weekNumber, daily };
      }
    }
  }

  for (const week of plan.weeklyPlans) {
    for (const daily of week.dailyPlans) {
      if (!daily.isCompleted && !daily.isRest) {
        return { weekNumber: week.weekNumber, daily };
      }
    }
  }

  return null;
}

function GuestProgressCard() {
  return (
    <div className="flex h-full min-h-[240px] flex-col justify-between overflow-hidden rounded-[10px] border border-[#D8E4FF] bg-[#FBFCFF] px-6 py-6">
      <div>
        <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white text-[#4876EF] ring-1 ring-[#E4ECFF]">
          <Sparkles className="h-5 w-5" />
        </span>

        <p className="mt-5 text-[13px] font-medium text-[#4876EF]">
          맞춤 플랜
        </p>
        <h2 className="mt-2 text-[22px] font-medium leading-[1.28] tracking-tight text-[#333333]">
          자격증 준비를
          <br />
          한 번에 시작해요
        </h2>
        <p className="mt-3 text-[13px] leading-[1.6] text-[#686A6D]">
          뿌리와 함께 자격증 로드맵과 데일리 플랜을 쉽게 만들고, 오늘
          해야 할 학습까지 한눈에 확인해보세요.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <Link
          href="/signup"
          className="flex h-12 items-center justify-center gap-2 rounded-[8px] bg-[#4876EF] px-4 text-[14px] font-medium text-white transition hover:bg-[#3F68D8]"
        >
          무료로 플랜 만들기
          <ArrowRight className="h-4 w-4" />
        </Link>

        <Link
          href="/login"
          className="flex h-11 items-center justify-center rounded-[8px] border border-[#D8E4FF] bg-white px-4 text-[14px] font-medium text-[#4876EF] transition hover:bg-[#F4F7FF]"
        >
          로그인하고 이어보기
        </Link>
      </div>
    </div>
  );
}

function DashboardProgressCard() {
  const [slides, setSlides] = useState<TodayPlanSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const tabs = await getPlanTabs();
        if (!mounted) return;

        const results = await Promise.all(
          tabs.map(async (tab) => {
            try {
              const plan = await getPlanByExamTaskId(tab.examTaskId);
              const found = findTodayPlan(plan);
              if (!found) return null;

              return {
                examTaskId: tab.examTaskId,
                taskName: tab.taskName,
                weekNumber: found.weekNumber,
                dayNumber: found.daily.dayNumber,
                topic: found.daily.topic,
                description: found.daily.description,
                examDate: getExamDateFromPlan(plan),
                estimatedHours: found.daily.estimatedHours,
                isCompleted: found.daily.isCompleted,
              } satisfies TodayPlanSlide;
            } catch {
              return null;
            }
          })
        );

        if (mounted) setSlides(results.filter(Boolean) as TodayPlanSlide[]);
      } catch {
        if (mounted) setSlides([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const scrollToNextPlan = () => {
    const node = scrollRef.current;
    if (!node) return;

    if (isScrolledToEnd) {
      node.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    node.scrollBy({
      top: Math.max(132, node.clientHeight * 0.72),
      behavior: "smooth",
    });
  };

  const handlePlanScroll = () => {
    const node = scrollRef.current;
    if (!node) return;

    const remaining = node.scrollHeight - node.scrollTop - node.clientHeight;
    setIsScrolledToEnd(remaining <= 8);
  };

  return (
    <section className="relative flex h-full min-h-0 flex-col overflow-visible">
      {isLoading ? (
        <div className="flex h-full flex-1 flex-col gap-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex flex-1 flex-col justify-center rounded-[10px] border border-[#E5E8EB] bg-[#FBFCFF] px-4 py-4"
            >
              <div className="h-4 w-2/3 animate-pulse rounded bg-[#EEF2F7]" />
              <div className="mt-3 h-3 w-full animate-pulse rounded bg-[#F3F6FA]" />
              <div className="mt-2 h-3 w-4/5 animate-pulse rounded bg-[#F3F6FA]" />
            </div>
          ))}
        </div>
      ) : slides.length === 0 ? (
        <div className="flex flex-1 flex-col justify-center rounded-[10px] border border-[#E5E8EB] bg-[#FBFCFF] px-5 text-center">
          <p className="text-[14px] font-medium text-[#667085]">
            오늘 진행할 플랜이 없어요.
          </p>
          <Link
            href="/plan"
            className="mt-3 inline-flex items-center justify-center gap-1 text-[13px] font-medium text-[#4876EF]"
          >
            플랜 만들기
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <>
        <div
          ref={scrollRef}
          onScroll={handlePlanScroll}
          className="min-h-0 flex-1 snap-y snap-mandatory overflow-y-auto pb-7 pr-2 scrollbar-hide"
        >
          <div className="flex flex-col gap-3">
            {slides.map((slide) => {
              const dday = getDday(slide.examDate);

              return (
                <Link
                  key={slide.examTaskId}
                  href="/plan"
                  className="flex min-h-[154px] snap-start flex-col justify-center overflow-hidden rounded-[10px] border border-[#E5E8EB] bg-[#fefefe] px-4 py-4 shadow-[0_2px_8px_rgba(15,23,42,0.035)] transition hover:border-[#D0D7E3] hover:bg-[#F8FAFD]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-semibold text-[#4F73E8]">
                        {slide.taskName}
                      </p>
                      <h3 className="mt-1 line-clamp-2 text-[16px] font-medium leading-snug text-[#333333]">
                        {slide.topic || slide.taskName}
                      </h3>
                    </div>
                    {dday && (
                      <span className="shrink-0 rounded-full border border-[#DDE7FF] bg-[#F7F8FA] px-2.5 py-1 text-[11px] font-semibold text-[#333333]">
                        {dday}
                      </span>
                    )}
                  </div>

                  <p className="mt-2 line-clamp-2 text-[13px] leading-[1.55] text-[#686A6D]">
                    {slide.description || "오늘의 학습 내용을 확인해보세요."}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-[11px] font-normal text-[#686A6D]">
                    <span className="rounded-[6px] bg-[#F1F5FF] px-2 py-1 font-medium text-[#4F73E8]">
                      Week {slide.weekNumber}
                    </span>
                    <span className="rounded-[6px] bg-[#F7F8FA] px-2 py-1 ring-1 ring-[#E1E5EA]">
                      Day {slide.dayNumber}
                    </span>
                    <span className="rounded-[6px] bg-[#F7F8FA] px-2 py-1 ring-1 ring-[#E1E5EA]">
                      {slide.estimatedHours}시간
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        {slides.length > 1 && (
          <button
            type="button"
            onClick={scrollToNextPlan}
            aria-label={isScrolledToEnd ? "처음 플랜 보기" : "다음 플랜 보기"}
            className="absolute bottom-0 left-1/2 flex h-9 w-9 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border border-[#DCE8FF] bg-white text-[#333333] transition hover:border-[#BFD2FF] hover:bg-[#F7F8FA]"
          >
            {isScrolledToEnd ? (
              <ChevronUp className="h-4.5 w-4.5" strokeWidth={1.6} />
            ) : (
              <ChevronDown className="h-4.5 w-4.5" strokeWidth={1.6} />
            )}
          </button>
        )}
        </>
      )}
    </section>
  );
}

export default function ProgressCard({
  variant = "dashboard",
}: ProgressCardProps) {
  if (variant === "guest") {
    return <GuestProgressCard />;
  }

  return <DashboardProgressCard />;
}
