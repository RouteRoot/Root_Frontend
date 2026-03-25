"use client";

import { useEffect, useMemo, useState } from "react";
import { checkDailyPlan, getPlanByExamTaskId } from "@/app/api/service/plan";

type DailyPlan = {
  dailyPlanId: number;
  studyDate: string;
  isCompleted: boolean;
  dayNumber: number;
  topic: string;
  description: string;
  estimatedHours: number;
  isRest: boolean;
};

type WeeklyPlan = {
  weeklyPlanId: number;
  weekNumber: number;
  weeklyGoal: string;
  dailyPlans: DailyPlan[];
};

type PlanResponse = {
  examTaskId: number;
  taskName: string;
  totalWeeks: number;
  weeklyPlans: WeeklyPlan[];
};

function formatDate(dateString: string) {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(date);
}

function isToday(dateString: string) {
  if (!dateString) return false;

  const today = new Date();
  const target = new Date(dateString);

  if (Number.isNaN(target.getTime())) return false;

  return (
    today.getFullYear() === target.getFullYear() &&
    today.getMonth() === target.getMonth() &&
    today.getDate() === target.getDate()
  );
}

function getAllDailyPlans(weeklyPlans: WeeklyPlan[]) {
  return weeklyPlans.flatMap((week) => week.dailyPlans);
}

function getWeekProgress(week: WeeklyPlan) {
  const studyDays = week.dailyPlans.filter((day) => !day.isRest);
  if (studyDays.length === 0) return 0;

  const completedCount = studyDays.filter((day) => day.isCompleted).length;
  return Math.round((completedCount / studyDays.length) * 100);
}

function getTotalProgress(weeklyPlans: WeeklyPlan[]) {
  const allStudyDays = getAllDailyPlans(weeklyPlans).filter(
    (day) => !day.isRest,
  );
  if (allStudyDays.length === 0) return 0;

  const completedCount = allStudyDays.filter((day) => day.isCompleted).length;
  return Math.round((completedCount / allStudyDays.length) * 100);
}

function getTodayPlans(weeklyPlans: WeeklyPlan[]) {
  return getAllDailyPlans(weeklyPlans).filter((day) => isToday(day.studyDate));
}

export default function PlannerPage() {
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingId, setCheckingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        setError("");

        const savedExamTaskId = localStorage.getItem("examTaskId");
        console.log("planner에서 조회할 examTaskId:", savedExamTaskId);

        if (!savedExamTaskId) {
          setError("생성된 학습 플랜이 없습니다.");
          return;
        }

        const data = await getPlanByExamTaskId(Number(savedExamTaskId));

        console.log("plan 전체:", data);
        console.log(
          "dailyPlanIds:",
          data.weeklyPlans.flatMap((week: WeeklyPlan) =>
            week.dailyPlans.map((day: DailyPlan) => ({
              id: day.dailyPlanId,
              topic: day.topic,
            })),
          ),
        );

        setPlan(data);
      } catch (err) {
        console.error("학습 플랜 조회 실패:", err);
        setError("학습 플랜을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, []);

  const weeklyPlans = useMemo(() => plan?.weeklyPlans ?? [], [plan]);

  const totalProgress = useMemo(() => {
    return getTotalProgress(weeklyPlans);
  }, [weeklyPlans]);

  const todayPlans = useMemo(() => {
    return getTodayPlans(weeklyPlans);
  }, [weeklyPlans]);

  const completedTodayCount = useMemo(() => {
    return todayPlans.filter((day) => day.isCompleted).length;
  }, [todayPlans]);

  const totalTodayCount = useMemo(() => {
    return todayPlans.filter((day) => !day.isRest).length;
  }, [todayPlans]);

  const totalStudyDays = useMemo(() => {
    return getAllDailyPlans(weeklyPlans).filter((day) => !day.isRest).length;
  }, [weeklyPlans]);

  const completedStudyDays = useMemo(() => {
    return getAllDailyPlans(weeklyPlans).filter(
      (day) => !day.isRest && day.isCompleted,
    ).length;
  }, [weeklyPlans]);

  const handleCheckDailyPlan = async (dailyPlanId: number) => {
    console.log("handleCheckDailyPlan param:", dailyPlanId);

    if (!plan) return;

    const previousPlan = structuredClone(plan);
    setCheckingId(dailyPlanId);

    setPlan((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        weeklyPlans: prev.weeklyPlans.map((week) => ({
          ...week,
          dailyPlans: week.dailyPlans.map((day) =>
            day.dailyPlanId === dailyPlanId
              ? { ...day, isCompleted: !day.isCompleted }
              : day,
          ),
        })),
      };
    });

    try {
      const result = await checkDailyPlan(dailyPlanId);
      console.log("** 체크 응답:", result);

      setPlan((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          weeklyPlans: prev.weeklyPlans.map((week) => ({
            ...week,
            dailyPlans: week.dailyPlans.map((day) =>
              day.dailyPlanId === dailyPlanId
                ? { ...day, isCompleted: result.isCompleted }
                : day,
            ),
          })),
        };
      });
    } catch (err) {
      console.error("완료 체크 실패:", err);
      setPlan(previousPlan);
      setError("완료 체크에 실패했습니다.");
    } finally {
      setCheckingId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAFAF8] px-6 py-8 text-black md:px-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="rounded-[28px] border border-[#E8E8E5] bg-white p-8">
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="mt-4 h-10 w-72 rounded bg-gray-200" />
            <div className="mt-3 h-4 w-96 rounded bg-gray-100" />
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="rounded-[28px] border border-[#E8E8E5] bg-white p-6 xl:col-span-2">
              <div className="h-4 w-20 rounded bg-gray-200" />
              <div className="mt-4 h-9 w-64 rounded bg-gray-200" />
              <div className="mt-3 h-4 w-40 rounded bg-gray-100" />
            </div>

            <div className="rounded-[28px] border border-[#E8E8E5] bg-white p-6">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="mt-4 h-20 rounded-2xl bg-gray-100" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error && !plan) {
    return (
      <main className="min-h-screen bg-[#FAFAF8] px-6 py-8 text-black md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-6">
            <h2 className="text-xl font-semibold text-red-600">
              플랜을 불러오지 못했습니다.
            </h2>
            <p className="mt-2 text-sm text-red-500">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!plan) {
    return (
      <main className="min-h-screen bg-[#FAFAF8] px-6 py-8 text-black md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[28px] border border-gray-200 bg-white p-6 text-gray-600">
            아직 생성된 학습 플랜이 없습니다.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8] px-6 py-8 text-black md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[28px] border border-[#E8E8E5] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] md:p-8">
          <p className="mb-2 text-sm text-neutral-500">Planner</p>
          <h1 className="text-3xl font-bold tracking-tight">{plan.taskName}</h1>
          <p className="mt-2 text-sm text-neutral-500">
            시험 일정에 맞춰 자동 생성된 나만의 학습 플랜입니다.
          </p>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="rounded-[28px] border border-[#E8E8E5] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] xl:col-span-2">
            <p className="text-sm text-neutral-500">학습 개요</p>

            <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  총 {plan.totalWeeks}주 플랜
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                  {completedStudyDays} / {totalStudyDays} 학습일 완료
                </p>
              </div>

              <div className="min-w-45">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-neutral-500">전체 진행률</span>
                  <span className="font-semibold">{totalProgress}%</span>
                </div>

                <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-black transition-all duration-500 ease-out"
                    style={{ width: `${totalProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#E8E8E5] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            <p className="text-sm text-neutral-500">오늘의 할 일</p>

            <div className="mt-4">
              {todayPlans.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {todayPlans.map((day) => (
                      <div
                        key={day.dailyPlanId}
                        className={`rounded-2xl border p-4 transition-all duration-300 ${
                          day.isCompleted
                            ? "scale-[1.01] border-black bg-black text-white"
                            : "border-neutral-200 bg-white text-black"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-xs ${
                                day.isCompleted
                                  ? "text-white/70"
                                  : "text-neutral-400"
                              }`}
                            >
                              Day {day.dayNumber} · {formatDate(day.studyDate)}
                            </p>

                            <h3 className="mt-1 text-base font-semibold">
                              {day.topic}
                            </h3>

                            <p
                              className={`mt-1 text-sm ${
                                day.isCompleted
                                  ? "text-white/80"
                                  : "text-neutral-500"
                              }`}
                            >
                              {day.description}
                            </p>
                          </div>

                          <button
                            onClick={() => {
                              console.log(
                                "today card click:",
                                day.dailyPlanId,
                                day.topic,
                              );
                              !day.isRest &&
                                handleCheckDailyPlan(day.dailyPlanId);
                            }}
                            disabled={
                              day.isRest || checkingId === day.dailyPlanId
                            }
                            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition ${
                              day.isRest
                                ? "cursor-not-allowed bg-neutral-100 text-neutral-400"
                                : day.isCompleted
                                  ? "bg-white text-black"
                                  : "border border-neutral-300 bg-white text-black hover:bg-neutral-50"
                            }`}
                          >
                            {day.isRest
                              ? "휴식일"
                              : checkingId === day.dailyPlanId
                                ? "처리 중..."
                                : day.isCompleted
                                  ? "완료됨"
                                  : "완료 체크"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="rounded-2xl bg-neutral-50 px-4 py-6 text-sm text-neutral-500">
                  오늘 예정된 학습 항목이 없어요.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          {weeklyPlans.map((week) => {
            const weekProgress = getWeekProgress(week);

            return (
              <article
                key={week.weeklyPlanId}
                className="rounded-[28px] border border-[#E8E8E5] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)]"
              >
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm text-neutral-400">
                      Week {week.weekNumber}
                    </p>
                    <h3 className="mt-1 text-2xl font-semibold">
                      {week.weeklyGoal}
                    </h3>
                  </div>

                  <div className="w-full max-w-sm">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-neutral-500">주차 진행률</span>
                      <span className="font-semibold">{weekProgress}%</span>
                    </div>

                    <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-full rounded-full bg-black transition-all duration-500 ease-out"
                        style={{ width: `${weekProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  {[...week.dailyPlans]
                    .sort((a, b) => a.dayNumber - b.dayNumber)
                    .map((day) => {
                      const isChecking = checkingId === day.dailyPlanId;

                      return (
                        <div
                          key={day.dailyPlanId}
                          className={`rounded-2xl border p-5 transition-all duration-300 ${
                            day.isCompleted
                              ? "scale-[1.01] border-[#00711c] bg-[#5ec78e] text-white shadow-[0_8px_24px_rgba(0,0,0,0.16)]"
                              : "border-neutral-200 bg-[#FCFCFB] text-black hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span
                                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                    day.isCompleted
                                      ? "bg-white/15 text-white"
                                      : "bg-neutral-100 text-neutral-600"
                                  }`}
                                >
                                  Day {day.dayNumber}
                                </span>

                                <span
                                  className={`text-xs ${
                                    day.isCompleted
                                      ? "text-white/70"
                                      : "text-neutral-400"
                                  }`}
                                >
                                  {formatDate(day.studyDate)}
                                </span>

                                {day.isRest && (
                                  <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                      day.isCompleted
                                        ? "bg-white/15 text-white"
                                        : "bg-neutral-100 text-neutral-500"
                                    }`}
                                  >
                                    휴식일
                                  </span>
                                )}

                                {isToday(day.studyDate) && !day.isRest && (
                                  <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                      day.isCompleted
                                        ? "bg-white text-black"
                                        : "bg-black text-white"
                                    }`}
                                  >
                                    오늘
                                  </span>
                                )}
                              </div>

                              <h4 className="truncate text-lg font-semibold">
                                {day.topic}
                              </h4>

                              <p
                                className={`mt-2 text-sm leading-6 ${
                                  day.isCompleted
                                    ? "text-white/80"
                                    : "text-neutral-500"
                                }`}
                              >
                                {day.description}
                              </p>

                              <p
                                className={`mt-3 text-xs ${
                                  day.isCompleted
                                    ? "text-white/65"
                                    : "text-neutral-400"
                                }`}
                              >
                                예상 학습 시간 {day.estimatedHours}시간
                              </p>
                            </div>

                            <button
                              onClick={() => {
                                console.log(
                                  "🔥 week card click:",
                                  day.dailyPlanId,
                                  day.topic,
                                );
                                !day.isRest &&
                                  handleCheckDailyPlan(day.dailyPlanId);
                              }}
                              disabled={day.isRest || isChecking}
                              className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition ${
                                day.isRest
                                  ? "cursor-not-allowed bg-neutral-100 text-neutral-400"
                                  : day.isCompleted
                                    ? "bg-white text-black"
                                    : "border border-neutral-300 bg-white text-black hover:bg-neutral-50"
                              }`}
                            >
                              {day.isRest
                                ? "휴식일"
                                : isChecking
                                  ? "처리 중..."
                                  : day.isCompleted
                                    ? "완료됨"
                                    : "진행 중"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
