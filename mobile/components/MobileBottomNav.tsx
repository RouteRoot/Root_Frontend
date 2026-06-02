"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mobileNavItems } from "@/mobile/utils/mobileNavigation";

function isActivePath(pathname: string, matchPaths: string[]) {
  return matchPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="모바일 하단 네비게이션"
      className="fixed inset-x-0 bottom-0 z-[90] border-t border-[#E5E8EB] bg-white/95 px-2 pb-[max(5px,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-6px_18px_rgba(15,23,42,0.07)] backdrop-blur lg:hidden"
    >
      <div className="mx-auto grid max-w-[430px] grid-cols-5">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(pathname, item.match);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-[8px] text-[10px] font-semibold transition-colors ${
                active
                  ? "bg-[#EEF4FF] text-[#4876EF]"
                  : "text-[#8A94A6] active:bg-[#F3F6FA]"
              }`}
            >
              <Icon className="h-4.5 w-4.5" strokeWidth={active ? 2.35 : 2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
