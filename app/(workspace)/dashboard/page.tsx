import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  MessageSquare,
  LayoutDashboard,
} from "lucide-react";

const quickLinks = [
  {
    title: "대시보드",
    description: "오늘의 흐름과 최근 작업을 한눈에 확인해요.",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "자격증 정보",
    description: "필요한 자격증 정보를 탐색하고 정리해요.",
    href: "/certificate",
    icon: BadgeCheck,
  },
  {
    title: "학습 플래너",
    description: "오늘 할 일과 학습 루틴을 계획해요.",
    href: "/planner",
    icon: BookOpen,
  },
  {
    title: "커뮤니티",
    description: "기록을 나누고 다른 사람들의 루틴을 참고해요.",
    href: "/community",
    icon: MessageSquare,
  },
];

const recents = [
  { title: "정보처리기사", meta: "최근 확인한 자격증" },
  { title: "학습 체크리스트", meta: "최근 수정한 플래너" },
  { title: "나의 자격증 로드맵", meta: "최근 열어본 페이지" },
];

export default function DashboardPage() {
  return (
    <div>
      <section className="mb-10">
        <p className="mb-2 text-[14px] text-[#a8a29e]">Workspace</p>

        <h1 className="text-[42px] font-bold tracking-[-0.03em] text-[#191919]">
          민서의 뿌리
        </h1>

        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#6b7280]">
          자격증을 탐색하고, 학습을 계획하고, 커뮤니티에서 기록을 나누는 나만의
          성장 워크스페이스예요.
        </p>
      </section>

      <section className="mb-12">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#2f2f2f]">
            빠른 이동
          </h2>
          <span className="text-[14px] text-[#a8a29e]">자주 사용하는 메뉴</span>
        </div>

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {quickLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-2xl border border-[#e7e5e4] bg-white p-5 transition hover:border-[#d6d3d1] hover:shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7f7f5] text-[#44403c]">
                  <Icon size={18} />
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#191919]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-6 text-[#6b7280]">
                      {item.description}
                    </p>
                  </div>

                  <ArrowRight
                    size={16}
                    className="mt-1 text-[#b0aba5] transition group-hover:translate-x-0.5"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mb-12">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#2f2f2f]">
            최근 항목
          </h2>
          <span className="text-[14px] text-[#a8a29e]">이어서 보기</span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#e7e5e4] bg-white">
          {recents.map((item, index) => (
            <div
              key={item.title}
              className={`flex items-center justify-between px-5 py-4 ${
                index !== recents.length - 1 ? "border-b border-[#f0eeeb]" : ""
              }`}
            >
              <div>
                <p className="text-[14px] font-medium text-[#191919]">
                  {item.title}
                </p>
                <p className="mt-1 text-[14px] text-[#8b8680]">{item.meta}</p>
              </div>

              <ArrowRight size={16} className="text-[#b0aba5]" />
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="rounded-2xl border border-[#e7e5e4] bg-white p-6">
          <p className="mb-2 text-[14px] text-[#a8a29e]">Today</p>
          <h2 className="text-[18px] font-semibold text-[#191919]">
            오늘은 어떤 흐름으로 시작할까?
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#6b7280]">
            자격증 정보에서 목표를 탐색한 뒤 학습 플래너로 이어지는 흐름을 먼저
            잡아보는 게 좋아요. 이후 커뮤니티에서 다른 사용자의 공부 방식도
            참고할 수 있어요.
          </p>
        </div>
      </section>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import DashboardSearchBar from "@/components/dashboard/SearchBar";
// import CertificationSection from "@/components/shared/card/ContentCardSection";
// import CommunitySection from "@/components/shared/card/CommunitySection";

// function SectionPlaceholder({
//   title,
//   height,
// }: {
//   title: string;
//   height?: string;
// }) {
//   return (
//     <section className="w-full">
//       <h2 className="mb-4 text-[15px] font-semibold text-[#676767]">{title}</h2>

//       <div
//         className={`w-full rounded-[20px] border border-[#E9E9E7] bg-white ${height ?? "h-55"}`}
//       />
//     </section>
//   );
// }

// const certificationMockData = [
//   {
//     id: 1,
//     title: "정보처리기사 완벽 가이드",
//     subtitle: "백엔드 필수 자격증",
//     image:
//       "data:image/jpeg;base64,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",
//     category: "IT",
//   },
//   {
//     id: 2,
//     title: "SQLD 자격증 한 번에 합격하기",
//     subtitle: "데이터베이스 기초 완성",
//     image:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStIPKrzgpDQTOv3y5vhhAqNQnr0X1pXo75vA&s",
//     category: "데이터",
//   },
//   {
//     id: 3,
//     title: "정보보안기사 핵심 정리",
//     subtitle: "보안 개념 완벽 이해",
//     image:
//       "https://library.gabia.com/wp-content/uploads/2021/02/2021-Cyber-security-threats-1200x795.jpeg",
//     category: "보안",
//   },
//   {
//     id: 4,
//     title: "AWS 자격증 입문 가이드",
//     subtitle: "클라우드 시작하기",
//     image:
//       "https://nextplatform.net/wp-content/uploads/2025/12/NXP-AWS-AIF-Prep-Guide.jpeg",
//     category: "클라우드",
//   },
// ];

// const communityMockData = [
//   {
//     id: 1,
//     title: "정보처리기사 같이 준비하실 분 구해요!",
//     subtitle: "온라인 스터디 / 주 3회",
//     image: "/images/community1.png",
//     category: "스터디 모집",
//   },
//   {
//     id: 2,
//     title: "SQLD 합격 후기 공유합니다",
//     subtitle: "2주 공부로 합격한 방법",
//     image: "/images/community2.png",
//     category: "후기",
//   },
//   {
//     id: 3,
//     title: "AWS 자격증 질문 있습니다",
//     subtitle: "SAA 준비 순서 질문",
//     image: "/images/community3.png",
//     category: "질문",
//   },
//   {
//     id: 4,
//     title: "백엔드 취업 준비 로드맵 공유",
//     subtitle: "자격증 + 프로젝트 정리",
//     image: "/images/community4.png",
//     category: "정보",
//   },
//   {
//     id: 5,
//     title: "백엔드 취업 준비 로드맵 공유",
//     subtitle: "자격증 + 프로젝트 정리",
//     image: "/images/community4.png",
//     category: "정보",
//   },
// ];

// export default function DashboardPage() {
//   const [keyword, setKeyword] = useState("");

//   const handleSearch = () => {
//     console.log("검색어:", keyword);
//   };

//   return (
//     <main className="min-h-screen bg-[#FAFAF8] px-8">
//       <div className="mx-auto max-w-280">
//         <div className="mb-12 flex justify-center">
//           <DashboardSearchBar
//             nickname="민서"
//             value={keyword}
//             onChange={setKeyword}
//             onSearch={handleSearch}
//           />
//         </div>

//         <div className="mb-10">
//           <CertificationSection data={certificationMockData} />
//         </div>

//         <div className="mb-10">
//           <SectionPlaceholder title="나만의 로드맵" height="h-[180px]" />
//         </div>

//         <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.6fr_0.7fr]">
//           <CommunitySection data={communityMockData} />
//           <SectionPlaceholder title="데일리 플랜" height="h-[220px]" />
//         </div>
//       </div>
//     </main>
//   );
// }
