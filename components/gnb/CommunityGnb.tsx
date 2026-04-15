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
      <div className="mx-auto flex h-[80px] w-full max-w-[1640px] items-center justify-between px-55">
        <Link
          href="/dashboard"
          className={`flex items-center transition-colors duration-300 ${
            isDashboard ? "text-[#4F46E5]" : "text-[#1f2937]"
          }`}
          style={{
            fontFamily: "Arial, Helvetica, sans-serif",
            textShadow: isDashboard ? "0 0 0.2px #4F46E5" : "none",
          }}
        >
          {/* <Image
            src="/bubu.svg"
            alt="bubu"
            width={24}
            height={24}
            className="object-contain mt-0.5 mr-2"
            priority
          /> */}
          <span className="text-[24px] font-black italic tracking-[-0.04em]">
            BBURI
          </span>
          <span className="ml-[8px] text-[24px] font-black">.</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/certificate"
            className={`
              flex h-10 w-10 items-center justify-center rounded-full
              transition-all duration-200 active:scale-95
              ${
                pathname.startsWith("/certificate")
                  ? "bg-[#4F46E5] text-white"
                  : "text-[#94a3b8] hover:bg-[#f7f9fc] hover:text-[#4F46E5]"
              }
            `}
            aria-label="자격증"
          >
            <Search className="h-[20px] w-[20px]" />
          </Link>

          <Link
            href="/notification"
            className={`
              flex h-10 w-10 items-center justify-center rounded-full
              transition-all duration-200 active:scale-95
              ${
                pathname.startsWith("/notification")
                  ? "bg-[#4F46E5] text-white"
                  : "text-[#94a3b8] hover:bg-[#f7f9fc] hover:text-[#4F46E5]"
              }
            `}
            aria-label="알림"
          >
            <Bell className="h-[20px] w-[20px]" />
          </Link>

          <nav className="flex items-center gap-1 rounded-full bg-white p-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    rounded-full px-4 py-[10px] text-[13px] font-bold
                    transition-all duration-200 active:scale-95
                    ${
                      isActive
                        ? "bg-[#4F46E5] text-white shadow-sm"
                        : "text-[#94a3b8] hover:bg-[#f7f9fc] hover:text-[#4F46E5]"
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div ref={userMenuRef} className="relative ml-2">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="flex h-[44px] items-center gap-3 rounded-full border border-[#e7ebf2] bg-white px-4 transition-all duration-200 hover:bg-[#f7f9fc]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef2ff]">
                <User className="h-[15px] w-[15px] text-[#4F46E5]" />
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
                  className="flex w-full items-center gap-3 rounded-[12px] px-3 py-3 text-[14px] font-semibold text-[#ff4d4f] transition-colors duration-150 hover:bg-[#fff5f5]"
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
