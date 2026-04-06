"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type RoadmapBarItem = {
  id: number;
  title: string;
  status: "진행중" | "예정" | "완료";
  phase: 1 | 2 | 3;
};

type RoadmapBarProps = {
  items?: RoadmapBarItem[];
};

const mockRoadmapItems: RoadmapBarItem[] = [
  { id: 1, title: "컴퓨터활용능력 2급", status: "진행중", phase: 1 },
  { id: 2, title: "SQLD", status: "진행중", phase: 2 },
  { id: 3, title: "리액트", status: "완료", phase: 3 },
  { id: 4, title: "토익", status: "예정", phase: 1 },
  { id: 5, title: "정보처리기사", status: "예정", phase: 2 },
  { id: 6, title: "AWS Developer", status: "예정", phase: 3 },
  { id: 7, title: "한국사 자격증", status: "예정", phase: 1 },
  { id: 8, title: "AWS Solution Architect", status: "예정", phase: 2 },
];

export default function RoadmapBar({
  items = mockRoadmapItems,
}: RoadmapBarProps) {
  const [isPaused, setIsPaused] = useState(false);

  const loopItems = useMemo(() => {
    if (items.length === 0) return [];
    return [...items, ...items];
  }, [items]);

  const getCardStyle = () => "bg-[#6b5ff1]";

  const getStatusStyle = (status: RoadmapBarItem["status"]) => {
    switch (status) {
      case "진행중":
        return "bg-white/22 text-white";
      case "완료":
        return "bg-white text-[#5B4CF0]";
      case "예정":
        return "bg-white/18 text-white/90";
      default:
        return "bg-white/22 text-white";
    }
  };

  if (items.length === 0) return null;

  return (
    <Link
      href="/roadmap"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="group mt-4 block w-full rounded-[30px] bg-white px-5 py-4"
    >
      <div className="overflow-hidden">
        <div
          className="roadmap-marquee flex w-max items-center gap-4"
          style={{
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {loopItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className={`
                ${getCardStyle()}
                flex h-[60px] min-w-[164px] shrink-0 items-center justify-between
                rounded-[20px] px-5
              `}
            >
              <span className="line-clamp-1 pr-3 text-[15px] font-bold text-white">
                {item.title}
              </span>

              <span
                className={`
                  ${getStatusStyle(item.status)}
                  shrink-0 rounded-full px-3 py-[6px]
                  text-[12px] font-extrabold leading-none
                `}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .roadmap-marquee {
          animation: roadmap-loop 50s linear infinite;
        }

        @keyframes roadmap-loop {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </Link>
  );
}