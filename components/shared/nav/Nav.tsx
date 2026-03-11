"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Nav() {
  const [isLogin, setIsLogin] = useState(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("accessToken");
  });

  const MENUS = [
    { name: "서비스 소개", href: "/" },
    { name: "자격증 정보", href: "/qualifications" },
    { name: "커리어 확인", href: "/services" },
    { name: "커뮤니티", href: "/contact" },
    { name: "고객센터", href: "/support" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLogin(false);
    window.location.href = "/";
  };

  return (
    <nav className="w-full h-16 bg-white">
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

          <ul className="absolute left-1/2 hidden -translate-x-1/2 gap-4 lg:flex xl:gap-6 2xl:gap-8">
            {MENUS.map((menu) => (
              <li key={menu.name}>
                <Link
                  href={menu.href}
                  className="whitespace-nowrap text-sm text-gray-500 hover:text-gray-900 xl:text-base"
                >
                  {menu.name}
                </Link>
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

            <button className="ml-4 text-2xl lg:hidden" aria-label="메뉴 열기">
              ☰
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
