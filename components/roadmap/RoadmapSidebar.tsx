"use client";

import { getRoadmapByToken } from "@/app/api/roadmap/roadmap";
import type { Phase } from "@/app/api/roadmap/types";
import { ChevronRight, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function Tooltip({ text }: { text: string }) {
  return (
    <div className="absolute left-1/2 top-6 z-10 w-[200px] -translate-x-1/2 rounded-[8px] bg-[#1f2937] px-3 py-2 text-[12px] leading-[1.5] text-white shadow-lg">
      {text}
      <div className="absolute -top-[5px] left-1/2 h-[10px] w-[10px] -translate-x-1/2 rotate-45 bg-[#1f2937]" />
    </div>
  );
}

function StatSkeleton() {
  return <div className="h-5 w-6 animate-pulse rounded bg-[#f2f4f7]" />;
}

export default function RoadmapSidebar() {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    getRoadmapByToken()
      .then((data) => setPhases(data.phases))
      .catch(() => setPhases([]))
      .finally(() => setIsLoading(false));
  }, []);

  const allTasks = phases.flatMap((p) => p.tasks);
  const totalCount = allTasks.length;
  const inProgressCount = allTasks.filter((t) => t.status === "IN_PROGRESS").length;
  const completedCount = allTasks.filter((t) => t.status === "COMPLETED").length;

  return (
    <div className="flex flex-col gap-3 mt-8 ">
      <div className="rounded-[12px] border border-[#e5e8eb] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
        
        <div className="flex items-center justify-center gap-1.5 text-center">
          <span className="text-[14px] font-light text-[#252c3a]">
            등록된 자격증
          </span>

          <div
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <HelpCircle className="h-[15px] w-[15px] cursor-help text-[#98a2b3]" />
            {showTooltip && (
              <Tooltip text="로드맵에 등록된 전체 자격증 수입니다. 진행 상태에 따라 분류됩니다." />
            )}
          </div>
        </div>

        <div className="text-center">
          {isLoading ? (
            <div className="mt-2 mx-auto h-9 w-20 animate-pulse rounded-[6px] bg-[#f2f4f7]" />
          ) : (
            <p className="mt-3 text-[20px] font-semibold tracking-tight text-[#1f2937]">
              총 {totalCount}건
            </p>
          )}
        </div>

        <div className="my-4 h-px bg-[#e5e8eb]" />

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-[#667085]">진행중인 자격증</span>
            {isLoading ? (
              <StatSkeleton />
            ) : (
              <span className="text-[14px] font-bold text-[#344054]">
                {inProgressCount}개
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[14px] text-[#667085]">완료된 자격증</span>
            {isLoading ? (
              <StatSkeleton />
            ) : (
              <span className="text-[14px] font-bold text-[#000000]">
                {completedCount}개
              </span>
            )}
          </div>
        </div>
      </div>

      <Link
        href="/community/write"
        className="flex items-center justify-between rounded-[12px] shadow-[0_1px_2px_rgba(0,0,0,0.08)] border border-[#e5e8eb] bg-white px-5 py-4 transition-colors hover:border-[#0FA9CC] hover:bg-[#f0fbfd]"
      >
        <span className="text-[14px] font-semibold text-[#344054]">
          의견 보내기
        </span>
        <ChevronRight className="h-4 w-4 text-[#98a2b3]" />
      </Link>
    </div>
  );
}