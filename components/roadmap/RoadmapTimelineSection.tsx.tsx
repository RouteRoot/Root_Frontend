"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/common/ConfirmModal";
import { getRoadmapByToken } from "@/app/api/roadmap/roadmap";
import { getPlanTabs } from "@/app/api/plan/plan";
import type { PlanTab } from "@/app/api/plan/types";
import type {
  RoadmapResponse,
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

function getEffectiveStatus(status: TaskStatus, hasPlan: boolean): TaskStatus {
  return hasPlan ? "IN_PROGRESS" : status;
}

function getCardStyle(status: TaskStatus, hasPlan: boolean) {
  const effectiveStatus = getEffectiveStatus(status, hasPlan);

  switch (effectiveStatus) {
    case "IN_PROGRESS":
      return {
        wrapper:
          "border border-[#6D5DF6] bg-[#6d61da] text-white shadow-[0_8px_20px_rgba(109,93,246,0.18)] hover:shadow-[0_12px_28px_rgba(109,93,246,0.24)]",
        badge: "bg-white/18 text-white",
      };
    case "COMPLETED":
      return {
        wrapper:
          "border border-[#A8B1C0] bg-[#A8B1C0] text-white shadow-[0_8px_18px_rgba(148,163,184,0.16)] hover:shadow-[0_10px_24px_rgba(148,163,184,0.2)]",
        badge: "bg-white/18 text-white",
      };
    case "NOT_STARTED":
      return {
        wrapper:
          "border border-[#D8DEE8] bg-white text-[#475569] shadow-none hover:border-[#C8D0DB] hover:bg-[#FAFBFC]",
        badge: "bg-[#F3F4F6] text-[#6B7280]",
      };
    default:
      return {
        wrapper:
          "border border-[#6D5DF6] bg-[#6d61da] text-white shadow-[0_8px_20px_rgba(109,93,246,0.18)] hover:shadow-[0_12px_28px_rgba(109,93,246,0.24)]",
        badge: "bg-white/18 text-white",
      };
  }
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

function hasGeneratedPlan(taskId: number, planTabs: PlanTab[]) {
  return planTabs.some((tab) => tab.examTaskId === taskId);
}

export default function RoadmapTimelineSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [hasPlanForSelected, setHasPlanForSelected] = useState(false);

  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [planTabs, setPlanTabs] = useState<PlanTab[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current) return;

      if (!dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
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

    fetchData();

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

  const handleRegenerate = () => {
    setIsMenuOpen(false);
    router.push("/roadmap/generate");
  };

  const handleEdit = () => {
    setIsMenuOpen(false);
    console.log("로드맵 수정하기 클릭");
  };

  const handleTaskClick = (task: Task) => {
    const hasPlan = hasGeneratedPlan(task.taskId, planTabs);

    setSelectedTask(task);
    setHasPlanForSelected(hasPlan);
    setConfirmOpen(true);
  };

  const handleCloseModal = () => {
    setConfirmOpen(false);
    setSelectedTask(null);
    setHasPlanForSelected(false);
  };

  const handleConfirmCreatePlan = () => {
    if (!selectedTask || !roadmap) return;

    if (hasPlanForSelected) {
      router.push("/plan");
    } else {
      const params = new URLSearchParams({
        examTaskId: String(selectedTask.taskId),
        name: selectedTask.taskName,
        daily: String(roadmap.daily),
        weekly: String(roadmap.weekly),
        mylevel: roadmap.mylevel,
      });

      router.push(`/plan/generate?${params.toString()}`);
    }

    setConfirmOpen(false);
    setSelectedTask(null);
    setHasPlanForSelected(false);
  };
  return (
    <>
      <section className="w-full">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-5">
            <h2 className="shrink-0 text-[28px] font-extrabold leading-none tracking-[-0.04em] text-[#0B1B3B]">
              ROADMAP OVERVIEW
            </h2>
            <div className="hidden h-px min-w-[280px] flex-1 bg-[#E9EDF3] md:block" />
          </div>

          <div ref={dropdownRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="
                inline-flex h-10 min-w-[132px] items-center justify-center gap-2
                rounded-full bg-white px-4
                text-[13px] font-semibold text-[#111827]
                transition-all duration-200
                hover:border-[#D9E0EA] hover:bg-[#FAFBFC]
              "
            >
              내 로드맵 관리
              <ChevronDown
                className={`h-4 w-4 text-[#6B7280] transition-transform duration-300 ${
                  isMenuOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            <div
              className={`
                absolute right-0 top-[calc(100%+10px)] z-30 w-[102px]
                origin-top-right overflow-hidden rounded-2xl border border-[#E8EDF5] bg-white
                p-1.5 shadow-[0_18px_40px_rgba(15,23,42,0.12)]
                transition-all duration-200 ease-out
                ${
                  isMenuOpen
                    ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                    : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
                }
              `}
            >
              <button
                type="button"
                onClick={handleRegenerate}
                className="
                  flex h-10 w-full items-center rounded-xl px-3
                  text-left text-[13px] font-medium text-[#111827]
                  transition-colors duration-150 hover:bg-[#F8FAFC]
                "
              >
                재생성하기
              </button>

              <button
                type="button"
                onClick={handleEdit}
                className="
                  flex h-10 w-full items-center rounded-xl px-3
                  text-left text-[13px] font-medium text-[#111827]
                  transition-colors duration-150 hover:bg-[#F8FAFC]
                "
              >
                수정하기
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-5 text-[11px] font-medium text-[#94A3B8]">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#6D5DF6]" />
              <span>진행 중</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#8FA3BF]" />
              <span>취득 완료</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full border border-[#A9B7CA] bg-white" />
              <span>진행 예정</span>
            </div>
          </div>

          <div className="mr-3 flex items-center gap-1.5 text-[11px] font-medium text-[#94A3B8]">
            <span>자격증 항목을 클릭하면 플랜을 생성할 수 있어요.</span>
            {/* <CircleHelp className="h-3.5 w-3.5 text-[#A0AEC0]" /> */}
          </div>
        </div>

        {loadState === "loading" && (
          <div className="bg-white">
            <div
              className="grid min-w-[1100px]"
              style={{ gridTemplateColumns: "280px 1fr" }}
            >
              <div className="border-r border-[#EEF2F7] bg-[#FBFCFE]">
                <div className="flex h-[50px] items-center px-6 text-[11px] font-semibold text-[#A0AEC0]">
                  페이즈
                </div>

                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex min-h-[65px] items-center border-t border-[#EEF2F7] px-6 py-4"
                  >
                    <div className="w-full">
                      <div className="h-4 w-32 animate-pulse rounded bg-[#E9EDF3]" />
                      <div className="mt-2 h-3 w-24 animate-pulse rounded bg-[#EEF2F7]" />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex h-[50px] items-center bg-[#FBFCFE] px-6 text-[11px] font-semibold text-[#A0AEC0]">
                  단계별 자격증 로드맵
                </div>

                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex min-h-[65px] items-center border-t border-[#EEF2F7] px-6 py-3"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="h-10 w-32 animate-pulse rounded-xl bg-[#EEF2F7]" />
                      <div className="h-10 w-28 animate-pulse rounded-xl bg-[#F3F6FA]" />
                      <div className="h-10 w-24 animate-pulse rounded-xl bg-[#EEF2F7]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {loadState !== "loading" && (
          <div className="overflow-hidden rounded-[28px] border border-[#E8EDF5] bg-white">
            {loadState === "error" && (
              <div className="px-6 py-12 text-center">
                <p className="text-[15px] font-semibold text-[#334155]">
                  로드맵을 불러오지 못했어요
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
                  로드맵을 생성하면 단계별 자격증 항목이 여기에 표시됩니다.
                </p>
              </div>
            )}

            {loadState === "success" && phases.length > 0 && (
              <div
                className="grid min-w-[1100px]"
                style={{ gridTemplateColumns: "280px 1fr" }}
              >
                <div className="border-r border-[#EEF2F7] bg-[#FBFCFE]">
                  <div className="flex h-[50px] items-center px-6 text-[11px] font-semibold text-[#A0AEC0]">
                    페이즈
                  </div>

                  {phases.map((phase, index) => (
                    <div
                      key={phase.phaseId}
                      className={`flex min-h-[65px] items-center px-6 py-4 ${
                        index !== phases.length - 1
                          ? "border-t border-[#EEF2F7]"
                          : ""
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-[13px] font-bold leading-none tracking-[-0.03em] text-[#0F172A]">
                            {phase.phaseTitle}
                          </h3>
                          {phase.phaseNumber !== null && (
                            <span className="rounded-full bg-[#F1EEFF] px-2 py-[3px] text-[10px] font-semibold leading-none text-[#6D5DF6]">
                              Phase {phase.phaseNumber}
                            </span>
                          )}
                        </div>

                        <p className="mt-1 truncate text-[11px] leading-none text-[#94A3B8]">
                          예상 학습기간 {phase.estimatedWeeks}주
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex h-[50px] items-center bg-[#FBFCFE] px-6 text-[11px] font-semibold text-[#A0AEC0]">
                    단계별 자격증 로드맵
                  </div>

                  {phases.map((phase, index) => (
                    <div
                      key={phase.phaseId}
                      className={`flex min-h-[65px] items-center px-6 py-3 ${
                        index !== phases.length - 1
                          ? "border-t border-[#EEF2F7]"
                          : ""
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        {phase.tasks.length > 0 ? (
                          phase.tasks.map((task) => {
                            const hasPlan = hasGeneratedPlan(
                              task.taskId,
                              planTabs
                            );
                            const effectiveStatus = getEffectiveStatus(
                              task.status,
                              hasPlan
                            );
                            const style = getCardStyle(task.status, hasPlan);

                            return (
                              <button
                                key={task.taskId}
                                type="button"
                                onClick={() => handleTaskClick(task)}
                                className={`group inline-flex h-10 max-w-[620px] cursor-pointer items-center rounded-xl px-3 transition-all duration-200 hover:-translate-y-px hover:scale-[1.02] ${style.wrapper}`}
                              >
                                <div className="flex min-w-0 items-center gap-2">
                                  <p className="whitespace-nowrap text-[13px] font-bold leading-none">
                                    {task.taskName}
                                  </p>

                                  <span
                                    className={`shrink-0 rounded-full px-1.5 py-[3px] text-[9px] font-semibold leading-none ${style.badge}`}
                                  >
                                    {getStatusLabel(effectiveStatus)}
                                  </span>
                                </div>
                              </button>
                            );
                          })
                        ) : (
                          <p className="text-[12px] text-[#A0AEC0]">
                            아직 등록된 항목이 없어요.
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <ConfirmModal
        open={confirmOpen}
        title={hasPlanForSelected ? "플랜 이동" : "플랜 생성"}
        description={
          selectedTask
            ? hasPlanForSelected
              ? (
                <>
                  이미 생성된 플랜입니다.
                  <br />
                  <span className="mt-2 block">
                    플랜창으로 이동하시겠습니까?
                  </span>
                </>
              )
              : (
                <>
                  {selectedTask.taskName} 플랜을 <br />생성하기 위해 이동할까요?
                </>
              )
            : ""
        }
        confirmText={hasPlanForSelected ? "이동하기" : "생성하기"}
        cancelText="취소"
        onConfirm={handleConfirmCreatePlan}
        onCancel={handleCloseModal}
      />
    </>
  );
}