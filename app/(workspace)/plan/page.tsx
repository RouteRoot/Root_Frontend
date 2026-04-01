"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TodayFocusCard from "@/components/plan/todayPlannerCard";
import StudySummaryCard from "@/components/plan/StudySummaryCard";
import WeeklyStudyTracker, {
  type StudyItem,
} from "@/components/plan/weekliyStudyPlanner";
import {
  getPlanByExamTaskId,
  checkDailyPlan,
  getPlanTabs,
} from "@/app/api/plan/plan";
import type { PlanResponse, PlanTab } from "@/app/api/plan/types";

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
  const [tabs, setTabs] = useState<PlanTab[]>([]);
  const [selectedExamTaskId, setSelectedExamTaskId] = useState<number | null>(
    null
  );
  const [plan, setPlan] = useState<PlanResponse | null>(null);

  const [tabsLoading, setTabsLoading] = useState(true);
  const [planLoading, setPlanLoading] = useState(false);
  const [error, setError] = useState("");

  const tabRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  useEffect(() => {
    const fetchTabs = async () => {
      try {
        setTabsLoading(true);
        setError("");

        const tabData = await getPlanTabs();
        setTabs(tabData);

        if (tabData.length === 0) {
          setSelectedExamTaskId(null);
          setPlan(null);
          return;
        }

        const savedExamTaskId = localStorage.getItem("examTaskId");
        const savedId = savedExamTaskId ? Number(savedExamTaskId) : null;

        const matchedTab = savedId
          ? tabData.find((tab) => tab.examTaskId === savedId)
          : null;

        setSelectedExamTaskId(
          matchedTab ? matchedTab.examTaskId : tabData[0].examTaskId
        );
      } catch (error) {
        console.error("플랜 탭 조회 실패:", error);
        setError("플랜 탭을 불러오지 못했습니다.");
      } finally {
        setTabsLoading(false);
      }
    };

    fetchTabs();
  }, []);

  useEffect(() => {
    const fetchPlan = async () => {
      if (selectedExamTaskId === null) return;

      try {
        setPlanLoading(true);
        setError("");

        const response = await getPlanByExamTaskId(selectedExamTaskId);
        setPlan(response);
        localStorage.setItem("examTaskId", String(selectedExamTaskId));
      } catch (error) {
        console.error("플랜 조회 실패:", error);
        setError("플랜을 불러오지 못했습니다.");
      } finally {
        setPlanLoading(false);
      }
    };

    fetchPlan();
  }, [selectedExamTaskId]);

  useEffect(() => {
    if (selectedExamTaskId === null) return;

    const activeTab = tabRefs.current[selectedExamTaskId];
    activeTab?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [selectedExamTaskId]);

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

  if (tabsLoading) {
    return <div className="px-5 pt-5"></div>;
  }

  if (error) {
    return <div className="px-5 pt-5 text-red-500">{error}</div>;
  }

  if (tabs.length === 0) {
    return <div className="px-5 pt-5">생성된 플랜이 없습니다. 로드맵 페이지에서 새로운 플랜을 생성해보세요.</div>;
  }

  return (
    <div className="px-5 pb-8">
      <h1>
       <div className="text-2xl font-bold mb-10">AI Planner</div>
      </h1>
      <div className="mb-6 border-b border-neutral-200">
        <div className="flex gap-5 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = tab.examTaskId === selectedExamTaskId;

            return (
              <button
                key={tab.examTaskId}
                ref={(el) => {
                  tabRefs.current[tab.examTaskId] = el;
                }}
                type="button"
                onClick={() => setSelectedExamTaskId(tab.examTaskId)}
                className={`relative shrink-0 pb-3 text-sm font-bold transition-colors duration-300 ${
                  isActive
                    ? "text-black"
                    : "text-neutral-400 hover:text-black"
                }`}
              >
                {tab.taskName}

                {isActive && (
                  <motion.span
                    layoutId="active-tab-underline"
                    className="absolute bottom-0 left-0 h-[2px] w-full bg-black"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 32,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {planLoading || !plan ? (
        <div className="pt-4"></div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedExamTaskId}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="grid h-[calc(100vh-1210px)] grid-cols-[310px_minmax(0,1fr)] gap-7"
          >
            <motion.div
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="sticky top-0 flex h-fit flex-col gap-6 self-start"
            >
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <TodayFocusCard
                  day={todayFocus ? getDayFromDate(todayFocus.studyDate) : "00"}
                  month={
                    todayFocus ? getMonthFromDate(todayFocus.studyDate) : "MONTH"
                  }
                  monthNumber={
                    todayFocus
                      ? getMonthNumberFromDate(todayFocus.studyDate)
                      : "00"
                  }
                  weekday={
                    todayFocus ? getWeekdayFromDate(todayFocus.studyDate) : "DAY"
                  }
                  sectionTitle="Today's Focus"
                  weekLabel={todayFocus ? `${todayFocus.weekNumber}주차` : "1주차"}
                  dayLabel={todayFocus ? `${todayFocus.dayNumber}DAY` : "1DAY"}
                  subject={todayFocus?.topic ?? "오늘의 학습이 없습니다"}
                  description={
                    todayFocus?.description ?? "새로운 학습 계획을 생성해보세요."
                  }
                  hours={
                    todayFocus ? `${todayFocus.estimatedHours}시간` : "0시간"
                  }
                  status={todayFocus?.isCompleted ? "done" : "in-progress"}
                  onToggleStatus={() => {
                    if (todayFocus) {
                      handleToggleDailyPlan(todayFocus.dailyPlanId);
                    }
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06, duration: 0.35, ease: "easeOut" }}
                whileHover={{ y: -2 }}
              >
                <StudySummaryCard
                  title="Study Summary"
                  totalDays={trackerItems.length}
                  completedDays={completedCount}
                  currentWeek={todayFocus ? `${todayFocus.weekNumber}주차` : "-"}
                  totalHours={`${totalEstimatedHours}시간`}
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="min-w-0 overflow-y-auto pr-1 scrollbar-hide"
            >
              <WeeklyStudyTracker
                title={plan.taskName}
                items={trackerItems}
                focusedItemId={todayFocus?.dailyPlanId ?? null}
                onToggleStatus={handleToggleDailyPlan}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
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