"use client";

import type { PlanTab } from "@/app/api/plan/types";

type PlanTabsProps = {
  tabs: PlanTab[];
  selectedExamTaskId: number | null;
  onSelect: (examTaskId: number) => void;
  isLoading?: boolean;
};

export default function PlanTabs({
  tabs,
  selectedExamTaskId,
  onSelect,
  isLoading = false,
}: PlanTabsProps) {
  // ✅ 스켈레톤 상태
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex gap-2 overflow-x-auto py-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-[36px] w-[120px] animate-pulse rounded-full bg-[#EEF2F7]"
            />
          ))}
        </div>
      </div>
    );
  }

  // ✅ 데이터 없을 때
  if (!tabs.length) {
    return (
      <div className="text-sm text-[#94A3B8]">
        생성된 플랜이 아직 없어요.
      </div>
    );
  }

  // ✅ 정상 상태
  return (
    <div className="w-full">
      <div className="scrollbar-hide flex gap-2 overflow-x-auto py-2">
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
    </div>
  );
}