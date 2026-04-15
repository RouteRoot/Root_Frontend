"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { PlanTab } from "@/app/api/plan/types";

type PlanTabsProps = {
  tabs: PlanTab[];
  selectedExamTaskId: number | null;
  onSelect: (examTaskId: number) => void;
  onDeletePlan?: (examTaskId: number) => void | Promise<void>;
  onRegeneratePlan?: (examTaskId: number) => void | Promise<void>;
  isLoading?: boolean;
};

export default function PlanTabs({
  tabs,
  selectedExamTaskId,
  onSelect,
  onDeletePlan,
  onRegeneratePlan,
  isLoading = false,
}: PlanTabsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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

  const handleRegeneratePlan = async () => {
    if (!selectedExamTaskId) return;
    setIsMenuOpen(false);
    await onRegeneratePlan?.(selectedExamTaskId);
  };

  const handleDeletePlan = async () => {
    if (!selectedExamTaskId) return;
    setIsMenuOpen(false);
    await onDeletePlan?.(selectedExamTaskId);
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto py-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-[36px] w-[120px] shrink-0 animate-pulse rounded-[10px] bg-[#EEF2F7]"
              />
            ))}
          </div>

          <div className="h-10 w-[118px] shrink-0 animate-pulse rounded-[10px] bg-[#EEF2F7]" />
        </div>
      </div>
    );
  }

  if (!tabs.length) {
    return (
      <div className="text-sm text-[#94A3B8]">
        생성된 플랜이 아직 없어요. 로드맵 페이지에서 플랜을 생성 할 수 있습니다.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3">
        <div className="scrollbar-hide flex min-w-0 flex-1 gap-2 overflow-x-auto py-2">
          {tabs.map((tab) => {
            const isActive = selectedExamTaskId === tab.examTaskId;

            return (
              <button
                key={tab.examTaskId}
                type="button"
                onClick={() => onSelect(tab.examTaskId)}
                className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-200 sm:px-5 sm:text-[14px] ${
                  isActive
                    ? "bg-[#6D5DF6] text-white"
                    : "bg-[#ffffff] text-[#667085] hover:bg-[#EEF2F7]"
                }`}
              >
                {tab.taskName}
              </button>
            );
          })}
        </div>

        <div ref={dropdownRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="
              inline-flex h-10 min-w-[118px] items-center justify-center gap-2
              rounded-[10px] bg-white px-4
              text-[13px] font-semibold text-[#111827]
              transition-all duration-200
              hover:border-[#D9E0EA] hover:bg-[#FAFBFC]
            "
          >
            플랜 관리하기
            <ChevronDown
              className={`h-4 w-4 text-[#6B7280] transition-transform duration-300 ${
                isMenuOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          <div
            className={`
              absolute right-0 top-[calc(100%+10px)] z-30 w-[102px]
              origin-top-right overflow-hidden rounded-[10px] border border-[#E8EDF5] bg-white
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
              onClick={handleRegeneratePlan}
              className="
                flex h-10 w-full items-center rounded-[10px] px-3
                text-left text-[13px] font-medium text-[#111827]
                transition-colors duration-150 hover:bg-[#F8FAFC]
              "
            >
              재생성하기
            </button>

            <button
              type="button"
              onClick={handleDeletePlan}
              className="
                flex h-10 w-full items-center rounded-[10px] px-3
                text-left text-[13px] font-medium text-[#111827]
                transition-colors duration-150 hover:bg-[#F8FAFC]
              "
            >
              삭제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}