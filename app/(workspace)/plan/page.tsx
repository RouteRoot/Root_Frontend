"use client";

import { useEffect, useMemo, useState } from "react";
import PlanTabs from "@/components/plan/PlanTabs";
import WeeklyProgressSection, {
  PlannerTask,
  TaskStatus,
} from "@/components/plan/WeeklyProgressSection";
import DailyPlanSection, {
  DailyPlanSectionItem,
} from "@/components/plan/DailyPlanSection";
import ConfirmModal from "@/components/common/ConfirmModal";
import {
  getPlanTabs,
  getPlanByExamTaskId,
  checkDailyPlan,
} from "@/app/api/plan/plan";
import type { PlanResponse, PlanTab } from "@/app/api/plan/types";

function getTodayInSeoulString(): string {
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(new Date()).replace(/-/g, ".");
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

  if (/^\d{4}\.\d{2}\.\d{2}$/.test(studyDate)) {
    return studyDate;
  }

  return studyDate;
}

function mapDailyPlanStatus(
  isCompleted: boolean,
  isRest: boolean,
  formattedDate: string
): TaskStatus {
  if (isRest) return "REST";
  if (isCompleted) return "DONE";

  const todayInSeoul = getTodayInSeoulString();
  if (formattedDate === todayInSeoul) return "IN_PROGRESS";

  return "TODO";
}

function findWeekContainingToday(plan: PlanResponse | null): number {
  if (!plan) return 1;

  const todayInSeoul = getTodayInSeoulString();

  for (const weeklyPlan of plan.weeklyPlans) {
    const hasToday = weeklyPlan.dailyPlans.some(
      (dailyPlan) => formatStudyDate(dailyPlan.studyDate) === todayInSeoul
    );

    if (hasToday) {
      return weeklyPlan.weekNumber;
    }
  }

  return 1;
}

function mapPlanToPlannerTasks(plan: PlanResponse | null): PlannerTask[] {
  if (!plan) return [];

  return plan.weeklyPlans
    .flatMap((weeklyPlan) =>
      weeklyPlan.dailyPlans.map((dailyPlan) => {
        const formattedDate = formatStudyDate(dailyPlan.studyDate);

        return {
          id: dailyPlan.dailyPlanId,
          week: weeklyPlan.weekNumber,
          day: dailyPlan.dayNumber,
          title: dailyPlan.topic || (dailyPlan.isRest ? "휴식일" : plan.taskName),
          description:
            dailyPlan.description ||
            (dailyPlan.isRest
              ? "가볍게 쉬어가며 학습 리듬을 정리하는 날입니다."
              : ""),
          hours: dailyPlan.estimatedHours,
          date: formattedDate,
          status: mapDailyPlanStatus(
            dailyPlan.isCompleted,
            dailyPlan.isRest,
            formattedDate
          ),
        };
      })
    )
    .sort((a, b) => {
      if (a.week !== b.week) return a.week - b.week;
      return a.day - b.day;
    });
}

function getExamDateFromPlan(plan: PlanResponse | null): string {
  if (!plan) return "2026.04.22";

  const allDates = plan.weeklyPlans
    .flatMap((weeklyPlan) => weeklyPlan.dailyPlans)
    .map((dailyPlan) => formatStudyDate(dailyPlan.studyDate))
    .filter((date) => date !== "-")
    .sort();

  return allDates[allDates.length - 1] ?? "2026.04.22";
}

function mapTaskToDailyPlanItem(
  task: PlannerTask | null,
  plan: PlanResponse | null,
  examDate: string
): DailyPlanSectionItem | null {
  if (!task) return null;

  const matchedDailyPlan = plan?.weeklyPlans
    .flatMap((weeklyPlan) => weeklyPlan.dailyPlans)
    .find((dailyPlan) => dailyPlan.dailyPlanId === task.id);

  return {
    id: task.id,
    week: task.week,
    day: task.day,
    title: task.title,
    description: task.description,
    date: task.date,
    hours: task.hours,
    examDate,
    isCompleted: matchedDailyPlan?.isCompleted ?? false,
  };
}

export default function PlannerPage() {
  const [tabs, setTabs] = useState<PlanTab[]>([]);
  const [selectedExamTaskId, setSelectedExamTaskId] = useState<number | null>(
    null
  );
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const [tabsLoading, setTabsLoading] = useState(true);
  const [planLoading, setPlanLoading] = useState(false);
  const [error, setError] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDailyPlanId, setPendingDailyPlanId] = useState<number | null>(
    null
  );
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    const fetchTabs = async () => {
      try {
        setTabsLoading(true);
        setError("");

        const data = await getPlanTabs();
        setTabs(data);

        if (data.length > 0) {
          setSelectedExamTaskId(data[0].examTaskId);
        } else {
          setSelectedExamTaskId(null);
          setPlan(null);
          setSelectedTaskId(null);
        }
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
    if (selectedExamTaskId == null) return;

    const fetchPlan = async () => {
      try {
        setPlanLoading(true);
        setError("");

        const data = await getPlanByExamTaskId(selectedExamTaskId);
        setPlan(data);

        const todayWeek = findWeekContainingToday(data);
        setSelectedWeek(todayWeek);

        const mappedTasks = mapPlanToPlannerTasks(data);
        const todayInSeoul = getTodayInSeoulString();

        const todayTask =
          mappedTasks.find((task) => task.date === todayInSeoul) ??
          mappedTasks.find((task) => task.week === todayWeek) ??
          mappedTasks[0] ??
          null;

        setSelectedTaskId(todayTask?.id ?? null);
      } catch (error) {
        console.error("플랜 상세 조회 실패:", error);
        setError("플랜 정보를 불러오지 못했습니다.");
        setPlan(null);
        setSelectedTaskId(null);
      } finally {
        setPlanLoading(false);
      }
    };

    fetchPlan();
  }, [selectedExamTaskId]);

  const plannerTasks = useMemo(() => mapPlanToPlannerTasks(plan), [plan]);
  const examDate = useMemo(() => getExamDateFromPlan(plan), [plan]);

  const selectedDailyPlan = useMemo(() => {
    const task =
      plannerTasks.find((item) => item.id === selectedTaskId) ??
      plannerTasks.find((item) => item.week === selectedWeek) ??
      plannerTasks[0] ??
      null;

    return mapTaskToDailyPlanItem(task, plan, examDate);
  }, [plannerTasks, selectedTaskId, selectedWeek, plan, examDate]);

  const pendingTask = useMemo(() => {
    if (pendingDailyPlanId == null) return null;
    return plannerTasks.find((task) => task.id === pendingDailyPlanId) ?? null;
  }, [plannerTasks, pendingDailyPlanId]);

  const pendingDailyPlan = useMemo(() => {
    if (pendingDailyPlanId == null || !plan) return null;

    return (
      plan.weeklyPlans
        .flatMap((weeklyPlan) => weeklyPlan.dailyPlans)
        .find((dailyPlan) => dailyPlan.dailyPlanId === pendingDailyPlanId) ??
      null
    );
  }, [plan, pendingDailyPlanId]);

  const hasTabs = tabs.length > 0;
  const hasPlan = !!plan;

  const openCompleteModal = (dailyPlanId: number) => {
    setPendingDailyPlanId(dailyPlanId);
    setConfirmOpen(true);
  };

  const closeCompleteModal = () => {
    if (confirmLoading) return;
    setConfirmOpen(false);
    setPendingDailyPlanId(null);
  };

  const handleConfirmComplete = async () => {
    if (pendingDailyPlanId == null) return;

    try {
      setConfirmLoading(true);

      const res = await checkDailyPlan(pendingDailyPlanId);

      setPlan((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          weeklyPlans: prev.weeklyPlans.map((week) => ({
            ...week,
            dailyPlans: week.dailyPlans.map((day) =>
              day.dailyPlanId === pendingDailyPlanId
                ? {
                    ...day,
                    isCompleted: res.isCompleted,
                  }
                : day
            ),
          })),
        };
      });

      setConfirmOpen(false);
      setPendingDailyPlanId(null);

      window.alert(
        res.isCompleted ? "완료 처리되었습니다." : "완료가 해제되었습니다."
      );
    } catch (e) {
      console.error("완료 처리 실패", e);
      window.alert("완료 처리 중 오류가 발생했습니다.");
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pb-14 sm:px-6 lg:px-0">
      <div className="mx-auto max-w-[1600px]">
        <section className="mb-8">
          <PlanTabs
            tabs={tabs}
            selectedExamTaskId={selectedExamTaskId}
            onSelect={setSelectedExamTaskId}
            isLoading={tabsLoading}
          />
        </section>

        {error && (
          <div className="mb-6 rounded-[20px] border border-[#F2D6DA] bg-[#FFF8F8] px-5 py-4 text-[14px] font-medium text-[#B42318]">
            {error}
          </div>
        )}

        {!tabsLoading && !hasTabs && (
          <div className="rounded-[28px] border border-[#E8EDF5] bg-white px-8 py-12 text-center">
            <p className="text-[18px] font-bold text-[#0B1B3B]">
              아직 생성된 플랜이 없습니다.
            </p>
            <p className="mt-2 text-[14px] text-[#94A3B8]">
              로드맵에서 자격증 플랜을 먼저 생성해 주세요.
            </p>
          </div>
        )}

        {(planLoading || (hasTabs && !hasPlan)) && (
          <>
            <section className="mb-10">
              <DailyPlanSection plan={null} />
            </section>

            <WeeklyProgressSection
              tasks={[]}
              selectedWeek={selectedWeek}
              onChangeWeek={setSelectedWeek}
              isLoading={true}
            />
          </>
        )}

        {!planLoading && hasPlan && (
          <>
            <section className="mb-10">
              <DailyPlanSection
                plan={selectedDailyPlan}
                onToggleComplete={openCompleteModal}
              />
            </section>

            <WeeklyProgressSection
              tasks={plannerTasks}
              selectedWeek={selectedWeek}
              onChangeWeek={setSelectedWeek}
              isLoading={false}
            //   selectedTaskId={selectedTaskId}
            //   onSelectTask={setSelectedTaskId}
            />
          </>
        )}
      </div>

      <ConfirmModal
        open={confirmOpen}
        title={
          pendingDailyPlan?.isCompleted ? "학습 완료 해제" : "학습 완료 처리"
        }
        description={
          pendingTask
            ? `Week ${pendingTask.week} / Day ${pendingTask.day} 학습을 ${
                pendingDailyPlan?.isCompleted ? "완료 해제" : "완료 처리"
              }할까요?`
            : pendingDailyPlan?.isCompleted
            ? "이 계획의 완료 상태를 해제할까요?"
            : "이 계획을 완료 처리할까요?"
        }
        confirmText={pendingDailyPlan?.isCompleted ? "해제하기" : "완료하기"}
        cancelText="취소"
        loading={confirmLoading}
        onConfirm={handleConfirmComplete}
        onCancel={closeCompleteModal}
      />
    </main>
  );
}