"use client";

import { getMe } from "@/app/api/service/user";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GnbNav from "./GnbNav";
import GnbSearchBar from "./GnbSearchBar";
import GnbUserMenu from "./GnbUserMenu";

export default function Gnb() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    async function fetchMe() {
      try {
        const data = await getMe();
        setUserName(data.name);
      } catch (error) {
        console.error("Failed to fetch user:", error);
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
      console.error("Failed to clear storage on logout:", error);
    }
    router.push("/login");
  };

  return (
    <header
      className="fixed inset-x-0 z-50 bg-white text-[#222]"
      style={{ top: "var(--global-banner-height)" }}
    >
      <div className="flex h-[49px] items-center border-b border-[#e5e8eb]">
        <div className="flex h-full min-w-0 flex-1 items-center">
          <Link
            href="/dashboard"
            className="flex h-full w-[158px] items-center px-4 text-[28px] font-bold leading-none tracking-[-0.04em] text-[#0075c3]"
          >
            BBuri
          </Link>
          <GnbNav />
        </div>

        <div className="flex h-full items-center">
          <Link
            href="/notification"
            aria-label="Notifications"
            className="flex h-9 w-9 items-center justify-center rounded-[6px] text-[#475467] transition-colors hover:bg-[#f6f7f9]"
          >
            <Bell className="h-[18px] w-[18px]" strokeWidth={1.9} />
          </Link>
          <GnbUserMenu userName={userName} onLogout={handleLogout} />
          <Link
            href="/certificate"
            className="flex h-full items-center border-l border-[#e5e8eb] px-7 text-[13px] font-medium text-[#344054] transition-colors hover:text-[#0FA9CC]"
          >
            문의하기
          </Link>
        </div>
      </div>

      <GnbSearchBar />
    </header>
  );
}
