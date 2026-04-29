"use client";

import { useEffect, useMemo, useState } from "react";
import { getRoadmapByToken } from "@/app/api/roadmap/roadmap";
import { getPlanTabs } from "@/app/api/plan/plan";
import type { PlanTab } from "@/app/api/plan/types";
import type {
  RoadmapResponse,
  Phase,
  Task,
  TaskStatus,
} from "@/app/api/roadmap/types";

type LoadState = "idle" | "loading" | "success" | "error";

type ErrorWithMessage = {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
};

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    const err = error as ErrorWithMessage;

    if (typeof err.response?.data?.message === "string") {
      return err.response.data.message;
    }

    if (typeof err.message === "string") {
      return err.message;
    }
  }

  return "로드맵을 불러오는 중 오류가 발생했습니다.";
}

function hasGeneratedPlan(taskId: number, planTabs: PlanTab[]) {
  return planTabs.some((tab) => tab.examTaskId === taskId);
}

function getEffectiveStatus(status: TaskStatus, hasPlan: boolean): TaskStatus {
  return hasPlan ? "IN_PROGRESS" : status;
}

function getStatusLabel(status: TaskStatus) {
  switch (status) {
    case "NOT_STARTED":
      return "진행 예정";
    case "IN_PROGRESS":
      return "진행 중";
    case "COMPLETED":
      return "취득 완료";
    default:
      return "";
  }
}

function getStatusStyle(status: TaskStatus) {
  switch (status) {
    case "NOT_STARTED":
      return {
        chip: "border border-[#D7DCE5] bg-white text-[#7C8798]",
        dot: "border border-[#D7DCE5] bg-white",
      };
    case "IN_PROGRESS":
      return {
        chip: "border border-[#DDD8FF] bg-[#eeeeee] text-[#555555]",
        dot: "bg-[#4876EF]",
      };
    case "COMPLETED":
      return {
        chip: "border border-[#D8E3F0] bg-[#F3F7FB] text-[#70839B]",
        dot: "bg-[#8FA3BF]",
      };
    default:
      return {
        chip: "border border-[#D7DCE5] bg-white text-[#7C8798]",
        dot: "border border-[#D7DCE5] bg-white",
      };
  }
}

function getColumnTone(index: number) {
  const tones = ["bg-[#FCFCFD]", "bg-[#FBFCFE]", "bg-[#FDFDFF]"];
  return tones[index % tones.length];
}

function EmptyTaskCard() {
  return (
    <div className="rounded-2xl border border-dashed border-[#E3E8EF] bg-white px-4 py-5">
      <p className="text-[13px] font-semibold text-[#94A3B8]">
        아직 등록된 세부 항목이 없어요
      </p>
      <p className="mt-1 text-[12px] leading-5 text-[#A0AEC0]">
        이 단계에 연결된 자격증이나 학습 항목이 생성되면 여기에 표시됩니다.
      </p>
    </div>
  );
}

function TaskCard({
  task,
  planTabs,
}: {
  task: Task;
  planTabs: PlanTab[];
}) {
  const hasPlan = hasGeneratedPlan(task.taskId, planTabs);
  const effectiveStatus = getEffectiveStatus(task.status, hasPlan);
  const statusStyle = getStatusStyle(effectiveStatus);

  return (
    <article className="group rounded-[20px] border border-[#E8EDF5] bg-white p-4 shadow-[0_6px_18px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`mt-1 h-2.5 w-2.5 rounded-full ${statusStyle.dot}`} />
            {/* <span className="text-[11px] font-bold tracking-[0.02em] text-[#A0AEC0]">
              Task
            </span> */}
            <h4 className="mt-1 text-[15px] font-bold leading-6 tracking-[-0.02em] text-[#333333]">
            {task.taskName}
          </h4>
          </div>

          {/* <h4 className="mt-2 text-[15px] font-bold leading-6 tracking-[-0.02em] text-[#333333]">
            {task.taskName}
          </h4> */}
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold leading-none ${statusStyle.chip}`}
        >
          {getStatusLabel(effectiveStatus)}
        </span>
      </div>

      <p className="mt-3 text-[13px] leading-6 text-[#667085]">
        {task.description?.trim()
          ? task.description
          : "세부 설명이 아직 등록되지 않았습니다."}
      </p>
    </article>
  );
}

function PhaseColumn({
  phase,
  index,
  planTabs,
}: {
  phase: Phase;
  index: number;
  planTabs: PlanTab[];
}) {
  return (
    <section
      className={`flex min-h-105 flex-col rounded-3xl border border-[#E8EDF5] ${getColumnTone(index)}`}
    >
      <div className="border-b border-[#EEF2F7] px-5 py-4">
        <div className="flex items-center gap-2">
          <h3 className="text-[17px] font-bold tracking-[-0.02em] text-[#333333]">
            {phase.phaseTitle}
          </h3>

          {phase.phaseNumber !== null && (
            <span className="rounded-full bg-[#ebebeb] px-2 py-1 text-[10px] font-semibold leading-none text-[#838383]">
              Phase {phase.phaseNumber}
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center gap-2 text-[11px] text-[#94A3B8]">
          <span>{phase.estimatedWeeks}주 예상</span>
          <span className="h-1 w-1 rounded-full bg-[#CBD5E1]" />
          <span>{phase.tasks.length}개 항목</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {phase.tasks.length === 0 ? (
          <EmptyTaskCard />
        ) : (
          phase.tasks.map((task) => (
            <TaskCard key={task.taskId} task={task} planTabs={planTabs} />
          ))
        )}
      </div>
    </section>
  );
}

export default function RoadmapKanbanBoard() {
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [planTabs, setPlanTabs] = useState<PlanTab[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchRoadmap = async () => {
      try {
        setLoadState("loading");
        setErrorMessage("");

        const [roadmapData, planTabData] = await Promise.all([
          getRoadmapByToken(),
          getPlanTabs(),
        ]);

        if (!isMounted) return;

        setRoadmap(roadmapData);
        setPlanTabs(planTabData);
        setLoadState("success");
      } catch (error: unknown) {
        if (!isMounted) return;

        setErrorMessage(getErrorMessage(error));
        setLoadState("error");
      }
    };

    fetchRoadmap();

    return () => {
      isMounted = false;
    };
  }, []);

  const phases = useMemo(() => {
    if (!roadmap?.phases) return [];

    return [...roadmap.phases].sort((a, b) => {
      const aNum = a.phaseNumber ?? 999;
      const bNum = b.phaseNumber ?? 999;
      return aNum - bNum;
    });
  }, [roadmap]);

  const isEmpty = loadState === "success" && phases.length === 0;

  return (
    <section className="mt-12 w-full">
      <div className="mb-4 flex items-center gap-5">
        <h2 className="shrink-0 text-[19px] font-semibold leading-none tracking-[-0.04em] text-[#323438]">
          세부 로드맵 항목
        </h2>
      </div>

      <div className="overflow-hidden rounded-[28px] bg-white">
        {loadState === "loading" && (
          <div className="px-6 py-10">
            <div className="grid gap-4 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-[#E8EDF5] bg-[#FBFCFE] p-4"
                >
                  <div className="h-5 w-28 animate-pulse rounded-md bg-[#EEF2F7]" />
                  <div className="mt-2 h-4 w-20 animate-pulse rounded-md bg-[#F3F6FA]" />
                  <div className="mt-4 space-y-3">
                    <div className="h-24 animate-pulse rounded-2xl bg-white" />
                    <div className="h-24 animate-pulse rounded-2xl bg-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loadState === "error" && (
          <div className="px-6 py-12 text-center">
            <p className="text-[15px] font-semibold text-[#334155]">
              칸반보드를 불러오지 못했어요
            </p>
            <p className="mt-2 text-[13px] leading-6 text-[#94A3B8]">
              {errorMessage || "잠시 후 다시 시도해주세요."}
            </p>
          </div>
        )}

        {isEmpty && (
          <div className="px-6 py-12 text-center">
            <p className="text-[15px] font-semibold text-[#334155]">
              아직 생성된 로드맵이 없어요
            </p>
            <p className="mt-2 text-[13px] leading-6 text-[#94A3B8]">
              로드맵을 생성하면 단계별 세부 항목이 칸반보드로 표시됩니다.
            </p>
          </div>
        )}

        {loadState === "success" && phases.length > 0 && (
          <div className="overflow-x-auto py-6">
            <div className="grid min-w-245 gap-4 lg:grid-cols-3">
              {phases.map((phase, index) => (
                <PhaseColumn
                  key={phase.phaseId}
                  phase={phase}
                  index={index}
                  planTabs={planTabs}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
