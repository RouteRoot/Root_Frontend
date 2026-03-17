"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BadgeCheck,
  BookOpen,
  MessageSquare,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const navItems = [
  { label: "대시보드", href: "/dashboard", icon: LayoutDashboard },
  { label: "자격증 정보", href: "/certificate", icon: BadgeCheck },
  { label: "학습 플래너", href: "/planner", icon: BookOpen },
  { label: "커뮤니티", href: "/community", icon: MessageSquare },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <aside
      className={`h-screen shrink-0 border-r border-[#e9e7e3] bg-[#f7f7f5] transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-58"
      }`}
    >
      <div className="flex h-full flex-col overflow-hidden">
        <div className="px-3 pt-2">
          <div
            className={`flex h-8 items-center rounded-md px-2 text-[14px] text-[#2f2f2f] hover:bg-[#ecebe7] ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            {!isCollapsed && (
              <div className="flex min-w-0 items-center gap-2">
                <span className="truncate font-medium">민서의 뿌리</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsCollapsed((prev) => !prev)}
              className="flex items-center justify-center text-[#78716c] hover:text-[#191919]"
            >
              {isCollapsed ? (
                <PanelLeftOpen size={16} />
              ) : (
                <PanelLeftClose size={16} />
              )}
            </button>
          </div>
        </div>

        <div className="px-3 pt-2">
          <button
            className={`flex h-8 w-full items-center rounded-md px-2 text-[14px] text-[#78716c] transition hover:bg-[#ecebe7] hover:text-[#191919] ${
              isCollapsed ? "justify-center" : "gap-2"
            }`}
          >
            <Search size={16} />
            {!isCollapsed && <span>검색</span>}
          </button>
        </div>

        <div className="px-3 pt-1">
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex h-8 items-center rounded-md px-2 text-[14px] transition ${
                    active
                      ? "bg-[#ecebe7] text-[#191919]"
                      : "text-[#5f5a54] hover:bg-[#ecebe7] hover:text-[#191919]"
                  } ${isCollapsed ? "justify-center" : "gap-2"}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon size={16} strokeWidth={1.9} />
                  {!isCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto px-3 pb-4">
          {!isCollapsed && (
            <>
              <div className="mb-1 px-2 text-[14px] text-[#9a948c]">
                최근 항목
              </div>

              <div className="space-y-0.5">
                <button className="flex h-8 w-full items-center gap-2 rounded-md px-2 text-[14px] text-[#5f5a54] transition hover:bg-[#ecebe7] hover:text-[#191919]">
                  <span className="truncate">정보처리기사</span>
                </button>

                <button className="flex h-8 w-full items-center gap-2 rounded-md px-2 text-[14px] text-[#5f5a54] transition hover:bg-[#ecebe7] hover:text-[#191919]">
                  <span className="truncate">학습 체크리스트</span>
                </button>

                <button className="flex h-8 w-full items-center gap-2 rounded-md px-2 text-[14px] text-[#5f5a54] transition hover:bg-[#ecebe7] hover:text-[#191919]">
                  <span className="truncate">나의 자격증 로드맵</span>
                </button>
              </div>
            </>
          )}
        </div>

        <div className="border-t border-[#ebe9e4] px-3 py-3">
          <button
            className={`flex h-8 w-full items-center rounded-md px-2 text-[14px] text-[#5f5a54] transition hover:bg-[#ecebe7] hover:text-[#191919] ${
              isCollapsed ? "justify-center" : "gap-2"
            }`}
            title={isCollapsed ? "설정" : undefined}
          >
            <span>⚙️</span>
            {!isCollapsed && <span>설정</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
