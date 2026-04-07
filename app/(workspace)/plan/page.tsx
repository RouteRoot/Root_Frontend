"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  Clock3,
  CalendarDays,
  Circle,
  CheckCircle2,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

type PlannerTask = {
  id: number;
  week: number;
  day: number;
  title: string;
  description: string;
  hours: number;
  status: TaskStatus;
};

const mockTasks: PlannerTask[] = [
  {
    id: 1,
    week: 1,
    day: 1,
    title: "정보처리산업기사 핵심 개념 정리",
    description:
      "운영체제와 데이터베이스 기본 개념을 정리하고, 자주 출제되는 핵심 키워드를 중심으로 학습합니다.",
    hours: 2,
    status: "DONE",
  },
  {
    id: 2,
    week: 1,
    day: 2,
    title: "기출 문제 풀이",
    description:
      "이전 회차 기출문제를 풀어보며 문제 유형을 익히고 취약한 개념을 체크합니다.",
    hours: 3,
    status: "IN_PROGRESS",
  },
  {
    id: 3,
    week: 1,
    day: 3,
    title: "SQL 기본 문법 복습",
    description:
      "SELECT, WHERE, GROUP BY, HAVING 등 핵심 SQL 문법을 다시 정리하고 간단한 예제를 풀어봅니다.",
    hours: 2,
    status: "TODO",
  },
  {
    id: 4,
    week: 2,
    day: 1,
    title: "실전 응용 문제 학습",
    description:
      "JOIN과 서브쿼리 문제를 중심으로 응용 문제 풀이 연습을 진행합니다.",
    hours: 2,
    status: "TODO",
  },
  {
    id: 5,
    week: 2,
    day: 2,
    title: "오답 정리 및 요약 노트 작성",
    description:
      "틀린 문제를 다시 풀고, 헷갈린 개념은 짧은 요약 노트로 정리합니다.",
    hours: 1,
    status: "TODO",
  },
  {
    id: 6,
    week: 3,
    day: 1,
    title: "모의고사 1회 풀이",
    description:
      "시험 시간에 맞춰 모의고사를 풀고 시간 분배와 문제 접근 방식을 점검합니다.",
    hours: 3,
    status: "TODO",
  },
];

function getStatusLabel(status: TaskStatus) {
  switch (status) {
    case "TODO":
      return "시작 전";
    case "IN_PROGRESS":
      return "진행 중";
    case "DONE":
      return "완료";
    default:
      return "";
  }
}

function getStatusDot(status: TaskStatus) {
  switch (status) {
    case "TODO":
      return "bg-[#C9D2E3]";
    case "IN_PROGRESS":
      return "bg-[#6D5DF6]";
    case "DONE":
      return "bg-[#8FA3BF]";
    default:
      return "bg-[#C9D2E3]";
  }
}

function getStatusChip(status: TaskStatus) {
  switch (status) {
    case "TODO":
      return "border border-[#D7DDEA] bg-white text-[#7C8BA1]";
    case "IN_PROGRESS":
      return "border border-[#E4DDFF] bg-[#F5F2FF] text-[#6D5DF6]";
    case "DONE":
      return "border border-[#D7E3F1] bg-[#F7FAFD] text-[#6E87A6]";
    default:
      return "border border-[#D7DDEA] bg-white text-[#7C8BA1]";
  }
}

export default function PlannerPage() {
  const [tasks, setTasks] = useState<PlannerTask[]>(mockTasks);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);

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

  const todayTask =
    tasks.find((task) => task.status === "IN_PROGRESS") ??
    tasks.find((task) => task.status === "TODO") ??
    tasks[0];

  const completedCount = useMemo(
    () => tasks.filter((task) => task.status === "DONE").length,
    [tasks]
  );

  const totalCount = tasks.length;

  const totalHours = useMemo(
    () => tasks.reduce((sum, task) => sum + task.hours, 0),
    [tasks]
  );

  const progressPercent = useMemo(() => {
    if (!totalCount) return 0;
    return Math.round((completedCount / totalCount) * 100);
  }, [completedCount, totalCount]);

  const selectedWeekCompletedCount = useMemo(
    () => weeklyTasks.filter((task) => task.status === "DONE").length,
    [weeklyTasks]
  );

  const selectedWeekProgress = useMemo(() => {
    if (!weeklyTasks.length) return 0;
    return Math.round((selectedWeekCompletedCount / weeklyTasks.length) * 100);
  }, [selectedWeekCompletedCount, weeklyTasks]);

  const handleToggleStatus = (id: number) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;

        if (task.status === "TODO") {
          return { ...task, status: "IN_PROGRESS" };
        }

        if (task.status === "IN_PROGRESS") {
          return { ...task, status: "DONE" };
        }

        return task;
      })
    );
  };

  const handlePrevWeek = () => {
    setSelectedWeek((prev) => Math.max(1, prev - 1));
  };

  const handleNextWeek = () => {
    setSelectedWeek((prev) => Math.min(totalWeeks.length, prev + 1));
  };

  return (
    <main className="min-h-screen bg-white px-4 pb-14 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        {/* TODAY PLAN */}
        <section className="w-full">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-5">
              <h2 className="shrink-0 text-[28px] font-extrabold leading-none tracking-[-0.04em] text-[#0B1B3B] sm:text-[34px]">
                TODAY PLAN
              </h2>
              <div className="hidden h-px min-w-[160px] flex-1 bg-[#E9EDF3] md:block" />
            </div>

            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#E7EBF2] bg-white px-4 text-[13px] font-semibold text-[#111827] transition hover:bg-[#F8FAFC]"
            >
              내 플래너 관리
              <ChevronDown className="h-4 w-4 text-[#6B7280]" />
            </button>
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
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.3fr)_320px]">
            {/* left */}
            <div className="overflow-hidden rounded-[30px] border border-[#E8EDF5] bg-white">
              <div className="border-b border-[#EEF2F7] bg-[#FBFCFE] px-6 py-4">
                <p className="text-[11px] font-semibold text-[#A0AEC0]">
                  오늘의 핵심 학습
                </p>
              </div>

              <div className="px-6 py-5 sm:px-7 sm:py-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
                  {/* content */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#F1EEFF] px-3 py-1 text-[11px] font-semibold text-[#6D5DF6]">
                        Week {todayTask.week}
                      </span>
                      <span className="rounded-full border border-[#E7EBF2] bg-white px-3 py-1 text-[11px] font-semibold text-[#7C8BA1]">
                        Day {todayTask.day}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold ${getStatusChip(
                          todayTask.status
                        )}`}
                      >
                        {getStatusLabel(todayTask.status)}
                      </span>
                    </div>

                    <h3 className="mt-4 text-[28px] font-extrabold leading-[1.2] tracking-[-0.04em] text-[#0B1B3B] sm:text-[30px]">
                      {todayTask.title}
                    </h3>

                    <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#7B8798]">
                      {todayTask.description}
                    </p>
                  </div>

                  {/* meta / action */}
                  <div className="flex flex-col justify-between rounded-[24px] border border-[#EEF2F7] bg-[#FBFCFE] px-5 py-5">
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#5E6B7C]">
                        <Clock3 className="h-4 w-4" />
                        {todayTask.hours}시간 예정
                      </div>

                      <div className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#5E6B7C]">
                        <CalendarDays className="h-4 w-4" />
                        이번 주 학습 흐름 포함
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(todayTask.id)}
                        className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#6D5DF6] px-4 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(109,93,246,0.18)] transition hover:-translate-y-[1px] hover:shadow-[0_14px_30px_rgba(109,93,246,0.24)]"
                      >
                        {todayTask.status === "TODO" && "학습 시작하기"}
                        {todayTask.status === "IN_PROGRESS" && "오늘 학습 완료하기"}
                        {todayTask.status === "DONE" && "완료됨"}
                      </button>

                      <button
                        type="button"
                        className="inline-flex h-11 items-center justify-center rounded-2xl border border-[#E7EBF2] bg-white px-4 text-sm font-semibold text-[#111827] transition hover:bg-[#F8FAFC]"
                      >
                        세부 계획 보기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* right */}
            <div className="overflow-hidden rounded-[30px] border border-[#E8EDF5] bg-white">
              <div className="border-b border-[#EEF2F7] bg-[#FBFCFE] px-6 py-4">
                <p className="text-[11px] font-semibold text-[#A0AEC0]">
                  이번 주 요약
                </p>
              </div>

              <div className="space-y-4 px-6 py-6">
                <div className="rounded-[22px] border border-[#EEF2F7] bg-white px-5 py-5">
                  <p className="text-[12px] font-medium text-[#98A2B3]">
                    전체 진행률
                  </p>
                  <p className="mt-2 text-[28px] font-extrabold tracking-[-0.04em] text-[#0B1B3B]">
                    {progressPercent}%
                  </p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#EEF2F7]">
                    <div
                      className="h-full rounded-full bg-[#6D5DF6]"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-[22px] border border-[#EEF2F7] bg-[#FBFCFE] px-4 py-4">
                    <p className="text-[12px] font-medium text-[#98A2B3]">
                      완료한 일정
                    </p>
                    <p className="mt-2 text-[22px] font-extrabold tracking-[-0.03em] text-[#0B1B3B]">
                      {completedCount}
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-[#EEF2F7] bg-[#FBFCFE] px-4 py-4">
                    <p className="text-[12px] font-medium text-[#98A2B3]">
                      총 계획 시간
                    </p>
                    <p className="mt-2 text-[22px] font-extrabold tracking-[-0.03em] text-[#0B1B3B]">
                      {totalHours}h
                    </p>
                  </div>
                </div>

                <div className="rounded-[22px] border border-[#EEF2F7] bg-[#FBFCFE] px-5 py-5">
                  <p className="text-[13px] font-semibold text-[#0F172A]">
                    현재 안내
                  </p>
                  <p className="mt-3 text-[14px] leading-7 text-[#7B8798]">
                    오늘 학습을 완료하면 다음 일정으로 자연스럽게 이어집니다.
                    너무 많은 양보다 꾸준한 진도가 더 중요해요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WEEKLY PROGRESS */}
        <section className="mt-16 w-full">
          <div className="mb-4 flex items-center gap-5">
            <h2 className="shrink-0 text-[28px] font-extrabold leading-none tracking-[-0.04em] text-[#0B1B3B] sm:text-[34px]">
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
                    onChange={(e) => setSelectedWeek(Number(e.target.value))}
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
                  진행률 {selectedWeekProgress}%
                </div>
              </div>
            </div>

            <div className="grid min-w-[980px]" style={{ gridTemplateColumns: "180px 1fr" }}>
              <div className="border-r border-[#EEF2F7] bg-[#FBFCFE]">
                <div className="flex h-[52px] items-center px-6 text-[11px] font-semibold text-[#A0AEC0]">
                  주차 / Day
                </div>

                {weeklyTasks.map((task, index) => (
                  <div
                    key={task.id}
                    className={`flex min-h-[78px] items-center px-6 py-4 ${
                      index !== weeklyTasks.length - 1 ? "border-t border-[#EEF2F7]" : ""
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
                <div className="flex h-[52px] items-center bg-[#FBFCFE] px-6 text-[11px] font-semibold text-[#A0AEC0]">
                  선택한 주차 학습 계획
                </div>

                {weeklyTasks.map((task, index) => (
                  <div
                    key={task.id}
                    className={`flex min-h-[78px] items-center justify-between gap-4 px-6 py-4 ${
                      index !== weeklyTasks.length - 1 ? "border-t border-[#EEF2F7]" : ""
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${getStatusDot(task.status)}`} />
                        <p className="truncate text-[15px] font-bold text-[#0F172A]">
                          {task.title}
                        </p>
                      </div>
                      <p className="mt-1 truncate text-[13px] text-[#7B8798]">
                        {task.description}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-[13px] font-semibold text-[#7C8BA1]">
                        {task.hours}시간
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold ${getStatusChip(
                          task.status
                        )}`}
                      >
                        {getStatusLabel(task.status)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(task.id)}
                        className="inline-flex h-9 items-center justify-center rounded-full border border-[#E7EBF2] bg-white px-4 text-[12px] font-semibold text-[#111827] transition hover:bg-[#F8FAFC]"
                      >
                        {task.status === "TODO" && (
                          <span className="inline-flex items-center gap-1.5">
                            <PlayCircle className="h-4 w-4" />
                            시작
                          </span>
                        )}
                        {task.status === "IN_PROGRESS" && (
                          <span className="inline-flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4" />
                            완료
                          </span>
                        )}
                        {task.status === "DONE" && "완료됨"}
                      </button>
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
      </div>
    </main>
  );
}