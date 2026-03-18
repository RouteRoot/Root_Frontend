"use client";

import ContentCard from "@/components/shared/card/ContentCard";

const mockData = [
  {
    id: 1,
    title: "정보처리기사 완벽 가이드",
    image: "https://via.placeholder.com/400x300",
    category: "IT",
  },
  {
    id: 2,
    title: "SQLD 자격증 한 번에 합격하기",
    image: "https://via.placeholder.com/400x300",
    category: "데이터",
  },
  {
    id: 3,
    title: "UI/UX 디자인 기초 정리",
    image: "https://via.placeholder.com/400x300",
    category: "디자인",
  },
  {
    id: 4,
    title: "백엔드 개발자를 위한 로드맵",
    image: "https://via.placeholder.com/400x300",
    category: "백엔드",
  },
];

export default function CardTestPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {/* 제목 */}
        <h1 className="mb-8 text-2xl font-semibold text-black">카드 테스트</h1>

        {/* 카드 리스트 */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {mockData.map((item) => (
            <ContentCard
              key={item.id}
              title={item.title}
              image={item.image}
              category={item.category}
              onClick={() => alert(item.title)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
