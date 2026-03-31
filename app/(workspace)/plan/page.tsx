"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getPlanTabs,
  getPlanByExamTaskId,
  checkDailyPlan,
} from "@/app/api/plan/plan";
import type {
  PlanResponse,
  PlanTab,
  DailyPlan,
} from "@/app/api/plan/types";

export default function PlannPage() {
  const [tabs, setTabs] = useState<PlanTab[]>([]);
  const [selectedExamTaskId, setSelectedExamTaskId] = useState<number | null>(null);
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [loadingTabs, setLoadingTabs] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1) 탭 목록 조회
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
        setError("플랜 목록을 불러오지 못했습니다.");
      } finally {
        setLoadingTabs(false);
      }
    };

    fetchTabs();
  }, []);

  // 2) 선택된 탭의 상세 조회
  useEffect(() => {
    if (selectedExamTaskId === null) return;

    const fetchPlan = async () => {
      try {
        setLoadingPlan(true);
        setError(null);

        const data = await getPlanByExamTaskId(selectedExamTaskId);
        setPlan(data);
      } catch (err) {
        console.error(err);
        setError("플랜 상세 정보를 불러오지 못했습니다.");
      } finally {
        setLoadingPlan(false);
      }
    };

    fetchPlan();
  }, [selectedExamTaskId]);

  // 3) 오늘의 학습 예시: 아직 완료되지 않은 첫 번째 항목
  const currentStudyPlan = useMemo(() => {
    if (!plan) return null;

    for (const weeklyPlan of plan.weeklyPlans) {
      for (const dailyPlan of weeklyPlan.dailyPlans) {
        if (!dailyPlan.isCompleted && !dailyPlan.isRest) {
          return {
            weeklyPlanId: weeklyPlan.weeklyPlanId,
            weekNumber: weeklyPlan.weekNumber,
            weeklyGoal: weeklyPlan.weeklyGoal,
            ...dailyPlan,
          };
        }
      }
    }

    return null;
  }, [plan]);

  // 4) 진행률 계산
  const progress = useMemo(() => {
    if (!plan) {
      return {
        completed: 0,
        total: 0,
        percent: 0,
      };
    }

    const allDailyPlans = plan.weeklyPlans.flatMap((week) => week.dailyPlans);
    const studyPlans = allDailyPlans.filter((item) => !item.isRest);
    const completedPlans = studyPlans.filter((item) => item.isCompleted);

    const total = studyPlans.length;
    const completed = completedPlans.length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    return { completed, total, percent };
  }, [plan]);

  // 5) 일일 계획 체크 토글
  const handleCheckDailyPlan = async (dailyPlanId: number) => {
    if (!plan) return;

    // optimistic update
    const previousPlan = plan;

    const updatedPlan: PlanResponse = {
      ...plan,
      weeklyPlans: plan.weeklyPlans.map((week) => ({
        ...week,
        dailyPlans: week.dailyPlans.map((daily) =>
          daily.dailyPlanId === dailyPlanId
            ? { ...daily, isCompleted: !daily.isCompleted }
            : daily
        ),
      })),
    };

    setPlan(updatedPlan);

    try {
      const result = await checkDailyPlan(dailyPlanId);

      // 서버 응답 기준으로 다시 동기화
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
      alert("체크 상태를 변경하지 못했습니다.");
    }
  };

  if (loadingTabs) {
    return <main className="p-6">플랜 목록을 불러오는 중...</main>;
  }

  if (error) {
    return <main className="p-6 text-red-500">{error}</main>;
  }

  if (tabs.length === 0) {
    return (
      <main className="p-6">
        <h1 className="mb-2 text-2xl font-bold">플래너</h1>
        <p>아직 생성된 플랜이 없습니다.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-8 text-[#111827]">
      <div className="mx-auto max-w-6xl">
        {/* 헤더 */}
        <section className="mb-6 rounded-2xl border border-[#e9e7e3] bg-white p-6">
          <h1 className="text-2xl font-bold">학습 플래너</h1>
          <p className="mt-2 text-sm text-gray-500">
            시험별 플랜을 확인하고, 오늘의 학습을 체크해보세요.
          </p>
        </section>

        {/* 탭 */}
        <section className="mb-6 flex flex-wrap gap-3">
          {tabs.map((tab) => {
            const isActive = tab.examTaskId === selectedExamTaskId;

            return (
              <button
                key={tab.examTaskId}
                onClick={() => setSelectedExamTaskId(tab.examTaskId)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-black text-white"
                    : "border border-[#e9e7e3] bg-white text-gray-700"
                }`}
              >
                {tab.taskName}
              </button>
            );
          })}
        </section>

        {loadingPlan ? (
          <div className="rounded-2xl border border-[#e9e7e3] bg-white p-6">
            선택한 플랜을 불러오는 중...
          </div>
        ) : plan ? (
          <>
            {/* 상단 요약 */}
            <section className="mb-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-[#e9e7e3] bg-white p-5">
                <p className="text-sm text-gray-500">시험명</p>
                <h2 className="mt-2 text-xl font-semibold">{plan.taskName}</h2>
              </div>

              <div className="rounded-2xl border border-[#e9e7e3] bg-white p-5">
                <p className="text-sm text-gray-500">총 주차</p>
                <h2 className="mt-2 text-xl font-semibold">{plan.totalWeeks}주</h2>
              </div>

              <div className="rounded-2xl border border-[#e9e7e3] bg-white p-5">
                <p className="text-sm text-gray-500">진행률</p>
                <h2 className="mt-2 text-xl font-semibold">
                  {progress.completed} / {progress.total} ({progress.percent}%)
                </h2>
                <div className="mt-3 h-2 w-full rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-black transition-all"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
              </div>
            </section>

            {/* 오늘의 학습 */}
            <section className="mb-6 rounded-2xl border border-[#e9e7e3] bg-white p-6">
              <h3 className="text-lg font-semibold">오늘의 학습</h3>

              {currentStudyPlan ? (
                <div className="mt-4 rounded-xl border border-[#f1efeb] bg-[#fafaf8] p-4">
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        {currentStudyPlan.weekNumber}주차 · Day {currentStudyPlan.dayNumber}
                      </p>
                      <h4 className="mt-1 text-base font-semibold">
                        {currentStudyPlan.topic}
                      </h4>
                    </div>

                    <button
                      onClick={() =>
                        handleCheckDailyPlan(currentStudyPlan.dailyPlanId)
                      }
                      className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
                    >
                      완료 체크
                    </button>
                  </div>

                  <p className="text-sm text-gray-700">
                    {currentStudyPlan.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
                    <span>학습일: {currentStudyPlan.studyDate}</span>
                    <span>예상 시간: {currentStudyPlan.estimatedHours}시간</span>
                    <span>주간 목표: {currentStudyPlan.weeklyGoal}</span>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-500">
                   모두 완료 하셨습니다!
                </p>
              )}
            </section>

            {/* 주차별 계획 */}
            <section className="space-y-4">
              {plan.weeklyPlans.map((week) => (
                <div
                  key={week.weeklyPlanId}
                  className="rounded-2xl border border-[#e9e7e3] bg-white p-6"
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">{week.weekNumber}주차</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      주간 목표: {week.weeklyGoal}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {week.dailyPlans.map((daily) => (
                      <DailyPlanItem
                        key={daily.dailyPlanId}
                        daily={daily}
                        onCheck={handleCheckDailyPlan}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}

function DailyPlanItem({
  daily,
  onCheck,
}: {
  daily: DailyPlan;
  onCheck: (dailyPlanId: number) => void;
}) {
  return (
    <div className="rounded-xl border border-[#f1efeb] bg-[#fafaf8] p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-600 border border-[#e9e7e3]">
              Day {daily.dayNumber}
            </span>

            {daily.isRest ? (
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                휴식일
              </span>
            ) : daily.isCompleted ? (
              <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                완료
              </span>
            ) : (
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                진행 전
              </span>
            )}
          </div>

          <h4 className="text-base font-semibold">{daily.topic}</h4>
          <p className="mt-2 text-sm text-gray-700">{daily.description}</p>

          <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
            <span>학습일: {daily.studyDate}</span>
            <span>예상 시간: {daily.estimatedHours}시간</span>
          </div>
        </div>

        {!daily.isRest && (
          <button
            onClick={() => onCheck(daily.dailyPlanId)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              daily.isCompleted
                ? "border border-[#e9e7e3] bg-white text-gray-700"
                : "bg-black text-white"
            }`}
          >
            {daily.isCompleted ? "체크 해제" : "완료 체크"}
          </button>
        )}
      </div>
    </div>
  );
}