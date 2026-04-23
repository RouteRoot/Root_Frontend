"use client";

import { useEffect, useMemo, useState } from "react";
import PlanTabs from "@/features/plan/components/PlanTabs";
import WeeklyProgressSection, {
  PlannerTask,
  TaskStatus,
} from "@/features/plan/components/WeeklyProgressSection";
import DailyPlanSection, {
  DailyPlanSectionItem,
} from "@/features/plan/components/DailyPlanSection";
import ConfirmModal from "@/shared/components/common/ConfirmModal";
import {
  getPlanTabs,
  getPlanByExamTaskId,
  checkDailyPlan,
  deletePlan,
} from "@/features/plan/api/plan";
import type { PlanResponse, PlanTab } from "@/features/plan/types";

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
          title: dailyPlan.topic || (dailyPlan.isRest ? "Rest" : plan.taskName),
          description:
            dailyPlan.description ||
            (dailyPlan.isRest ? "Rest day" : ""),
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
        console.error("Failed to load plan tabs:", error);
        setError("Failed to load plans.");
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
        console.error("Failed to load plan detail:", error);
        setError("Failed to load plan detail.");
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
      window.alert(res.isCompleted ? "Completed" : "Completion removed");
    } catch (e) {
      console.error("Failed to toggle completion", e);
      window.alert("Failed to toggle completion.");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleDeletePlan = async (examTaskId: number) => {
    try {
      await deletePlan(examTaskId);
      const updatedTabs = await getPlanTabs();
      setTabs(updatedTabs);

      if (updatedTabs.length > 0) {
        const nextId = updatedTabs[0].examTaskId;
        setSelectedExamTaskId(nextId);

        const nextPlan = await getPlanByExamTaskId(nextId);
        setPlan(nextPlan);
      } else {
        setSelectedExamTaskId(null);
        setPlan(null);
      }
    } catch (error) {
      console.error("Failed to delete plan:", error);
    }
  };

  const handleRegeneratePlan = async (examTaskId: number) => {
    console.log("Regenerate clicked:", examTaskId);
  };

  return (
    <>
      <PlanTabs
        tabs={tabs}
        selectedExamTaskId={selectedExamTaskId}
        onSelect={setSelectedExamTaskId}
        onDeletePlan={handleDeletePlan}
        onRegeneratePlan={handleRegeneratePlan}
        isLoading={tabsLoading}
      />
      {error && <p>{error}</p>}
      {!tabsLoading && !hasTabs && <p>No plans</p>}
      {(planLoading || (hasTabs && !hasPlan)) && (
        <>
          <DailyPlanSection plan={null} />
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
          <DailyPlanSection
            plan={selectedDailyPlan}
            onToggleComplete={openCompleteModal}
          />
          <WeeklyProgressSection
            tasks={plannerTasks}
            selectedWeek={selectedWeek}
            onChangeWeek={setSelectedWeek}
            isLoading={false}
          />
        </>
      )}
      <ConfirmModal
        open={confirmOpen}
        title={pendingDailyPlan?.isCompleted ? "Undo complete" : "Complete"}
        description={
          pendingTask
            ? `Week ${pendingTask.week} / Day ${pendingTask.day}`
            : "Confirm"
        }
        confirmText={pendingDailyPlan?.isCompleted ? "Undo" : "Complete"}
        cancelText="Cancel"
        loading={confirmLoading}
        onConfirm={handleConfirmComplete}
        onCancel={closeCompleteModal}
      />
      <pre>
        {JSON.stringify(
          {
            tabs,
            selectedExamTaskId,
            plan,
            selectedWeek,
            selectedTaskId,
            tabsLoading,
            planLoading,
            error,
            confirmOpen,
            pendingDailyPlanId,
            confirmLoading,
            plannerTasks,
            selectedDailyPlan,
          },
          null,
          2
        )}
      </pre>
    </>
  );
}
