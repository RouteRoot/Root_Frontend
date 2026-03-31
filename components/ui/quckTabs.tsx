"use client";

import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Map,
  Search,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

const quickLinks = [
  {
    label: "플래너",
    description: "오늘 할 일과 학습 계획 보기",
    href: "/plan",
    icon: CalendarDays,
  },
  {
    label: "로드맵",
    description: "전체 목표 흐름 확인하기",
    href: "/roadmap",
    icon: Map,
  },
  {
    label: "자격증 검색",
    description: "원하는 자격증 정보 찾기",
    href: "/certificate",
    icon: Search,
  },
  {
    label: "커뮤니티",
    description: "후기와 질문 둘러보기",
    href: "/community",
    icon: MessageSquare,
  },
];

export default function QuickTabs() {
  const router = useRouter();

  return (
    <section className="space-y-3">
      <div>
        <p className="text-sm text-neutral-500">빠른 이동</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickLinks.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.href}
              type="button"
              onClick={() => router.push(item.href)}
              className="group rounded-3xl border border-neutral-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="rounded-2xl bg-[#f5f5f2] p-3 transition group-hover:bg-black">
                  <Icon className="h-5 w-5 text-black transition group-hover:text-white" />
                </div>

                <ChevronRight className="h-5 w-5 text-neutral-300 transition group-hover:translate-x-1 group-hover:text-neutral-500" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-semibold text-black">
                  {item.label}
                </h3>
                <p className="text-sm leading-5 text-neutral-500">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
