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
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20">
        <Image
          src="/image 62.png"
          alt="bubu"
          width={72}
          height={72}
          className="mb-6 opacity-90"
        />

        <h2 className="text-center text-[22px] font-bold tracking-[-0.04em] text-[#0B1B3B]">
          AI가 나만의 커리어 로드맵을 설계해드려요
        </h2>
        <p className="mt-2 max-w-[400px] text-center text-[14px] leading-6 text-[#94A3B8]">
          현재 상태와 목표를 입력하면, AI가 단계별 자격증 취득 플랜을
          자동으로 설계해줍니다.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-[520px]">
          {[
            { title: "맞춤 학습 경로", desc: "수준·목표에 맞는\n자격증 로드맵" },
            { title: "단계별 플랜", desc: "주차별 세부\n학습 계획 자동 생성" },
            { title: "진행 현황 추적", desc: "취득 완료·진행 중\n현황 한눈에 파악" },
          ].map(({ title, desc }) => (
            <div
              key={title}
              className="flex flex-col gap-1.5 rounded-[14px] border border-[#E8EDF5] bg-[#FAFCFF] px-4 py-4"
            >
              <p className="text-[13px] font-semibold text-[#0B1B3B]">{title}</p>
              <p className="whitespace-pre-line text-[12px] leading-5 text-[#94A3B8]">{desc}</p>
            </div>
          ))}
        </div>

        <Link
          href="/roadmap/generate"
          className="mt-8 inline-flex h-[46px] items-center gap-2 rounded-[12px] bg-[#0075c3]/80 px-6 text-[14px] font-semibold text-white transition hover:opacity-90"
        >
          로드맵 생성하기
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
                 {/* <Image
        src="/Group 13.png"
        alt="커뮤니티 이미지"
        width={1600}
        height={500}
        className="h-auto w-full rounded-[24px] object-cover"
      /> */}
      <RoadmapTimelineSection />
      <RoadmapKanbanBoard />
    </div>
  );
}
