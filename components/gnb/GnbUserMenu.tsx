"use client";

import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Props {
  userName: string;
  onLogout: () => void;
}

export default function GnbUserMenu({ userName, onLogout }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative flex h-full items-center px-2 z-100">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-9 items-center gap-2 rounded-[6px] px-2 text-[#667085] transition-colors hover:bg-[#f6f7f9]"
        aria-label="User menu"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#f2f4f7]">
          <User className="h-[17px] w-[17px]" />
        </span>
        <ChevronDown className="h-4 w-4" />
      </button>

      <div
        className={`absolute right-2 top-[46px] w-[220px] origin-top-right rounded-[10px] border border-[#e7ebf2] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition-all duration-200 ${
          isOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
        }`}
      >
        <div className="px-5 pb-3 pt-5">
          <p className="text-[10px] font-bold text-[#98a2b3]">ACCOUNT</p>
          <p className="text-[16px] font-extrabold text-[#1f2937]">
            {userName || "Guest"}
          </p>
        </div>

        <div className="px-2 pb-2">
          <Link
            href="/mypage"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 rounded-[8px] px-3 py-3 text-[14px] font-semibold text-[#475467] hover:bg-[#f8fafc]"
          >
            <User className="h-[16px] w-[16px]" />
            프로필
          </Link>

          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            className="mt-1 flex items-center gap-3 rounded-[8px] px-3 py-3 text-[14px] font-semibold text-[#475467] hover:bg-[#f8fafc]"
          >
            <Settings className="h-[16px] w-[16px]" />
            계정 설정
          </Link>
        </div>

        <div className="border-t border-[#eef2f6] px-2 py-2">
          <button
            type="button"
            onClick={() => { setIsOpen(false); onLogout(); }}
            className="flex w-full items-center gap-3 rounded-[8px] px-3 py-3 text-[14px] font-semibold text-[#ff4d4f] hover:bg-[#fff5f5]"
          >
            <LogOut className="h-[16px] w-[16px]" />
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
