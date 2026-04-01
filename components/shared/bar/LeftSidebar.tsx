"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BadgeCheck,
  CalendarDays,
  Map,
  MessageSquare,
  Settings,
  ChevronDown,
  Search,
  User,
  LogOut,
} from "lucide-react";

import { getMe } from "@/app/api/service/user";

const navItems = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Search", href: "/certificate", icon: BadgeCheck },
  { label: "AI Planner", href: "/plan", icon: CalendarDays },
  { label: "My Roadmap", href: "/roadmap", icon: Map },
  { label: "Community", href: "/community", icon: MessageSquare },
];

export default function LeftSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [userName, setUserName] = useState("사용자");
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const me = await getMe();
        setUserName(me.name ?? me.loginId ?? "사용자");
      } catch (error) {
        console.error("유저 정보 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("accessToken");
    router.push("/login");
  };

  return (
    <aside className="sticky top-0 h-screen w-[210px] shrink-0 border-r border-[#dddde6] bg-[#f7f7fa]">
      <div className="flex h-full flex-col">
        {/* 상단 */}
        <div className="flex items-center justify-between px-3 pb-2 pt-2">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className={`flex items-center gap-2 rounded-xl  py-1.5 transition-all duration-200 ${
                menuOpen
                  ? "bg-[#ececf4] shadow-[inset_0_0_0_1px_rgba(214,214,226,0.9)]"
                  : "hover:bg-[#efeff5] active:scale-[0.985]"
              }`}
            >
              <Image
                src="/logo1.svg"
                alt="logo"
                width={20}
                height={20}
                className="h-[25px] w-[25px] object-contain"
              />

              <span className="text-[20px] font-semibold tracking-[-0.02em] text-[#101010]">
                BBuri
              </span>

              <ChevronDown
                size={13}
                className={`text-[#131313] transition-transform duration-300 ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`absolute left-0 top-[46px] z-30 w-[232px] origin-top-left rounded-2xl border border-[#dfdfe8] bg-[#fcfcfe] shadow-[0_14px_32px_rgba(17,17,17,0.08)] transition-all duration-200 ${
                menuOpen
                  ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
              }`}
            >
              <div className="border-b border-[#ececf2] px-3 py-3">
                <p className="text-[11px] font-medium text-[#9b9bb0]">
                  Account
                </p>
                <p className="mt-1 text-[13px] font-semibold text-[#1c1c22]">
                  {loading ? "Loading..." : userName}
                </p>
              </div>

              <div className="p-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/mypage");
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-[#353543] transition-colors hover:bg-[#f1f1f7] active:bg-[#e9e9f2]"
                >
                  <User size={14} className="text-[#6f7082]" />
                  <span>User Info</span>
                </button>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-[#7a3f3f] transition-colors hover:bg-[#faf1f1] active:bg-[#f5e8e8]"
                >
                  <LogOut size={14} className="text-[#a05c5c]" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5f6475] transition hover:bg-[#efeff5] hover:text-[#111111]"
          >
            <Search size={15} />
          </button>
        </div>

        {/* 메뉴 */}
        <div className="px-2">
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex h-8 items-center gap-1.5 rounded-lg px-2 text-[12px] font-semibold transition ${
                    active
                      ? "bg-[#ececf4] text-[#111111]"
                      : "text-[#111111] hover:bg-[#efeff5] hover:text-[#111111]"
                  }`}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 구분선 */}
        <div className="mb-2 mt-3 px-3">
          <div className="h-px bg-[#e5e5ec]" />
        </div>

        {/* Recommend */}
        <div className="px-2">
          <p className="mb-1 px-2 text-[11px] font-medium text-[#9b9bb0]">
            Recommend
          </p>

          <div className="space-y-0.5">
            <Link
              href="/certificate"
              className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-[12px] font-semibold text-[#4f5565] transition hover:bg-[#efeff5] hover:text-[#111111]"
            >
              정보처리기사
            </Link>

            <Link
              href="/certificate"
              className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-[12px] font-semibold text-[#4f5565] transition hover:bg-[#efeff5] hover:text-[#111111]"
            >
              SQLD 자격증
            </Link>

            <Link
              href="/community"
              className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-[12px] font-semibold text-[#4f5565] transition hover:bg-[#efeff5] hover:text-[#111111]"
            >
              인기 게시물
            </Link>
          </div>
        </div>

        {/* 하단 */}
        <div className="mt-auto px-2 pb-3">
          <div className="mb-2 h-px bg-[#e5e5ec]" />

          <Link
            href="/settings"
            className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-[12px] font-medium text-[#4f5565] transition hover:bg-[#efeff5] hover:text-[#111111]"
          >
            <Settings size={14} />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}