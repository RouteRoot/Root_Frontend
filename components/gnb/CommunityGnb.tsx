"use client";

import { getMe } from "@/app/api/service/user";
import { Bell, LogOut, Search, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { label: "플래너", href: "/plan" },
  { label: "로드맵", href: "/roadmap" },
  { label: "커뮤니티", href: "/community" },
];

export default function Gnb() {
  const pathname = usePathname();
  const router = useRouter();
  const isDashboard = pathname === "/dashboard";

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string>("");

  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    async function fetchMe() {
      try {
        const data = await getMe();
        setUserName(data.name);
      } catch (error) {
        console.error("유저 정보 불러오기 실패:", error);
        setUserName("");
      }
    }

    fetchMe();
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("roadmapId");
      localStorage.removeItem("examTaskId");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("로그아웃 중 로컬 스토리지 정리 실패:", error);
    }

    setIsUserMenuOpen(false);
    router.push("/login");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#e9edf3] bg-white">
      <div className="mx-auto flex h-[80px] w-full max-w-[1640px] items-center justify-between px-45">
        {/* 로고 */}
        <Link
          href="/dashboard"
          className={`flex items-center transition-colors duration-300 ${
            isDashboard ? "text-[#4876EF]" : "text-[#1f2937]"
          }`}
          style={{
            fontFamily: "Arial, Helvetica, sans-serif",
            textShadow: isDashboard ? "0 0 0.2px #4876EF" : "none",
          }}
        >
          <span className="text-[24px] font-black text-[#3067f1] italic tracking-[-0.04em]">
            BBURI
          </span>
          <span className="ml-[8px] text-[24px] font-black text-[#3067f1]">.</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* 검색 */}
          <Link
            href="/certificate"
            className={`
              flex h-10 w-10 items-center justify-center rounded-full
              transition-all duration-200 active:scale-95
              ${
                pathname.startsWith("/certificate")
                  ? "bg-[#4876EF] text-white"
                  : "text-[#94a3b8] hover:bg-[#f7f9fc] hover:text-[#4876EF]"
              }
            `}
          >
            <Search className="h-[20px] w-[20px]" />
          </Link>

          {/* 알림 */}
          <Link
            href="/notification"
            className={`
              flex h-10 w-10 items-center justify-center rounded-full
              transition-all duration-200 active:scale-95
              ${
                pathname.startsWith("/notification")
                  ? "bg-[#4876EF] text-white"
                  : "text-[#94a3b8] hover:bg-[#f7f9fc] hover:text-[#4876EF]"
              }
            `}
          >
            <Bell className="h-[20px] w-[20px]" />
          </Link>

          <nav className="flex items-center rounded-full bg-white p-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  //border transition-all duration-200 active:scale-95

                  className={`
                    rounded-[10px] px-4 py-[8px] text-[13px] font-bold
                    ${
                      isActive
                        ? "bg-[#4876EF] text-white border-[#4876EF] shadow-sm"
                        : "text-[#94a3b8] border-[#d1d1d1] hover:bg-[#f7f9fc] hover:text-[#4876EF] hover:border-[#4876EF]"
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* 유저 */}
          <div ref={userMenuRef} className="relative ml-2">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="flex h-[44px] items-center gap-3 rounded-full border border-[#e7ebf2] bg-white px-4 transition-all duration-200 hover:bg-[#f7f9fc]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef2ff]">
                <User className="h-[15px] w-[15px] text-[#4876EF]" />
              </span>

              <div className="flex flex-col leading-none">
                <span className="text-[10px] font-bold text-[#a0aec0]">
                  USER
                </span>
                <span className="text-[13px] font-extrabold text-[#1f2937]">
                  {userName || "Guest"}
                </span>
              </div>
            </button>

            {/* 드롭다운 */}
            <div
              className={`
                absolute right-0 top-[54px] w-[220px] origin-top-right
                rounded-[18px] border border-[#e7ebf2] bg-white
                shadow-[0_12px_30px_rgba(15,23,42,0.08)]
                transition-all duration-200
                ${
                  isUserMenuOpen
                    ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                    : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
                }
              `}
            >
              <div className="px-5 pb-3 pt-5">
                <p className="text-[9px] font-bold text-[#c8d0dc]">ACCOUNT</p>
                <p className="text-[16px] font-extrabold text-[#1f2937]">
                  {userName || "Guest"}
                </p>
              </div>

              <div className="px-2 pb-2">
                <Link
                  href="/mypage"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-3 rounded-[12px] px-3 py-3 text-[14px] font-semibold text-[#475467] hover:bg-[#f8fafc]"
                >
                  <User className="h-[16px] w-[16px]" />내 프로필
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="mt-1 flex items-center gap-3 rounded-[12px] px-3 py-3 text-[14px] font-semibold text-[#475467] hover:bg-[#f8fafc]"
                >
                  <Settings className="h-[16px] w-[16px]" />
                  계정 설정
                </Link>
              </div>

              <div className="border-t border-[#eef2f6] px-2 py-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-[12px] px-3 py-3 text-[14px] font-semibold text-[#ff4d4f] hover:bg-[#fff5f5]"
                >
                  <LogOut className="h-[16px] w-[16px]" />
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
