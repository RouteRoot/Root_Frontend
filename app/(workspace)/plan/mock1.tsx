"use client";

import { useEffect, useMemo, useState } from "react";
import TodayFocusCard from "@/components/plan/todayPlannerCard";
import StudySummaryCard from "@/components/plan/StudySummaryCard";
import WeeklyStudyTracker, {
  type StudyItem,
} from "@/components/plan/weekliyStudyPlanner";
import { getPlanByExamTaskId, checkDailyPlan } from "@/app/api/plan/plan";
import type { PlanResponse } from "@/app/api/plan/types";

type FlattenedDailyPlan = {
  dailyPlanId: number;
  studyDate: string;
  isCompleted: boolean;
  dayNumber: number;
  topic: string;
  description: string;
  estimatedHours: number;
  isRest: boolean;
  weekNumber: number;
};

export default function PlanPage() {
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const savedExamTaskId = localStorage.getItem("examTaskId");

        if (!savedExamTaskId) {
          console.error("examTaskId가 없습니다.");
          setLoading(false);
          return;
        }

        const examTaskId = Number(savedExamTaskId);
        const response = await getPlanByExamTaskId(examTaskId);
        setPlan(response);
      } catch (error) {
        console.error("플랜 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, []);

  const allDailyPlans = useMemo<FlattenedDailyPlan[]>(() => {
    if (!plan) return [];

    return plan.weeklyPlans.flatMap((weeklyPlan) =>
      weeklyPlan.dailyPlans.map((dailyPlan) => ({
        ...dailyPlan,
        weekNumber: weeklyPlan.weekNumber,
      }))
    );
  }, [plan]);

  const todayFocus = useMemo<FlattenedDailyPlan | null>(() => {
    if (allDailyPlans.length === 0) return null;

    const nextPlan = allDailyPlans.find(
      (item) => !item.isCompleted && !item.isRest
    );

    if (nextPlan) return nextPlan;

    return allDailyPlans[allDailyPlans.length - 1] ?? null;
  }, [allDailyPlans]);

  const trackerItems = useMemo<StudyItem[]>(() => {
    return allDailyPlans
      .filter((item) => !item.isRest)
      .map((item) => ({
        id: item.dailyPlanId,
        subject: item.topic,
        weekDay: `${item.weekNumber}주차 · ${item.dayNumber}DAY`,
        studyDate: formatDateToMMDD(item.studyDate),
        hours: `${item.estimatedHours}시간`,
        status: item.isCompleted
          ? "COMPLETED"
          : todayFocus?.dailyPlanId === item.dailyPlanId
          ? "IN_PROGRESS"
          : "NOT_STARTED",
        description: item.description,
      }));
  }, [allDailyPlans, todayFocus]);

  const completedCount = useMemo(() => {
    return trackerItems.filter((item) => item.status === "COMPLETED").length;
  }, [trackerItems]);

  const totalEstimatedHours = useMemo(() => {
    return allDailyPlans
      .filter((item) => !item.isRest)
      .reduce((acc, cur) => acc + cur.estimatedHours, 0);
  }, [allDailyPlans]);

  const handleToggleDailyPlan = async (dailyPlanId: number) => {
    try {
      const result = await checkDailyPlan(dailyPlanId);

      setPlan((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          weeklyPlans: prev.weeklyPlans.map((weeklyPlan) => ({
            ...weeklyPlan,
            dailyPlans: weeklyPlan.dailyPlans.map((dailyPlan) =>
              dailyPlan.dailyPlanId === dailyPlanId
                ? { ...dailyPlan, isCompleted: result.isCompleted }
                : dailyPlan
            ),
          })),
        };
      });
    } catch (error) {
      console.error("일일 계획 체크 실패:", error);
    }
  };

  if (loading) {
    return <div className="px-10 pt-10">불러오는 중...</div>;
  }

  if (!plan) {
    return <div className="px-10 pt-10">플랜이 없습니다.</div>;
  }

  return (
    <div className="px-10 pb-10">
      <div className="mt-18 flex h-[calc(100vh-120px)] items-start justify-between overflow-hidden">
        <div className="sticky top-0 flex w-[300px] shrink-0 flex-col gap-6 self-start">
          <TodayFocusCard
            day={todayFocus ? getDayFromDate(todayFocus.studyDate) : "00"}
            month={todayFocus ? getMonthFromDate(todayFocus.studyDate) : "MONTH"}
            monthNumber={
              todayFocus ? getMonthNumberFromDate(todayFocus.studyDate) : "00"
            }
            weekday={todayFocus ? getWeekdayFromDate(todayFocus.studyDate) : "DAY"}
            sectionTitle="Today's Focus"
            weekLabel={todayFocus ? `${todayFocus.weekNumber}주차` : "1주차"}
            dayLabel={todayFocus ? `${todayFocus.dayNumber}DAY` : "1DAY"}
            subject={todayFocus?.topic ?? "오늘의 학습이 없습니다"}
            description={
              todayFocus?.description ?? "새로운 학습 계획을 생성해보세요."
            }
            hours={todayFocus ? `${todayFocus.estimatedHours}시간` : "0시간"}
            status={todayFocus?.isCompleted ? "done" : "in-progress"}
            onToggleStatus={() => {
              if (todayFocus) {
                handleToggleDailyPlan(todayFocus.dailyPlanId);
              }
            }}
          />

          <StudySummaryCard
            title="Study Summary"
            totalDays={trackerItems.length}
            completedDays={completedCount}
            currentWeek={todayFocus ? `${todayFocus.weekNumber}주차` : "-"}
            totalHours={`${totalEstimatedHours}시간`}
          />
        </div>

        <div className="h-full w-[calc(100%-340px)] overflow-y-auto pr-2">
          <WeeklyStudyTracker
            title="Weekly Study Tracker"
            items={trackerItems}
            focusedItemId={todayFocus?.dailyPlanId ?? null}
            onToggleStatus={handleToggleDailyPlan}
          />
        </div>
      </div>
    </div>
  );
}

function parseDateParts(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return { year, month, day };
}

function formatDateToMMDD(dateString: string) {
  const { month, day } = parseDateParts(dateString);
  return `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getDayFromDate(dateString: string) {
  const { day } = parseDateParts(dateString);
  return String(day).padStart(2, "0");
}

function getMonthNumberFromDate(dateString: string) {
  const { month } = parseDateParts(dateString);
  return String(month).padStart(2, "0");
}

function getMonthFromDate(dateString: string) {
  const { month } = parseDateParts(dateString);

  const monthNames = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];

  return monthNames[month - 1] ?? "MONTH";
}

function getWeekdayFromDate(dateString: string) {
  const { year, month, day } = parseDateParts(dateString);

  const weekdays = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  const date = new Date(year, month - 1, day);
  return weekdays[date.getDay()] ?? "DAY";
}