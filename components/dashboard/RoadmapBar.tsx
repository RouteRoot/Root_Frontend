"use client";

import Link from "next/link";
import { useMemo } from "react";

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
  const loopItems = useMemo(() => {
    if (items.length === 0) return [];
    return [...items, ...items];
  }, [items]);

  const getCardStyle = (phase: 1 | 2 | 3) => {
    switch (phase) {
      case 1:
        return "bg-[#6b5ff1]";
      case 2:
        return "bg-[#6b5ff1]";
      case 3:
        return "bg-[#6b5ff1]";
      default:
        return "bg-[#6b5ff1]";
    }
  };

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

  if (items.length === 0) {
    return null;
  }

  return (
    <Link
      href="/roadmap"
      className="group mt-4 block w-full rounded-[30px] bg-white px-5 py-4"
    >
      <div className="overflow-hidden rounded-[2px]">
        <div className="roadmap-marquee flex w-max items-center gap-4">
          {loopItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className={`
                ${getCardStyle(item.phase)}
                flex h-[60px] min-w-[164px] shrink-0 items-center justify-between
                rounded-[20px] px-5
                transition-transform duration-300 group-hover:-translate-y-[1px]
              `}
            >
              <span className="line-clamp-1 pr-3 text-[15px] font-bold tracking-[-0.01em] text-white">
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

        .group:hover .roadmap-marquee {
          animation-play-state: paused;
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