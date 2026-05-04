"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWikiEditorAccess } from "./useWikiEditorAccess";

const ITEMS = [
  { label: "자격증 위키", href: "/certificate/wiki" },
  { label: "아카이브", href: "/certificate/archive" },
  { label: "자격증 탐색", href: "/certificate/explore" },
  { label: "커뮤니티", href: "/community" },
] as const;

export default function CertificateWikiSubNav() {
  const pathname = usePathname();
  const { isEditor } = useWikiEditorAccess();

  return (
    <nav className="border-b border-[#E5E8EB]">
      <div className="mx-auto flex max-w-265.5 items-center justify-between">
        <div className="flex items-center gap-8">
          {ITEMS.map((item) => {
            const active =
              item.href !== "/community" && pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative pb-4 pt-5 text-[15px] transition-colors ${
                  active
                    ? "font-medium text-[#333333]"
                    : "font-medium text-[#B3BBC8] hover:text-[#667085]"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-px left-0 h-0.5 w-full bg-[#4876EF]" />
                )}
              </Link>
            );
          })}
        </div>

        {isEditor && (
          <Link
            href="/certificate/wiki/write"
            className="inline-flex h-9 items-center rounded-[8px] border border-[#4876EF] bg-white px-4 text-[13px] font-medium text-[#4876EF] transition-colors hover:bg-[#F5F8FF]"
          >
            작성하기
          </Link>
        )}
      </div>
    </nav>
  );
}
