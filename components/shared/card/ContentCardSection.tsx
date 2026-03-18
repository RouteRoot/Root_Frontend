"use client";

import ContentCard from "./ContentCard";

type Certification = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  category: string;
};

type CertificationSectionProps = {
  title?: string;
  data: Certification[];
};

export default function CertificationSection({
  title = "자격증 정보",
  data,
}: CertificationSectionProps) {
  return (
    <section className="w-full">
      {/* 헤더 */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-[#676767]">{title}</h2>

        <button className="text-[13px] text-neutral-400 transition hover:text-black">
          전체보기 →
        </button>
      </div>

      {/* 카드 리스트 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.map((item) => (
          <ContentCard
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            image={item.image}
            category={item.category}
            onClick={() => console.log(item.title)}
          />
        ))}
      </div>
    </section>
  );
}
