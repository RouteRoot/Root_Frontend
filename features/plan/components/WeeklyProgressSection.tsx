"use client";

import { useMemo } from "react";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "REST";

export type PlannerTask = {
  id: number;
  week: number;
  day: number;
  title: string;
  description: string;
  hours: number;
  date: string;
  status: TaskStatus;
};

type WeeklyProgressSectionProps = {
  tasks: PlannerTask[];
  selectedWeek: number;
  onChangeWeek: (week: number) => void;
  isLoading?: boolean;
};

export default function WeeklyProgressSection({
  tasks,
  selectedWeek,
  onChangeWeek,
  isLoading = false,
}: WeeklyProgressSectionProps) {
  const totalWeeks = useMemo(() => {
    const weeks = Array.from(new Set(tasks.map((task) => task.week))).sort(
      (a, b) => a - b
    );
    return weeks;
  }, [tasks]);

  const weeklyTasks = useMemo(
    () => tasks.filter((task) => task.week === selectedWeek),
    [tasks, selectedWeek]
  );

  const totalProgress = useMemo(() => {
    const studyTasks = tasks.filter((task) => task.status !== "REST");
    const doneTasks = studyTasks.filter((task) => task.status === "DONE").length;

    if (!studyTasks.length) return 0;
    return Math.round((doneTasks / studyTasks.length) * 100);
  }, [tasks]);

  const handlePrevWeek = () => {
    onChangeWeek(Math.max(1, selectedWeek - 1));
  };

  const handleNextWeek = () => {
    onChangeWeek(Math.min(totalWeeks.length || 1, selectedWeek + 1));
  };

  if (isLoading) {
    return <p>Loading weekly progress</p>;
  }

  return (
    <>
      <button type="button" onClick={handlePrevWeek} disabled={selectedWeek === 1}>
        Previous week
      </button>
      <select
        value={selectedWeek}
        onChange={(e) => onChangeWeek(Number(e.target.value))}
      >
        {totalWeeks.map((week) => (
          <option key={week} value={week}>
            Week {week}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleNextWeek}
        disabled={selectedWeek === totalWeeks.length}
      >
        Next week
      </button>
      <pre>
        {JSON.stringify(
          { tasks, selectedWeek, totalWeeks, weeklyTasks, totalProgress },
          null,
          2
        )}
      </pre>
    </>
  );
}
