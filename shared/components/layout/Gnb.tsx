"use client";

import { getMe } from "@/features/auth/api/user";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { label: "Plan", href: "/plan" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Community", href: "/community" },
];

export default function Gnb() {
  const pathname = usePathname();
  const router = useRouter();

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
        console.error("Failed to load user:", error);
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
      console.error("Failed to clear local storage:", error);
    }

    setIsUserMenuOpen(false);
    router.push("/login");
  };

  return (
    <>
      <Link href="/dashboard">BBURI</Link>
      <Link href="/certificate">Certificate</Link>
      <Link href="/notification">Notification</Link>
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.label}
          {pathname.startsWith(item.href) ? " *" : ""}
        </Link>
      ))}
      <span ref={userMenuRef}>
        <button type="button" onClick={() => setIsUserMenuOpen((prev) => !prev)}>
          {userName || "Guest"}
        </button>
        {isUserMenuOpen && (
          <>
            <Link href="/mypage" onClick={() => setIsUserMenuOpen(false)}>
              My page
            </Link>
            <Link href="/settings" onClick={() => setIsUserMenuOpen(false)}>
              Settings
            </Link>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </span>
      <pre>{JSON.stringify({ pathname, userName, isUserMenuOpen }, null, 2)}</pre>
    </>
  );
}
