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
