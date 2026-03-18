"use client";

import ContentCard from "./ContentCard";

const certifications = [
  {
    id: 1,
    title: "정보처리기사 완벽 가이드",
    image: "/images/cert1.png",
    category: "IT",
  },
  {
    id: 2,
    title: "SQLD 자격증 한 번에 합격하기",
    image: "/images/cert2.png",
    category: "데이터",
  },
  {
    id: 3,
    title: "정보보안기사 핵심 정리",
    image: "/images/cert3.png",
    category: "보안",
  },
  {
    id: 4,
    title: "AWS 자격증 입문 가이드",
    image: "/images/cert4.png",
    category: "클라우드",
  },
];

export default function CertificationSection() {
  return (
    <section className="w-full">
      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-black">자격증 정보</h2>

        <button className="text-sm text-neutral-400 hover:text-black transition">
          전체보기 →
        </button>
      </div>

      {/* 카드 리스트 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {certifications.map((item) => (
          <ContentCard
            key={item.id}
            title={item.title}
            image={item.image}
            category={item.category}
            onClick={() => console.log(item.title)}
          />
        ))}
      </div>
    </section>
  );
}
