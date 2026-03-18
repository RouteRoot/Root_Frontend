"use client";

import ContentCard from "../card/ContentCard";

type Community = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  category: string;
};

type CommunitySectionProps = {
  data: Community[];
};

export default function CommunitySection({ data }: CommunitySectionProps) {
  return (
    <section className="w-full">
      {/* 헤더 */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[18px] font-semibold text-black">
          커뮤니티 인기글
        </h2>

        <button className="text-[13px] text-neutral-400 transition hover:text-black">
          전체보기 →
        </button>
      </div>

      {/* 스크롤 래퍼 */}
      <div className="relative">
        {/* 오른쪽 흐림 오버레이 */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-[#FAFAF8] via-[rgba(250,250,248,0.92)] to-transparent" />

        {/* 카드 스크롤 영역 */}
        <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-2">
          {data.map((item) => (
            <div key={item.id} className="w-[180px] shrink-0">
              <ContentCard
                title={item.title}
                subtitle={item.subtitle}
                image={item.image}
                category={item.category}
                onClick={() => console.log(item.title)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
