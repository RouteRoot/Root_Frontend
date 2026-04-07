"use client";

import { useMemo } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "REST";

export type PlannerTask = {
  id: number;
  week: number;
  day: number;
  title: string;
  description: string;
  hours: number;
  date: string; // 예: 2026.04.03
  status: TaskStatus;
};

type WeeklyProgressSectionProps = {
  tasks: PlannerTask[];
  selectedWeek: number;
  onChangeWeek: (week: number) => void;
  isLoading?: boolean;
};

function getStatusDot(status: TaskStatus) {
  switch (status) {
    case "TODO":
      return "bg-[#C9D2E3]";
    case "IN_PROGRESS":
      return "bg-[#6D5DF6]";
    case "DONE":
      return "bg-[#8FA3BF]";
    case "REST":
      return "bg-[#E8DCC6]";
    default:
      return "bg-[#C9D2E3]";
  }
}

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
    onChangeWeek(Math.min(totalWeeks.length, selectedWeek + 1));
  };

  if (isLoading) {
    return (
      <section className="mt-16 w-full">
        <div className="mb-4 flex items-center gap-5">
          <div className="h-9 w-[260px] animate-pulse rounded bg-[#EEF2F7]" />
          <div className="hidden h-px flex-1 bg-[#EEF2F7] md:block" />
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-5">
          <div className="h-4 w-[56px] animate-pulse rounded bg-[#EEF2F7]" />
          <div className="h-4 w-[56px] animate-pulse rounded bg-[#EEF2F7]" />
          <div className="h-4 w-[56px] animate-pulse rounded bg-[#EEF2F7]" />
          <div className="h-4 w-[56px] animate-pulse rounded bg-[#EEF2F7]" />
        </div>

        <div className="overflow-hidden rounded-[30px] border border-[#E8EDF5] bg-white">
          <div className="flex flex-col gap-4 border-b border-[#EEF2F7] bg-[#FBFCFE] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="h-3 w-[120px] animate-pulse rounded bg-[#EEF2F7]" />
              <div className="h-5 w-[160px] animate-pulse rounded bg-[#EEF2F7]" />
              <div className="h-4 w-[220px] animate-pulse rounded bg-[#EEF2F7]" />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded-full bg-[#EEF2F7]" />
              <div className="h-10 w-[120px] animate-pulse rounded-full bg-[#EEF2F7]" />
              <div className="h-10 w-10 animate-pulse rounded-full bg-[#EEF2F7]" />
              <div className="h-10 w-[140px] animate-pulse rounded-full bg-[#EEF2F7]" />
              <div className="h-10 w-[140px] animate-pulse rounded-full bg-[#EEF2F7]" />
            </div>
          </div>

          <div
            className="grid min-w-[1120px]"
            style={{ gridTemplateColumns: "180px 1fr" }}
          >
            <div className="border-r border-[#EEF2F7] bg-[#FBFCFE]">
              <div className="flex h-[48px] items-center px-6">
                <div className="h-3 w-[70px] animate-pulse rounded bg-[#EEF2F7]" />
              </div>

              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`flex min-h-[74px] items-center px-6 py-3 ${
                    i !== 1 ? "border-t border-[#EEF2F7]" : ""
                  }`}
                >
                  <div className="space-y-2">
                    <div className="h-4 w-[60px] animate-pulse rounded bg-[#EEF2F7]" />
                    <div className="h-3 w-[50px] animate-pulse rounded bg-[#EEF2F7]" />
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="grid h-[48px] grid-cols-[minmax(0,1fr)_148px_96px] bg-[#FBFCFE]">
                <div className="flex items-center px-6">
                  <div className="h-3 w-[120px] animate-pulse rounded bg-[#EEF2F7]" />
                </div>
                <div className="flex items-center justify-center border-l border-[#EEF2F7]">
                  <div className="h-3 w-[30px] animate-pulse rounded bg-[#EEF2F7]" />
                </div>
                <div className="flex items-center justify-center border-l border-[#EEF2F7]">
                  <div className="h-3 w-[30px] animate-pulse rounded bg-[#EEF2F7]" />
                </div>
              </div>

              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`grid min-h-[74px] grid-cols-[minmax(0,1fr)_148px_96px] ${
                    i !== 1 ? "border-t border-[#EEF2F7]" : ""
                  }`}
                >
                  <div className="flex items-center px-6 py-3">
                    <div className="w-full space-y-2">
                      <div className="h-4 w-[220px] animate-pulse rounded bg-[#EEF2F7]" />
                      <div className="h-3 w-[320px] animate-pulse rounded bg-[#EEF2F7]" />
                    </div>
                  </div>

                  <div className="flex items-center justify-center border-l border-[#EEF2F7]">
                    <div className="h-4 w-[90px] animate-pulse rounded bg-[#EEF2F7]" />
                  </div>

                  <div className="flex items-center justify-center border-l border-[#EEF2F7]">
                    <div className="h-4 w-[40px] animate-pulse rounded bg-[#EEF2F7]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16 w-full">
      <div className="mb-4 flex items-center gap-5">
        <h2 className="shrink-0 text-[28px] font-extrabold leading-none tracking-[-0.04em] text-[#0B1B3B] sm:text-[28px]">
          WEEKLY PROGRESS
        </h2>
        <div className="hidden h-px min-w-[160px] flex-1 bg-[#E9EDF3] md:block" />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-5 text-[11px] font-medium text-[#94A3B8]">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#C9D2E3]" />
          <span>시작 전</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#6D5DF6]" />
          <span>진행 중</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#8FA3BF]" />
          <span>완료</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#E8DCC6]" />
          <span>휴식일</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-[30px] border border-[#E8EDF5] bg-white">
        <div className="flex flex-col gap-4 border-b border-[#EEF2F7] bg-[#FBFCFE] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold text-[#A0AEC0]">
              현재 주차 학습 흐름
            </p>
            <p className="mt-2 text-[15px] font-bold text-[#0B1B3B]">
              {selectedWeek}주차 진행 현황
            </p>
            <p className="mt-1 text-[13px] text-[#94A3B8]">
              총 {totalWeeks.length}주 중 현재 선택한 주차의 계획입니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handlePrevWeek}
              disabled={selectedWeek === 1}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E7EBF2] bg-white text-[#111827] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="relative">
              <select
                value={selectedWeek}
                onChange={(e) => onChangeWeek(Number(e.target.value))}
                className="h-10 appearance-none rounded-full border border-[#E7EBF2] bg-white pl-4 pr-10 text-[13px] font-semibold text-[#111827] outline-none transition focus:border-[#6D5DF6]"
              >
                {totalWeeks.map((week) => (
                  <option key={week} value={week}>
                    Week {week}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
            </div>

            <button
              type="button"
              onClick={handleNextWeek}
              disabled={selectedWeek === totalWeeks.length}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E7EBF2] bg-white text-[#111827] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="rounded-full border border-[#E7EBF2] bg-white px-4 py-2 text-[12px] font-semibold text-[#7C8BA1]">
              현재 {selectedWeek}주차 / 전체 {totalWeeks.length}주
            </div>

            <div className="rounded-full bg-[#F5F2FF] px-4 py-2 text-[12px] font-semibold text-[#6D5DF6]">
              전체 과정 진행률 {totalProgress}%
            </div>
          </div>
        </div>

        <div
          className="grid min-w-[1120px]"
          style={{ gridTemplateColumns: "180px 1fr" }}
        >
          <div className="border-r border-[#EEF2F7] bg-[#FBFCFE]">
            <div className="flex h-[48px] items-center px-6 text-[11px] font-semibold text-[#A0AEC0]">
              주차 / Day
            </div>

            {weeklyTasks.map((task, index) => (
              <div
                key={task.id}
                className={`flex min-h-[74px] items-center px-6 py-3 ${
                  index !== 0 ? "border-t border-[#EEF2F7]" : ""
                }`}
              >
                <div>
                  <p className="text-[14px] font-bold text-[#0F172A]">
                    Day {task.day}
                  </p>
                  <p className="mt-1 text-[12px] text-[#94A3B8]">
                    Week {task.week}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="grid h-[48px] grid-cols-[minmax(0,1fr)_148px_96px] bg-[#FBFCFE] text-[11px] font-semibold text-[#A0AEC0]">
              <div className="flex items-center px-6">선택한 주차 학습 계획</div>
              <div className="flex items-center justify-center border-l border-[#EEF2F7]">
                날짜
              </div>
              <div className="flex items-center justify-center border-l border-[#EEF2F7]">
                시간
              </div>
            </div>

            {weeklyTasks.map((task, index) => (
              <div
                key={task.id}
                className={`grid min-h-[74px] grid-cols-[minmax(0,1fr)_148px_96px] ${
                  index !== 0 ? "border-t border-[#EEF2F7]" : ""
                }`}
              >
                <div className="flex min-w-0 items-center px-6 py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${getStatusDot(
                          task.status
                        )}`}
                      />
                      <p className="truncate text-[15px] font-bold text-[#0F172A]">
                        {task.title}
                      </p>
                    </div>

                    <p className="mt-1 truncate text-[13px] text-[#7B8798]">
                      {task.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center border-l border-[#EEF2F7] px-4 py-3 text-[13px] font-medium text-[#7C8BA1]">
                  {task.date}
                </div>

                <div className="flex items-center justify-center border-l border-[#EEF2F7] px-4 py-3 text-[13px] font-medium text-[#7C8BA1]">
                  {task.status === "REST" ? "-" : `${task.hours}시간`}
                </div>
              </div>
            ))}

            {weeklyTasks.length === 0 && (
              <div className="px-6 py-10 text-center text-[14px] text-[#94A3B8]">
                선택한 주차에 해당하는 학습 계획이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}