"use client";

import { getPlanTabs } from "@/app/api/plan/plan";
import type { PlanTab } from "@/app/api/plan/types";
import { getRoadmapByToken } from "@/app/api/roadmap/roadmap";
import type {
  Phase,
  RoadmapResponse,
  Task,
  TaskStatus,
} from "@/app/api/roadmap/types";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  Filter,
  MoreHorizontal,
  Plus,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type LoadState = "loading" | "success" | "error";
type StatusFilter = "ALL" | TaskStatus;

const statusFilters: { label: string; value: StatusFilter }[] = [
  { label: "전체", value: "ALL" },
  { label: "진행", value: "IN_PROGRESS" },
  { label: "예정", value: "NOT_STARTED" },
  { label: "완료", value: "COMPLETED" },
];

function hasGeneratedPlan(taskId: number, planTabs: PlanTab[]) {
  return planTabs.some((tab) => tab.examTaskId === taskId);
}

function getEffectiveStatus(status: TaskStatus, hasPlan: boolean): TaskStatus {
  return hasPlan ? "IN_PROGRESS" : status;
}

function getStatusMeta(status: TaskStatus) {
  switch (status) {
    case "COMPLETED":
      return {
        label: "완료",
        icon: CheckCircle2,
        chip: "bg-[#F1F5F9] text-[#64748B]",
        dot: "bg-[#94A3B8]",
        border: "border-[#E2E8F0]",
      };
    case "IN_PROGRESS":
      return {
        label: "진행 중",
        icon: Clock3,
        chip: "bg-[#EEF4FF] text-[#4876EF]",
        dot: "bg-[#4876EF]",
        border: "border-[#CFE0FF]",
      };
    case "NOT_STARTED":
    default:
      return {
        label: "예정",
        icon: Circle,
        chip: "bg-[#F7F9FB] text-[#8A94A6]",
        dot: "border border-[#C8D0DB] bg-white",
        border: "border-[#E5E8EB]",
      };
  }
}

function getTaskStatus(task: Task, planTabs: PlanTab[]) {
  return getEffectiveStatus(task.status, hasGeneratedPlan(task.taskId, planTabs));
}

function EmptyRoadmap() {
  return (
    <section className="mx-auto flex min-h-[52vh] w-full max-w-[430px] flex-col items-center justify-center rounded-[8px] border border-[#E5E8EB] bg-white px-5 py-10 text-center">
      <Image
        src="/image 62.png"
        alt="bubu"
        width={64}
        height={64}
        className="opacity-90"
      />
      <h1 className="mt-5 text-[18px] font-medium leading-tight text-[#252A32]">
        아직 생성된 로드맵이 없어요
      </h1>
      <p className="mt-2 max-w-[280px] text-[13px] leading-[1.6] text-[#8A94A6]">
        목표와 현재 상태를 입력하면 자격증 취득까지의 학습 경로를 만들어드릴게요.
      </p>
      <Link
        href="/roadmap/generate"
        className="mt-6 flex min-h-11 w-full max-w-[260px] items-center justify-center gap-1 rounded-[8px] bg-[#4876EF] px-5 text-[13px] font-medium text-white"
      >
        로드맵 생성하기
        <ArrowRight className="h-4 w-4" />
      </Link>
      <Link
        href="/certificate"
        className="mt-2 flex min-h-10 w-full max-w-[260px] items-center justify-center rounded-[8px] border border-[#E5E8EB] bg-white px-5 text-[12px] font-medium text-[#667085]"
      >
        자격증 먼저 둘러보기
      </Link>
    </section>
  );
}

function RoadmapSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[430px] space-y-3 pb-7">
      <div className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-4">
        <div className="h-4 w-24 animate-pulse rounded bg-[#EEF2F7]" />
        <div className="mt-3 h-6 w-44 animate-pulse rounded bg-[#F3F6FA]" />
        <div className="mt-4 h-2 w-full animate-pulse rounded-full bg-[#EEF2F7]" />
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-14 animate-pulse rounded bg-[#F7F9FB]" />
          ))}
        </div>
      </div>
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-4"
        >
          <div className="h-4 w-32 animate-pulse rounded bg-[#EEF2F7]" />
          <div className="mt-4 h-16 animate-pulse rounded bg-[#F7F9FB]" />
        </div>
      ))}
    </div>
  );
}

function SummaryCard({
  phases,
  planTabs,
  onRegenerate,
  onEdit,
}: {
  phases: Phase[];
  planTabs: PlanTab[];
  onRegenerate: () => void;
  onEdit: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const tasks = phases.flatMap((phase) => phase.tasks ?? []);
  const total = tasks.length;
  const completed = tasks.filter(
    (task) => getTaskStatus(task, planTabs) === "COMPLETED"
  ).length;
  const inProgress = tasks.filter(
    (task) => getTaskStatus(task, planTabs) === "IN_PROGRESS"
  ).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="overflow-hidden rounded-[8px] border border-[#DDE7FF] bg-white">
      <div className="bg-[#F7FAFF] px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-[#4876EF]">
              나의 로드맵
            </p>
            <h1 className="mt-1 text-[18px] font-medium text-[#252A32]">
              자격증 학습 경로
            </h1>
          </div>
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="roadmap menu"
              aria-expanded={menuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-[8px] text-[#252A32] active:bg-[#EEF2F7]"
            >
              <MoreHorizontal className="h-4.5 w-4.5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-10 z-20 w-32 overflow-hidden rounded-[8px] border border-[#E5E8EB] bg-white p-1 shadow-[0_12px_28px_rgba(15,23,42,0.12)]">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onRegenerate();
                  }}
                  className="flex min-h-9 w-full items-center rounded-[6px] px-3 text-left text-[12px] font-medium text-[#344054] active:bg-[#F7F9FB]"
                >
                  재생성하기
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit();
                  }}
                  className="flex min-h-9 w-full items-center rounded-[6px] px-3 text-left text-[12px] font-medium text-[#344054] active:bg-[#F7F9FB]"
                >
                  수정하기
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-[12px]">
            <span className="font-medium text-[#667085]">완료율</span>
            <span className="font-medium text-[#252A32]">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#E8EEF9]">
            <div
              className="h-full rounded-full bg-[#4876EF] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-[#EEF2F7]">
        <div className="px-4 py-3">
          <p className="text-[11px] text-[#8A94A6]">전체</p>
          <p className="mt-1 text-[16px] font-medium text-[#252A32]">{total}</p>
        </div>
        <div className="px-4 py-3">
          <p className="text-[11px] text-[#8A94A6]">진행</p>
          <p className="mt-1 text-[16px] font-medium text-[#4876EF]">
            {inProgress}
          </p>
        </div>
        <div className="px-4 py-3">
          <p className="text-[11px] text-[#8A94A6]">완료</p>
          <p className="mt-1 text-[16px] font-medium text-[#64748B]">
            {completed}
          </p>
        </div>
      </div>
    </section>
  );
}

function InProgressPlanCarousel({
  roadmap,
  phases,
  planTabs,
}: {
  roadmap: RoadmapResponse;
  phases: Phase[];
  planTabs: PlanTab[];
}) {
  const router = useRouter();
  const inProgressTasks = phases
    .flatMap((phase) => phase.tasks ?? [])
    .filter((task) => getTaskStatus(task, planTabs) === "IN_PROGRESS");

  if (inProgressTasks.length === 0) return null;

  const handleClick = (task: Task) => {
    const hasPlan = hasGeneratedPlan(task.taskId, planTabs);

    if (hasPlan) {
      router.push("/plan");
      return;
    }

    const params = new URLSearchParams({
      examTaskId: String(task.taskId),
      name: task.taskName,
      daily: String(roadmap.daily),
      weekly: String(roadmap.weekly),
      mylevel: roadmap.mylevel,
    });

    router.push(`/plan/generate?${params.toString()}`);
  };

  return (
    <section>
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="text-[15px] font-medium text-[#252A32]">
          진행중인 플랜
        </h2>
      </div>

      <div className="flex snap-x gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {inProgressTasks.map((task) => {
          const hasPlan = hasGeneratedPlan(task.taskId, planTabs);

          return (
            <article
              key={task.taskId}
              className="w-[88%] shrink-0 snap-start rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#EEF4FF] text-[#4876EF]">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium text-[#8A94A6]">
                    진행중인 플랜
                  </p>
                  <h3 className="mt-1 line-clamp-2 text-[15px] font-medium leading-[1.45] text-[#252A32]">
                    {task.taskName}
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleClick(task)}
                    className="mt-3 flex min-h-10 w-full items-center justify-center gap-1 rounded-[8px] bg-[#4876EF] text-[12px] font-medium text-white"
                  >
                    {hasPlan ? "플랜으로 이동" : "플랜 만들기"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function TaskCard({
  roadmap,
  task,
  planTabs,
}: {
  roadmap: RoadmapResponse;
  task: Task;
  planTabs: PlanTab[];
}) {
  const router = useRouter();
  const hasPlan = hasGeneratedPlan(task.taskId, planTabs);
  const status = getTaskStatus(task, planTabs);
  const meta = getStatusMeta(status);
  const Icon = meta.icon;

  const handleClick = () => {
    if (hasPlan) {
      router.push("/plan");
      return;
    }

    const params = new URLSearchParams({
      examTaskId: String(task.taskId),
      name: task.taskName,
      daily: String(roadmap.daily),
      weekly: String(roadmap.weekly),
      mylevel: roadmap.mylevel,
    });

    router.push(`/plan/generate?${params.toString()}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`block w-full rounded-[8px] border bg-white px-4 py-4 text-left active:bg-[#F7F9FB] ${meta.border}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-start gap-2">
            <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${meta.dot}`} />
            <h3 className="line-clamp-2 text-[14px] font-medium leading-[1.45] text-[#252A32]">
              {task.taskName}
            </h3>
          </div>
          <p className="mt-2 line-clamp-3 text-[12px] leading-[1.6] text-[#667085]">
            {task.description?.trim() || "상세 설명이 아직 등록되지 않았어요."}
          </p>
        </div>

        <span
          className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${meta.chip}`}
        >
          <Icon className="h-3 w-3" />
          {meta.label}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-end text-[12px] font-medium text-[#4876EF]">
        {hasPlan ? "플랜 보기" : "플랜 만들기"}
        <ArrowRight className="ml-0.5 h-3.5 w-3.5" />
      </div>
    </button>
  );
}

function PhaseSection({
  roadmap,
  phase,
  planTabs,
  filter,
}: {
  roadmap: RoadmapResponse;
  phase: Phase;
  planTabs: PlanTab[];
  filter: StatusFilter;
}) {
  const filteredTasks = (phase.tasks ?? []).filter((task) => {
    if (filter === "ALL") return true;
    return getTaskStatus(task, planTabs) === filter;
  });

  if (filteredTasks.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-[8px] border border-[#E5E8EB] bg-[#FBFCFE]">
      <div className="border-b border-[#EEF2F7] bg-white px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-[#8A94A6]">
              Phase {phase.phaseNumber ?? "-"}
            </p>
            <h2 className="mt-1 truncate text-[15px] font-medium text-[#252A32]">
              {phase.phaseTitle}
            </h2>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#F7F9FB] px-2.5 py-1 text-[11px] font-medium text-[#8A94A6]">
            <CalendarDays className="h-3.5 w-3.5" />
            {phase.estimatedWeeks}주
          </span>
        </div>
      </div>

      <div className="space-y-2 p-3">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.taskId}
            roadmap={roadmap}
            task={task}
            planTabs={planTabs}
          />
        ))}
      </div>
    </section>
  );
}

export default function MobileRoadmapPage() {
  const router = useRouter();
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [planTabs, setPlanTabs] = useState<PlanTab[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("ALL");

  useEffect(() => {
    let mounted = true;

    async function loadRoadmap() {
      try {
        setLoadState("loading");
        setErrorMessage("");
        const [roadmapData, planTabData] = await Promise.all([
          getRoadmapByToken(),
          getPlanTabs().catch(() => []),
        ]);

        if (!mounted) return;
        setRoadmap(roadmapData);
        setPlanTabs(planTabData);
        setLoadState("success");
      } catch {
        if (!mounted) return;
        setRoadmap(null);
        setLoadState("error");
        setErrorMessage("로드맵을 불러오지 못했어요.");
      }
    }

    void loadRoadmap();

    return () => {
      mounted = false;
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

  const visiblePhaseCount = useMemo(() => {
    return phases.filter((phase) =>
      (phase.tasks ?? []).some((task) => {
        if (activeFilter === "ALL") return true;
        return getTaskStatus(task, planTabs) === activeFilter;
      })
    ).length;
  }, [activeFilter, phases, planTabs]);

  if (loadState === "loading") return <RoadmapSkeleton />;

  if (loadState === "error") {
    return (
      <div className="mx-auto w-full max-w-[430px] rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-8 text-center">
        <p className="text-[15px] font-medium text-[#252A32]">{errorMessage}</p>
        <p className="mx-auto mt-2 max-w-[280px] text-[13px] leading-[1.6] text-[#8A94A6]">
          아직 로드맵이 없다면 새로 생성해서 시작할 수 있어요.
        </p>
        <button
          type="button"
          onClick={() => router.refresh()}
          className="mt-4 min-h-10 rounded-[8px] border border-[#E5E8EB] bg-white px-4 text-[13px] font-medium text-[#667085]"
        >
          다시 시도
        </button>
        <Link
          href="/roadmap/generate"
          className="mt-2 flex min-h-11 items-center justify-center gap-1 rounded-[8px] bg-[#4876EF] px-4 text-[13px] font-medium text-white"
        >
          로드맵 생성하기
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  if (!roadmap || phases.length === 0) return <EmptyRoadmap />;

  return (
    <div className="mx-auto flex w-full max-w-[430px] flex-col gap-4 pb-7">
      <SummaryCard
        phases={phases}
        planTabs={planTabs}
        onRegenerate={() => router.push("/roadmap/generate")}
        onEdit={() => router.push("/roadmap/generate")}
      />

      <InProgressPlanCarousel
        roadmap={roadmap}
        phases={phases}
        planTabs={planTabs}
      />

      <section className="rounded-[8px] border border-[#E5E8EB] bg-white px-3 py-3">
        <div className="mb-2 flex items-center gap-1.5 px-1 text-[12px] font-medium text-[#8A94A6]">
          <Filter className="h-3.5 w-3.5" />
          상태별 보기
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {statusFilters.map((filter) => {
            const active = activeFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                className={`min-h-9 rounded-[8px] text-[12px] font-medium transition-colors ${
                  active
                    ? "bg-[#4876EF] text-white"
                    : "bg-[#F7F9FB] text-[#667085]"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </section>

      {visiblePhaseCount > 0 ? (
        <div className="space-y-3">
          {phases.map((phase) => (
            <PhaseSection
              key={phase.phaseId}
              roadmap={roadmap}
              phase={phase}
              planTabs={planTabs}
              filter={activeFilter}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[8px] border border-dashed border-[#DDE2EA] bg-white px-4 py-8 text-center text-[13px] text-[#8A94A6]">
          선택한 상태의 항목이 없어요.
        </div>
      )}

      <Link
        href="/roadmap/generate"
        className="flex min-h-11 items-center justify-center gap-1 rounded-[8px] border border-[#D8E4FF] bg-white text-[13px] font-medium text-[#4876EF]"
      >
        <Plus className="h-4 w-4" />
        새 로드맵 만들기
      </Link>
    </div>
  );
}
