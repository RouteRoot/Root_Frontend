"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useSyncExternalStore } from "react";

const MENUS = [
  {
    name: "서비스 소개",
    href: "/",
    sub: [
      { name: "자격증 탐색", href: "/" },
      { name: "로드맵 생성", href: "/" },
      { name: "나만의 플랜", href: "/" },
    ],
  },
  {
    name: "웹 정보",
    href: "/qualifications",
    sub: [
      { name: "자격증 탐색", href: "/qualifications/schedule" },
      { name: "자격증 상세 정보", href: "/qualifications/detail" },
    ],
  },

  {
    name: "커뮤니티",
    href: "/contact",
    sub: [
      { name: "스터디 모집", href: "/community/study" },
      { name: "뿌리 게시판", href: "/community/board" },
    ],
  },
  {
    name: "고객센터",
    href: "/support",
    sub: [
      { name: "FAQ", href: "/support/faq" },
      { name: "Q&A", href: "/support/qa" },
    ],
  },
];

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("accessToken");
}

function getServerSnapshot() {
  return false;
}

export default function Nav() {
  const [activeCol, setActiveCol] = useState<number | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isLogin = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const handleMenuEnter = (index: number) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setActiveCol(index);
  };

  const handleNavLeave = () => {
    leaveTimer.current = setTimeout(() => {
      setActiveCol(null);
    }, 120);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .sub-item {
          animation: fadeUp 0.18s ease both;
        }
      `}</style>

      <nav
        className="sticky top-0 z-50 h-16 w-full bg-white"
        onMouseLeave={handleNavLeave}
      >
        <div className="relative mx-auto flex h-full max-w-400 items-center px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-50">
          <div className="relative flex h-full w-full items-center lg:ml-10 xl:ml-16">
            <div className="flex shrink-0 items-center">
              <Link href="/">
                <Image
                  src="/logo.svg"
                  alt="ROOT Logo"
                  width={34}
                  height={50}
                  className="h-auto"
                />
              </Link>
            </div>

            <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-4 lg:flex xl:gap-6 2xl:gap-8">
              {MENUS.map((menu, i) => (
                <li
                  key={menu.name}
                  className="relative"
                  onMouseEnter={() => handleMenuEnter(i)}
                >
                  <Link
                    href={menu.href}
                    className={`whitespace-nowrap text-sm transition-colors xl:text-base ${
                      activeCol === i
                        ? "font-medium text-gray-900"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {menu.name}
                  </Link>

                  <div
                    className={`absolute left-1/2 top-full mt-4 -translate-x-1/2 transition-all duration-150 ${
                      activeCol === i
                        ? "visible opacity-100"
                        : "invisible pointer-events-none opacity-0"
                    }`}
                    onMouseEnter={() => handleMenuEnter(i)}
                  >
                    <div className="min-w-max border-l border-gray-200 pl-3">
                      <ul className="flex flex-col gap-1">
                        {menu.sub.map((sub, j) => (
                          <li
                            key={`${sub.name}-${j}`}
                            className="sub-item whitespace-nowrap"
                            style={{ animationDelay: `${j * 30}ms` }}
                          >
                            <Link
                              href={sub.href}
                              className="block text-sm leading-7 text-gray-600 transition-colors hover:text-gray-900"
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="ml-auto flex shrink-0 items-center">
              <div className="hidden items-center lg:flex">
                {!isLogin ? (
                  <>
                    <Link
                      href="/login"
                      className="text-sm text-gray-500 hover:text-gray-900 xl:text-base"
                    >
                      로그인
                    </Link>
                    <div className="mx-3 h-4 border-l border-gray-300" />
                    <Link
                      href="/signup"
                      className="text-sm text-gray-500 hover:text-gray-900 xl:text-base"
                    >
                      회원가입
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/mypage"
                      className="text-sm text-gray-500 hover:text-gray-900 xl:text-base"
                    >
                      마이페이지
                    </Link>
                    <div className="mx-3 h-4 border-l border-gray-300" />
                    <button
                      onClick={handleLogout}
                      className="text-sm text-gray-500 hover:text-gray-900 xl:text-base"
                    >
                      로그아웃
                    </button>
                  </>
                )}
              </div>

              <button
                className="ml-4 text-2xl lg:hidden"
                aria-label="메뉴 열기"
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
