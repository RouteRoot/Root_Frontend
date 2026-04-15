"use client";

import { getRoadmapByToken } from "@/app/api/roadmap/roadmap";
import type { RoadmapResponse } from "@/app/api/roadmap/types";
import RoadmapKanbanBoard from "@/components/roadmap/RoadmapKanbanboard";
import RoadmapTimelineSection from "@/components/roadmap/RoadmapTimelineSection.tsx";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const [hasRoadmap, setHasRoadmap] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const data: RoadmapResponse = await getRoadmapByToken();

        if (data?.phases && data.phases.length > 0) {
          setHasRoadmap(true);
        } else {
          setHasRoadmap(false);
        }
      } catch (e) {
        console.error("로드맵 조회 실패", e);
        setHasRoadmap(false);
      }
    };

    fetchRoadmap();
  }, []);

  if (hasRoadmap === null) return null;

  if (!hasRoadmap) {
    return (
      <div className="mt-40 flex flex-col items-center justify-center gap-6">
        <Image
          src="/bubu.svg"
          alt="bubu"
          width={100}
          height={100}
          className="opacity-90"
        />

        <p className="text-lg font-medium text-[#2f2f2f]">
          로드맵을 먼저 생성해볼까요?
        </p>

        <Link
          href="/roadmap/generate"
          className="rounded-xl bg-[#6D5DF6] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#5a4bc9]"
        >
          생성하러 가기
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <RoadmapTimelineSection />
           {/* <Image
        src="/Group-10.png"
        alt="커뮤니티 이미지"
        width={1600}
        height={500}
        className="h-auto w-full rounded-[24px] object-cover"
      /> */}
      <RoadmapKanbanBoard />
    </div>
  );
}
