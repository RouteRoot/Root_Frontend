"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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
  onMovePlan?: (task: PlannerTask) => void;
  isLoading?: boolean;
};

function getStatusDot(status: TaskStatus) {
  switch (status) {
    case "TODO":
      return "border border-[#A9B7CA] bg-white";
    case "IN_PROGRESS":
      return "bg-[#4876EF]";
    case "DONE":
      return "bg-[#C9D2E3]";
    case "REST":
      return "bg-[#E8DCC6]";
    default:
      return "bg-[#000000]";
  }
}

export default function WeeklyProgressSection({
  tasks,
  selectedWeek,
  onChangeWeek,
  onMovePlan,
  isLoading = false,
}: WeeklyProgressSectionProps) {
  const [moveMode, setMoveMode] = useState(false);
  const totalWeeks = useMemo(() => {
    return Array.from(new Set(tasks.map((task) => task.week))).sort(
      (a, b) => a - b
    );
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

        <div className="overflow-hidden rounded-[30px] border border-[#E8EDF5] bg-white">
          <div className="h-[180px] animate-pulse bg-[#FBFCFE]" />
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16 w-full">
      <div className="mb-4 flex items-center gap-5">
        <h2 className="shrink-0 text-[19px] font-semibold leading-none tracking-[-0.04em] text-[#333333] mb-4">
          주간 플랜
        </h2>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-5 text-[11px] font-medium text-[#94A3B8]">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full border border-[#A9B7CA] bg-white" />
          <span>진행 예정</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#4876EF]" />
          <span>진행 중</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#C9D2E3]" />
          <span>학습 완료</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#E8DCC6]" />
          <span>휴식일</span>
        </div>
        </div>

        {onMovePlan && (
          <button
            type="button"
            onClick={() => setMoveMode((prev) => !prev)}
            className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[12px] font-semibold transition ${
              moveMode
                ? "border-[#4876EF] bg-[#F5F8FF] text-[#4876EF]"
                : "border-[#DDE5F0] bg-white text-[#667085] hover:border-[#BFD0F8] hover:text-[#4876EF]"
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            {moveMode ? "설정 모드 종료" : "일정 설정"}
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-[30px] border border-[#E8EDF5] bg-white">
        <div className="flex flex-col gap-4 border-b border-[#EEF2F7] bg-[#FBFCFE] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold text-[#A0AEC0]">
              현재 주차 학습 흐름
            </p>
            <p className="mt-2 text-[15px] font-bold text-[#333333]">
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
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E7EBF2] bg-white text-[#333333] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="relative">
              <select
                value={selectedWeek}
                onChange={(e) => onChangeWeek(Number(e.target.value))}
                className="h-10 appearance-none rounded-full border border-[#E7EBF2] bg-white pl-4 pr-10 text-[13px] font-semibold text-[#333333] outline-none transition focus:border-[#4876EF]"
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
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E7EBF2] bg-white text-[#333333] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="rounded-full border border-[#E7EBF2] bg-white px-4 py-2 text-[12px] font-semibold text-[#7C8BA1]">
              현재 {selectedWeek}주차 / 전체 {totalWeeks.length}주
            </div>

            <div className="rounded-full border border-[#E7EBF2] bg-[#f2f7ff] px-4 py-2 text-[12px] font-semibold text-[#0075c3]">
              전체 과정 진행률 {totalProgress}%
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <div className="min-w-[980px]">
            {/* 헤더 */}
            <div className="grid grid-cols-[170px_minmax(0,1fr)_136px_86px] bg-[#FBFCFE] text-[11px] font-semibold text-[#A0AEC0]">
              <div className="flex h-[48px] items-center border-r border-[#EEF2F7] px-6">
                주차 / Day
              </div>
              <div className="flex h-[48px] items-center px-6">
                선택한 주차 학습 계획
              </div>
              <div className="flex h-[48px] items-center justify-center border-l border-[#EEF2F7]">
                예정 학습일
              </div>
              <div className="flex h-[48px] items-center justify-center border-l border-[#EEF2F7]">
                시간
              </div>
            </div>

            {/* 행 */}
            {weeklyTasks.map((task, index) => (
              <div
                key={task.id}
                className={`grid grid-cols-[170px_minmax(0,1fr)_136px_86px] ${
                  index !== 0 ? "border-t border-[#EEF2F7]" : ""
                }`}
              >
                {/* Day */}
                <div className="flex min-h-[116px] items-center border-r border-[#EEF2F7] bg-[#FBFCFE] px-6 py-5">
                  <div>
                    <p className="text-[14px] font-bold text-[#333333]">
                      Day {task.day}
                    </p>
                    <p className="mt-1 text-[12px] text-[#94A3B8]">
                      Week {task.week}
                    </p>
                  </div>
                </div>

                {/* 설명 */}
                <div className="flex min-h-[116px] min-w-0 items-center px-6 py-5">
                  <div className="min-w-0">
                    <div className="flex items-start gap-2">
                      <span
                        className={`mt-[6px] h-2.5 w-2.5 shrink-0 rounded-full ${getStatusDot(
                          task.status
                        )}`}
                      />

                      <div className="min-w-0">
                        <p className={`text-[15px] font-bold leading-[1.45] break-keep ${task.status === "DONE" ? "text-[#C9D2E3]" : "text-[#333333]"}`}>
                          {task.title}
                        </p>

                        <p
                          className={`mt-2 text-[13px] leading-[1.7] break-keep ${
                            task.status === "DONE"
                              ? "text-[#C9D2E3]"
                              : "text-[#7B8798]"
                          }`}
                        >
                          {task.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 날짜 */}
                <div className="flex min-h-[116px] items-center justify-center border-l border-[#EEF2F7] px-3 py-5 text-[13px] font-medium text-[#7C8BA1]">
                  <div className="flex items-center gap-2">
                    <span>{task.date}</span>
                    {moveMode && task.status !== "REST" && onMovePlan && (
                      <button
                        type="button"
                        onClick={() => onMovePlan(task)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#D8E4FF] bg-[#F5F8FF] text-[#4876EF] transition hover:bg-[#EAF0FF]"
                        aria-label={`${task.title} 일정 설정`}
                      >
                        <CalendarDays className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 시간 */}
                <div className="flex min-h-[116px] items-center justify-center border-l border-[#EEF2F7] px-3 py-5 text-[13px] font-medium text-[#7C8BA1]">
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
