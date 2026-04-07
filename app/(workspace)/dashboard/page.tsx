import SectionHeader from "@/components/dashboard/SectionHeader";
import NoticeCard from "@/components/dashboard/NoticeCard";
import RoadmapBar from "@/components/dashboard/RoadmapBar";
import BubuBounce from "@/components/dashboard/BubuBounce";
import TodayPlanCard from "@/components/dashboard/TodayPlanCard";

import Image from "next/image";

const noticeMock = [
  {
    id: 1,
    date: "2026.02.01",
    title: "SQLD 자격증 한번에 따는 방법",
    description:
      "안녕하세요. 강사K입니다 오늘은 SQLD 자격증을 취득하는 방법에 대해 설명드리겠습니다 먼저 이 자격증은 왜 따야하냐면....",
  },
  {
    id: 2,
    date: "2026.01.01",
    title: "피그마 자격증에 대해",
    description:
      "안녕하세요. 오늘은 피그마에 대해서 알아 볼겁니다. 피그마 자격증이란 먼저 어떤거냐면 피그마 자격증이란...",
  },
];

export default function Page() {
  return (
    <div className="grid grid-cols-[minmax(0,2fr)_500px] gap-x-3 gap-y-10">
      {/* 위쪽: 왼쪽 묶음 */}
      <div className="flex flex-col gap-10">
        {/* NOTICE */}
        <div>
          <SectionHeader title="NOTICE" />
          <div className="mt-4 grid max-w-255 gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {noticeMock.map((notice) => (
              <NoticeCard key={notice.id} {...notice} />
            ))}
          </div>
        </div>

        {/* ROADMAP */}
        <div className="max-w-255">
          <RoadmapBar />
        </div>
      </div>

      {/* 위쪽: 오른쪽 PLAN */}
      <div>
        <SectionHeader title="PLAN" />
        <div className="mt-20">
          <BubuBounce className="ml-10" />

          <TodayPlanCard
            subtitle="현재 진행 중"
            certificateName="정보처리기사"
            currentDay={2}
            totalDay={39}
            href="/plan"
          />
        </div>
      </div>

      {/* 아래 한 줄 전체 */}
      <div className="col-span-2">
        <SectionHeader title="FEATURES" />
        
      </div>
    </div>
  );
}