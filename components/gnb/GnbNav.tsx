"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./gnb-data";

export default function GnbNav() {
  const pathname = usePathname();

  return (
    <nav className="flex h-full items-center gap-1">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex h-full items-center px-[18px] text-[14px] font-normal text-[#2f3743] transition-colors hover:text-[#0FA9CC] after:absolute after:bottom-0 after:left-[18px] after:right-[18px] after:h-[2px] after:bg-[#0FA9CC] after:transition-opacity ${
              isActive ? "after:opacity-100" : "after:opacity-0"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
