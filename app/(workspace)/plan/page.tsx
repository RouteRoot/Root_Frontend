"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Target,
  BookOpen,
  Circle,
} from "lucide-react";
import {
  getPlanTabs,
  getPlanByExamTaskId,
  checkDailyPlan,
} from "@/app/api/plan/plan";
import type {
  DailyPlan,
  PlanResponse,
  PlanTab,
} from "@/app/api/plan/types";

type ExpandedMap = Record<number, boolean>;

export default function PlanPage() {
  const [tabs, setTabs] = useState<PlanTab[]>([]);
  const [selectedExamTaskId, setSelectedExamTaskId] = useState<number | null>(
    null
  );
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [loadingTabs, setLoadingTabs] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<ExpandedMap>({});

  useEffect(() => {
    const fetchTabs = async () => {
      try {
        setLoadingTabs(true);
        setError(null);

        const data = await getPlanTabs();
        setTabs(data);

        if (data.length > 0) {
          setSelectedExamTaskId(data[0].examTaskId);
        }
      } catch (err) {
        console.error(err);
        setError("플랜 목록을 불러오지 못했어요.");
      } finally {
        setLoadingTabs(false);
      }
    };

    fetchTabs();
  }, []);

  useEffect(() => {
    if (selectedExamTaskId === null) return;

    const fetchPlan = async () => {
      try {
        setLoadingPlan(true);
        setError(null);

        const data = await getPlanByExamTaskId(selectedExamTaskId);
        setPlan(data);
        setExpandedItems({});
      } catch (err) {
        console.error(err);
        setError("플랜 정보를 불러오지 못했어요.");
      } finally {
        setLoadingPlan(false);
      }
    };

    fetchPlan();
  }, [selectedExamTaskId]);

  const progress = useMemo(() => {
    if (!plan) {
      return { total: 0, completed: 0, percent: 0 };
    }

    const allDailyPlans = plan.weeklyPlans.flatMap((week) => week.dailyPlans);
    const studyPlans = allDailyPlans.filter((item) => !item.isRest);
    const completedPlans = studyPlans.filter((item) => item.isCompleted);

    const total = studyPlans.length;
    const completed = completedPlans.length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    return { total, completed, percent };
  }, [plan]);

  const todayFocus = useMemo(() => {
    if (!plan) return null;

    for (const week of plan.weeklyPlans) {
      for (const daily of week.dailyPlans) {
        if (!daily.isRest && !daily.isCompleted) {
          return {
            ...daily,
            weekNumber: week.weekNumber,
            weeklyGoal: week.weeklyGoal,
          };
        }
      }
    }

    return null;
  }, [plan]);

  const allTasks = useMemo(() => {
    if (!plan) return [];

    return plan.weeklyPlans.flatMap((week) =>
      week.dailyPlans.map((daily) => ({
        ...daily,
        weekNumber: week.weekNumber,
        weeklyGoal: week.weeklyGoal,
      }))
    );
  }, [plan]);

  const toggleExpanded = (dailyPlanId: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [dailyPlanId]: !prev[dailyPlanId],
    }));
  };

  const handleCheck = async (dailyPlanId: number) => {
    if (!plan) return;

    const previousPlan = plan;

    setPlan({
      ...plan,
      weeklyPlans: plan.weeklyPlans.map((week) => ({
        ...week,
        dailyPlans: week.dailyPlans.map((daily) =>
          daily.dailyPlanId === dailyPlanId
            ? { ...daily, isCompleted: !daily.isCompleted }
            : daily
        ),
      })),
    });

    try {
      const result = await checkDailyPlan(dailyPlanId);

      setPlan((current) => {
        if (!current) return current;

        return {
          ...current,
          weeklyPlans: current.weeklyPlans.map((week) => ({
            ...week,
            dailyPlans: week.dailyPlans.map((daily) =>
              daily.dailyPlanId === dailyPlanId
                ? { ...daily, isCompleted: result.isCompleted }
                : daily
            ),
          })),
        };
      });
    } catch (err) {
      console.error(err);
      setPlan(previousPlan);
      alert("체크 상태를 변경하지 못했어요.");
    }
  };

  if (loadingTabs) {
    return (
      <main className="min-h-screen bg-[#f7f7f5] px-6 py-8 text-[#191919]">
        <div className="mx-auto max-w-7xl">
          <NotionCard>플래너를 불러오는 중...</NotionCard>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#f7f7f5] px-6 py-8 text-[#191919]">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-200 bg-white px-6 py-5 text-sm text-red-500">
            {error}
          </div>
        </div>
      </main>
    );
  }

  if (tabs.length === 0) {
    return (
      <main className="min-h-scree px-6 py-8 text-[#191919]">
        <div className="mx-auto max-w-7xl">
          <NotionCard>
            <p className="text-sm text-[#787774]">Planner</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              아직 생성된 플랜이 없어요
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#787774]">
              먼저 목표 시험에 대한 학습 플랜을 생성해보세요.
            </p>
          </NotionCard>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-8 text-[#191919]">
      <div className="mx-auto max-w-7xl space-y-6">
        <NotionCard>
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm text-[#787774]">Planner</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                학습 플래너
              </h1>
              <p className="mt-3 text-sm leading-6 text-[#787774]">
                시험별 학습 흐름을 정리하고, 오늘의 학습과 전체 계획을 한눈에
                확인해보세요.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const active = tab.examTaskId === selectedExamTaskId;

                return (
                  <button
                    key={tab.examTaskId}
                    onClick={() => setSelectedExamTaskId(tab.examTaskId)}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      active
                        ? "bg-[#191919] text-white"
                        : "border border-[#e9e9e7] bg-white text-[#37352f] hover:bg-[#f1f1ef]"
                    }`}
                  >
                    {tab.taskName}
                  </button>
                );
              })}
            </div>
          </div>
        </NotionCard>

        {loadingPlan ? (
          <NotionCard>선택한 플랜을 불러오는 중...</NotionCard>
        ) : plan ? (
          <>
            <section className="grid gap-4 xl:grid-cols-[1.35fr_0.95fr]">
              <NotionCard>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-[#787774]">현재 선택된 플랜</p>
                    <h2 className="mt-2 text-2xl font-semibold">{plan.taskName}</h2>
                    <p className="mt-2 text-sm text-[#787774]">
                      총 {plan.totalWeeks}주 동안 진행되는 학습 계획이에요.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#ecebe8] bg-[#fbfbfa] px-4 py-3 text-right">
                    <p className="text-xs text-[#787774]">전체 진행률</p>
                    <p className="mt-1 text-xl font-semibold">
                      {progress.percent}%
                    </p>
                  </div>
                </div>

                <div className="mt-6 h-2.5 w-full overflow-hidden rounded-full bg-[#ecebe8]">
                  <div
                    className="h-full rounded-full bg-[#191919] transition-all"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <SummaryCard
                    icon={<BookOpen className="h-4 w-4" />}
                    label="총 학습 항목"
                    value={`${progress.total}개`}
                  />
                  <SummaryCard
                    icon={<CheckCircle2 className="h-4 w-4" />}
                    label="완료한 학습"
                    value={`${progress.completed}개`}
                  />
                  <SummaryCard
                    icon={<Target className="h-4 w-4" />}
                    label="남은 학습"
                    value={`${progress.total - progress.completed}개`}
                  />
                </div>
              </NotionCard>

              <NotionCard>
                <div className="flex items-center gap-2 text-sm text-[#787774]">
                  <CalendarDays className="h-4 w-4" />
                  오늘의 학습
                </div>

                {todayFocus ? (
                  <div className="mt-5 rounded-2xl border border-[#ecebe8] bg-[#fbfbfa] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs text-[#787774]">
                          {todayFocus.weekNumber}주차 · Day {todayFocus.dayNumber}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold leading-7">
                          {todayFocus.topic}
                        </h3>
                      </div>

                      <button
                        onClick={() => handleCheck(todayFocus.dailyPlanId)}
                        className="rounded-full bg-[#191919] px-4 py-2 text-sm text-white transition hover:opacity-90"
                      >
                        완료 체크
                      </button>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-[#5f5e5b]">
                      {todayFocus.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <InfoChip
                        icon={<Clock3 className="h-3.5 w-3.5" />}
                        text={`${todayFocus.estimatedHours}시간`}
                      />
                      <InfoChip
                        icon={<CalendarDays className="h-3.5 w-3.5" />}
                        text={todayFocus.studyDate}
                      />
                    </div>

                    <div className="mt-5 rounded-2xl border border-[#ecebe8] bg-white px-4 py-3">
                      <p className="text-xs text-[#787774]">이번 주 목표</p>
                      <p className="mt-1 text-sm font-medium text-[#191919]">
                        {todayFocus.weeklyGoal}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl border border-[#ecebe8] bg-[#fbfbfa] p-5 text-sm text-[#787774]">
                    남아 있는 학습 계획이 없어요. 잘하고 있어요!
                  </div>
                )}
              </NotionCard>
            </section>

            <NotionCard className="overflow-hidden p-0">
              <div className="border-b border-[#efeeec] px-6 py-5">
                <p className="text-sm text-[#787774]">All Tasks</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                  전체 학습 계획
                </h2>
                <p className="mt-2 text-sm text-[#787774]">
                  항목을 클릭하면 상세 설명과 목표를 확인할 수 있어요.
                </p>
              </div>

              <div className="hidden grid-cols-[120px_140px_1.6fr_150px_120px_140px] gap-4 border-b border-[#efeeec] bg-[#fbfbfa] px-6 py-3 text-xs font-medium text-[#787774] lg:grid">
                <div>상태</div>
                <div>주차 / Day</div>
                <div>학습 항목</div>
                <div>학습일</div>
                <div>예상 시간</div>
                <div>액션</div>
              </div>

              <div className="divide-y divide-[#f1f0ee]">
                {allTasks.map((task) => {
                  const isExpanded = !!expandedItems[task.dailyPlanId];

                  return (
                    <div key={task.dailyPlanId} className="bg-white">
                      <button
                        type="button"
                        onClick={() => toggleExpanded(task.dailyPlanId)}
                        className="w-full px-6 py-4 text-left transition hover:bg-[#fcfcfb]"
                      >
                        <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[120px_140px_1.6fr_150px_120px_140px] lg:items-center lg:gap-4">
                          <div>
                            <StatusBadge
                              isRest={task.isRest}
                              isCompleted={task.isCompleted}
                            />
                          </div>

                          <div className="text-sm text-[#37352f]">
                            {task.weekNumber}주차 · Day {task.dayNumber}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 shrink-0 text-[#9b9a97]" />
                              ) : (
                                <ChevronRight className="h-4 w-4 shrink-0 text-[#9b9a97]" />
                              )}
                              <span className="truncate text-sm font-medium text-[#191919]">
                                {task.topic}
                              </span>
                            </div>
                          </div>

                          <div className="text-sm text-[#5f5e5b]">
                            {task.studyDate}
                          </div>

                          <div className="text-sm text-[#5f5e5b]">
                            {task.estimatedHours}시간
                          </div>

                          <div onClick={(e) => e.stopPropagation()}>
                            {!task.isRest && (
                              <button
                                onClick={() => handleCheck(task.dailyPlanId)}
                                className={`rounded-full px-3.5 py-2 text-xs font-medium transition ${
                                  task.isCompleted
                                    ? "border border-[#e9e9e7] bg-white text-[#5f5e5b] hover:bg-[#f7f7f5]"
                                    : "bg-[#191919] text-white hover:opacity-90"
                                }`}
                              >
                                {task.isCompleted ? "체크 해제" : "완료 체크"}
                              </button>
                            )}
                          </div>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-[#f3f2f0] bg-[#fbfbfa] px-6 py-5">
                          <div className="grid gap-4 xl:grid-cols-[1.3fr_0.9fr]">
                            <div>
                              <p className="text-xs text-[#787774]">상세 설명</p>
                              <p className="mt-2 text-sm leading-7 text-[#37352f]">
                                {task.description}
                              </p>
                            </div>

                            <div className="space-y-3">
                              <div className="rounded-2xl border border-[#ecebe8] bg-white px-4 py-3">
                                <p className="text-xs text-[#787774]">이번 주 목표</p>
                                <p className="mt-1 text-sm font-medium text-[#191919]">
                                  {task.weeklyGoal}
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <InfoChip
                                  icon={<CalendarDays className="h-3.5 w-3.5" />}
                                  text={task.studyDate}
                                />
                                <InfoChip
                                  icon={<Clock3 className="h-3.5 w-3.5" />}
                                  text={`${task.estimatedHours}시간`}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </NotionCard>
          </>
        ) : null}
      </div>
    </main>
  );
}

function NotionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-3xl border border-[#e9e9e7] bg-white px-6 py-6 shadow-[0_1px_2px_rgba(15,15,15,0.04)] ${className}`}
    >
      {children}
    </section>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#ecebe8] bg-[#fbfbfa] px-4 py-4">
      <div className="flex items-center gap-2 text-xs text-[#787774]">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-lg font-semibold text-[#191919]">{value}</p>
    </div>
  );
}

function InfoChip({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-[#e9e9e7] bg-white px-3 py-1.5 text-xs text-[#5f5e5b]">
      {icon}
      {text}
    </div>
  );
}

function StatusBadge({
  isRest,
  isCompleted,
}: {
  isRest: boolean;
  isCompleted: boolean;
}) {
  if (isRest) {
    return (
      <span className="inline-flex rounded-full bg-[#f1f1ef] px-3 py-1 text-xs font-medium text-[#787774]">
        휴식일
      </span>
    );
  }

  if (isCompleted) {
    return (
      <span className="inline-flex rounded-full bg-[#eef7ee] px-3 py-1 text-xs font-medium text-[#2f6b3b]">
        완료
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-[#f3f2f0] px-3 py-1 text-xs font-medium text-[#5f5e5b]">
      진행 전
    </span>
  );
}