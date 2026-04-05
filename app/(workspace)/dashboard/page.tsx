import SectionHeader from "@/components/dashboard/SectionHeader";
import NoticeCard from "@/components/dashboard/NoticeCard";
import RoadmapBar from "@/components/dashboard/RoadmapBar";
import BubuBounce from "@/components/dashboard/BubuBounce";
import TodayPlanCard from "@/components/dashboard/TodayPlanCard";

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

const roadmapMock = [
  { id: 1, title: "정보처리기사", status: "진행중" as const },
  { id: 2, title: "SQLD", status: "예정" as const },
  { id: 3, title: "리액트", status: "완료" as const },
  { id: 4, title: "토익", status: "예정" as const },
  { id: 5, title: "자격증", status: "예정" as const },
  { id: 6, title: "AWS-Developer", status: "예정" as const },
  { id: 7, title: "한국사 자격증", status: "예정" as const },
  { id: 8, title: "AWS-Solutions-Architect", status: "예정" as const },
];

export default function Page() {
  return (
    <div className="grid grid-cols-[minmax(0,2fr)_500px] gap-3">
      {/* 왼쪽 */}
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
          <RoadmapBar items={roadmapMock} />
        </div>

        {/* FEATURES */}
        <div>
          <SectionHeader title="FEATURES" />
          <div className="mt-4 text-[14px] text-slate-400">기능 영역</div>
        </div>
      </div>

      {/* 오른쪽 */}
      <div className="h-full">
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
    </div>
  );
}