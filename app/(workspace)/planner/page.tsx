"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getPlannerByExamTaskId,
  checkDailyPlan,
} from "@/app/api/service/planner";
import type { PlannerResponse } from "@/types/planner";

const EXAM_TASK_ID = 16;

export default function PlannerPage() {
  const [planner, setPlanner] = useState<PlannerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingId, setCheckingId] = useState<number | null>(null);
  const token = localStorage.getItem("accessToken");
  console.log("token:", token);
  useEffect(() => {
    const fetchPlanner = async () => {
      try {
        setLoading(true);
        const data = await getPlannerByExamTaskId(EXAM_TASK_ID);
        console.log("planner data:", data);
        setPlanner(data);
      } catch (error) {
        console.error("학습 플래너 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanner();
  }, []);

  const progress = useMemo(() => {
    if (!planner) return { done: 0, total: 0 };

    const allDailyPlans = planner.weeklyPlans.flatMap(
      (week) => week.dailyPlans,
    );
    const done = allDailyPlans.filter((plan) => plan.completed).length;

    return {
      done,
      total: allDailyPlans.length,
    };
  }, [planner]);

  const handleCheck = async (dailyPlanId: number) => {
    if (!planner) return;

    try {
      setCheckingId(dailyPlanId);

      const result = await checkDailyPlan(dailyPlanId);

      setPlanner((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          weeklyPlans: prev.weeklyPlans.map((week) => ({
            ...week,
            dailyPlans: week.dailyPlans.map((plan) =>
              plan.dailyPlanId === dailyPlanId
                ? {
                    ...plan,
                    completed:
                      result.completed ?? result.isCompleted ?? plan.completed,
                  }
                : plan,
            ),
          })),
        };
      });
    } catch (error) {
      console.error("학습 완료 체크 실패:", error);
    } finally {
      setCheckingId(null);
    }
  };

  if (loading) {
    return (
      <p className="text-[15px] text-[#6b7280]">학습 플래너를 불러오는 중...</p>
    );
  }

  if (!planner) {
    return (
      <p className="text-[15px] text-red-500">
        플래너 데이터를 불러오지 못했어요.
      </p>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="mb-10">
        <p className="mb-2 text-[14px] text-[#a8a29e]">Planner</p>
        <h1 className="text-[40px] font-bold tracking-[-0.02em] text-[#191919]">
          학습 플래너
        </h1>
        <p className="mt-3 text-[15px] leading-7 text-[#6b7280]">
          주차별 학습 계획을 확인하고 하루 학습을 완료 처리할 수 있어요.
        </p>
      </section>

      <section className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#e7e5e4] bg-white p-5">
          <p className="text-[14px] text-[#a8a29e]">목표 시험</p>
          <h2 className="mt-2 text-[20px] font-semibold text-[#191919]">
            {planner.targetExam}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#e7e5e4] bg-white p-5">
          <p className="text-[14px] text-[#a8a29e]">총 학습 주차</p>
          <h2 className="mt-2 text-[20px] font-semibold text-[#191919]">
            {planner.totalWeeks}주
          </h2>
        </div>

        <div className="rounded-2xl border border-[#e7e5e4] bg-white p-5">
          <p className="text-[14px] text-[#a8a29e]">현재 진행 상태</p>
          <h2 className="mt-2 text-[20px] font-semibold text-[#191919]">
            {progress.done} / {progress.total} 완료
          </h2>
        </div>
      </section>

      <section className="space-y-6">
        {planner.weeklyPlans.map((week, weekIndex) => (
          <div
            key={week.weekNumber ?? weekIndex}
            className="rounded-2xl border border-[#e7e5e4] bg-white p-6"
          >
            <div className="mb-5">
              <p className="text-[14px] text-[#a8a29e]">
                Week {week.weekNumber ?? weekIndex + 1}
              </p>
              <h3 className="mt-1 text-[20px] font-semibold text-[#191919]">
                {week.weeklyGoal ?? `주차 학습 계획 ${weekIndex + 1}`}
              </h3>
            </div>

            <div className="space-y-3">
              {week.dailyPlans.map((plan) => (
                <div
                  key={plan.dailyPlanId}
                  className="flex items-start justify-between rounded-xl border border-[#f0eeeb] bg-[#fcfcfb] px-4 py-4"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={plan.completed}
                      onChange={() => handleCheck(plan.dailyPlanId)}
                      disabled={checkingId === plan.dailyPlanId}
                      className="mt-1 h-4 w-4 accent-[#44403c]"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[15px] font-medium text-[#191919]">
                          Day {plan.dayNumber}. {plan.topic}
                        </p>

                        {plan.rest && (
                          <span className="rounded-full bg-[#f3f4f6] px-2 py-0.5 text-[12px] text-[#6b7280]">
                            휴식
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-[14px] text-[#6b7280]">
                        {plan.description}
                      </p>

                      <div className="mt-2 flex items-center gap-3 text-[13px] text-[#a8a29e]">
                        <span>{plan.studyDate}</span>
                        {!plan.rest && (
                          <span>{plan.estimatedHours}시간 예정</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button className="rounded-lg border border-[#e7e5e4] bg-white px-3 py-2 text-[14px] text-[#44403c] transition hover:bg-[#f7f7f5]">
                    상세
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
