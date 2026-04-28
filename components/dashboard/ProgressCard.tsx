"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPlanByExamTaskId, getPlanTabs } from "@/app/api/plan/plan";
import { getRoadmapByToken } from "@/app/api/roadmap/roadmap";
import { getMe } from "@/app/api/service/user";
import type { DailyPlan, PlanResponse } from "@/app/api/plan/types";
import type { Task } from "@/app/api/roadmap/types";

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

export default function ProgressCard() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [inProgressTasks, setInProgressTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [slides, setSlides] = useState<TodayPlanSlide[]>([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [roadmap, tabs, me] = await Promise.all([
          getRoadmapByToken(),
          getPlanTabs(),
          getMe().catch(() => null),
        ]);
        if (!mounted) return;

        setUserName(me?.name ?? "");

        const allTasks = roadmap.phases.flatMap((phase) => phase.tasks);
        setInProgressTasks(
          allTasks.filter((task) => task.status === "IN_PROGRESS")
        );
        setCompletedTasks(
          allTasks.filter((task) => task.status === "COMPLETED")
        );

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

        if (!mounted) return;
        setSlides(results.filter(Boolean) as TodayPlanSlide[]);
      } catch {
        // Dashboard cards stay empty when the dashboard data is unavailable.
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const total = slides.length;
  const current = slides[slideIndex];
  const dday = current?.examDate ? getDday(current.examDate) : "";

  useEffect(() => {
    if (total <= 1) return;

    const intervalId = window.setInterval(() => {
      setSlideIndex((index) => (index + 1) % total);
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, [total]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
      <div className="flex-none rounded-2xl border border-[#E2E8F0] bg-[#F8F9FA] px-4 py-4">
        <p className="text-[16px] font-bold tracking-[-0.03em] text-[#333333]">
          안녕하세요{userName ? `, ${userName}님` : ""}
        </p>
        {isLoading ? (
          <div className="mt-3 flex items-center gap-3">
            <div className="h-4 w-28 animate-pulse rounded bg-[#E9EEF4]" />
            <div className="h-4 w-24 animate-pulse rounded bg-[#E9EEF4]" />
          </div>
        ) : inProgressTasks.length === 0 && completedTasks.length === 0 ? (
          <p className="mt-3 text-[12px] text-[#CBD5E1]">
            등록된 자격증이 없어요
          </p>
        ) : (
          <div className="mt-3 flex items-center gap-4 text-[13px] font-semibold text-[#333333]">
            <span>진행중인 자격증 {inProgressTasks.length}개</span>
            <span className="h-3 w-px bg-[#E5E8EB]" />
            <span>취득한 자격증 {completedTasks.length}개</span>
          </div>
        )}
      </div>

      <div
        className={`flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#F8F9FA] ${
          total > 0 ? "cursor-pointer transition hover:bg-[#F3F6FA]" : ""
        }`}
        onClick={() => {
          if (total > 0) router.push("/plan");
        }}
        role={total > 0 ? "button" : undefined}
        tabIndex={total > 0 ? 0 : undefined}
        onKeyDown={(e) => {
          if (total > 0 && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            router.push("/plan");
          }
        }}
      >
        <div className="flex-none border-b border-[#EEF2F7] bg-[#FBFCFE] px-4 py-3">
          {isLoading ? (
            <div className="space-y-1.5">
              <div className="h-3 w-24 animate-pulse rounded bg-[#E9EEF4]" />
              <div className="h-3 w-20 animate-pulse rounded bg-[#E9EEF4]" />
              <div className="h-4 w-32 animate-pulse rounded bg-[#E9EEF4]" />
            </div>
          ) : total === 0 ? (
            <p className="text-[12px] font-semibold text-[#A0AEC0]">
              오늘의 플랜
            </p>
          ) : (
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-[#A0AEC0]">
                  시험까지 {dday} 남았어요
                </p>
                <p className="mt-1 truncate text-[14px] font-bold text-[#0B1B3B]">
                  {current?.taskName}
                </p>
                <p className="mt-0.5 text-[12px] font-bold text-[#333333]">
                  Week {current?.weekNumber} / Day {current?.dayNumber} /{" "}
                  {current?.estimatedHours}시간
                </p>
              </div>

              {total > 1 && (
                <div className="flex shrink-0 items-center gap-1 pt-0.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSlideIndex((i) => (i - 1 + total) % total);
                    }}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-[#94A3B8] transition hover:bg-[#EEF2F7] disabled:opacity-30"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-[11px] font-medium text-[#94A3B8]">
                    {slideIndex + 1}/{total}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSlideIndex((i) => (i + 1) % total)
                    }}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-[#94A3B8] transition hover:bg-[#EEF2F7] disabled:opacity-30"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {isLoading ? (
            <div className="flex flex-1 flex-col gap-3 px-4 py-4">
              <div className="flex gap-3">
                <div className="h-16 w-16 animate-pulse rounded-[10px] bg-[#E9EEF4]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-[#E9EEF4]" />
                  <div className="h-3 w-4/5 animate-pulse rounded bg-[#E9EEF4]" />
                  <div className="h-3 w-3/5 animate-pulse rounded bg-[#E9EEF4]" />
                </div>
              </div>
            </div>
          ) : total === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
              <p className="text-[13px] text-[#CBD5E1]">
                오늘의 플랜이 없어요
              </p>
              <Link
                href="/plan"
                className="flex items-center gap-0.5 text-[12px] font-semibold text-[#4876EF] hover:opacity-70"
              >
                플랜 만들기 <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 overflow-hidden">
              <div
                className="flex h-full w-full transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${slideIndex * 100}%)` }}
              >
                {slides.map((slide) => (
                  <div
                    key={slide.examTaskId}
                    className="flex h-full w-full shrink-0 flex-col px-4 py-4"
                  >
                    <div className="flex flex-col">
                      <div className="hidden">
                        <div className="rounded-[10px] border border-[#EEF2F7] bg-white px-2.5 py-2.5">
                          <p className="text-[10px] text-[#98A2B3]">
                            자격증
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-[11px] font-semibold leading-snug text-[#0F172A]">
                            {slide.taskName}
                          </p>
                        </div>
                        <div className="rounded-[10px] border border-[#EEF2F7] bg-white px-2.5 py-2.5">
                          <p className="text-[10px] text-[#98A2B3]">
                            예상 시간
                          </p>
                          <p className="mt-0.5 text-[12px] font-semibold text-[#0F172A]">
                            {slide.estimatedHours}시간
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-3 w-3 shrink-0">
                            {!slide.isCompleted && (
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1606a5] opacity-30" />
                            )}
                            <span
                              className={`relative inline-flex h-3 w-3 rounded-full ${
                                slide.isCompleted
                                  ? "bg-[#CBD5E1]"
                                  : "bg-[#4876EF]"
                              }`}
                            />
                          </span>
                          <h3
                            className={`line-clamp-2 text-[13px] font-bold leading-snug ${
                              slide.isCompleted
                                ? "text-[#94A3B8]"
                                : "text-[#0F172A]"
                            }`}
                          >
                            {slide.topic}
                          </h3>
                        </div>

                        <p
                        className={`mt-2 line-clamp-4 text-[12px] leading-relaxed ${
                            slide.isCompleted
                              ? "text-[#CBD5E1]"
                              : "text-[#7B8798]"
                          }`}
                        >
                          {slide.description}
                        </p>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
