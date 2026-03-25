"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  BookOpen,
  Map,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ChevronRight,
  Sparkles,
  BadgeCheck,
} from "lucide-react";

import { getMe } from "@/app/api/service/user";

const navItems = [
  { label: "대시보드", href: "/dashboard", icon: LayoutDashboard },
  { label: "자격증 검색", href: "/qualifications", icon: BadgeCheck },
  { label: "플래너", href: "/planner", icon: BookOpen },
  { label: "로드맵", href: "/roadmap", icon: Map },
  { label: "커뮤니티", href: "/community", icon: MessageSquare },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userName, setUserName] = useState("사용자");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const me = await getMe();
        setUserName(me.name);
      } catch (error) {
        console.error("유저 정보 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  return (
    <aside
      className={`sticky top-0 h-screen shrink-0 border-r border-[#e9e7e3] bg-[#f7f7f5] transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-56"
      }`}
    >
      <div className="flex h-full flex-col overflow-hidden">
        {/* 상단 워크스페이스 */}
        <div className="px-3 pt-3">
          <div
            className={`rounded-2xl border border-[#ebe9e4] bg-white px-3 py-3 shadow-sm ${
              isCollapsed ? "flex justify-center" : ""
            }`}
          >
            {isCollapsed ? (
              <button
                type="button"
                onClick={() => setIsCollapsed(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-[#5f5a54] transition hover:bg-[#f3f2ee] hover:text-[#191919]"
                aria-label="사이드바 펼치기"
              >
                <PanelLeftOpen size={18} />
              </button>
            ) : (
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white">
                    <Sparkles size={18} />
                  </div>

                  <p className="text-[12px] text-[#9a948c]">Workspace</p>

                  <h2 className="truncate text-[15px] font-semibold text-[#191919]">
                    {loading ? "불러오는 중..." : `${userName}의 뿌리`}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCollapsed(true)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#78716c] transition hover:bg-[#f3f2ee] hover:text-[#191919]"
                  aria-label="사이드바 접기"
                >
                  <PanelLeftClose size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 검색 */}
        <div className="px-3 pt-3">
          <button
            className={`flex h-10 w-full items-center rounded-xl px-3 text-[14px] text-[#78716c] transition hover:bg-[#ecebe7] hover:text-[#191919] ${
              isCollapsed ? "justify-center" : "gap-2"
            }`}
          >
            <Search size={16} />
            {!isCollapsed && <span>검색</span>}
          </button>
        </div>

        {/* 메뉴 */}
        <div className="px-3 pt-2">
          {!isCollapsed && (
            <p className="mb-2 px-2 text-[12px] font-medium tracking-wide text-[#9a948c]">
              메뉴
            </p>
          )}

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  className={`group flex h-11 items-center rounded-xl px-3 text-[14px] transition ${
                    active
                      ? "bg-white text-[#191919] shadow-sm"
                      : "text-[#5f5a54] hover:bg-[#ecebe7] hover:text-[#191919]"
                  } ${isCollapsed ? "justify-center" : "justify-between"}`}
                >
                  <div
                    className={`flex items-center ${isCollapsed ? "" : "gap-3"}`}
                  >
                    <Icon size={18} strokeWidth={1.9} />
                    {!isCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </div>

                  {!isCollapsed && (
                    <ChevronRight
                      size={16}
                      className={`transition ${
                        active
                          ? "text-[#b0aaa3]"
                          : "text-transparent group-hover:text-[#b0aaa3]"
                      }`}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 하단 설정 */}
        <div className="mt-auto border-t border-[#ebe9e4] px-3 py-3">
          <button
            className={`flex h-10 w-full items-center rounded-xl px-3 text-[14px] text-[#5f5a54] transition hover:bg-[#ecebe7] hover:text-[#191919] ${
              isCollapsed ? "justify-center" : "gap-3"
            }`}
            title={isCollapsed ? "설정" : undefined}
          >
            <Settings size={17} />
            {!isCollapsed && <span>설정</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
