"use client";

import {
  searchCertificates,
  type CertificateSearchItem,
} from "@/app/api/certificate/certificate";
import { getMe } from "@/app/api/service/user";
import { certificateCategories, trendingCertificates } from "@/components/gnb/gnb-data";
import { Bell, LogIn, Menu, Search, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MobileHeader() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CertificateSearchItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        if (mounted) setIsLoggedIn(false);
        return;
      }

      try {
        await getMe();
        if (mounted) setIsLoggedIn(true);
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        if (mounted) setIsLoggedIn(false);
      }
    }

    void checkSession();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const keyword = searchQuery.trim();

    if (!searchOpen || !keyword) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        setIsSearching(true);
        const results = await searchCertificates(keyword, 0, 6);
        if (!cancelled) setSearchResults(results.content);
      } catch {
        if (!cancelled) setSearchResults([]);
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [searchOpen, searchQuery]);

  const closeMenu = () => setMenuOpen(false);

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const openSearch = () => {
    setMenuOpen(false);
    setSearchOpen(true);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const keyword = searchQuery.trim();
    if (!keyword) return;

    router.push(`/certificate/search?keyword=${encodeURIComponent(keyword)}`);
    closeSearch();
  };

  const handleResultClick = (examCode: string) => {
    router.push(`/certificate/${encodeURIComponent(examCode)}`);
    closeSearch();
  };

  return (
    <header
      className="fixed inset-x-0 z-[70] border-b border-[#E5E8EB] bg-white/95 backdrop-blur lg:hidden"
      style={{ top: "var(--global-banner-height)" }}
    >
      <div className="mx-auto flex h-14 max-w-[430px] items-center justify-between px-4">
        <Link
          href={isLoggedIn ? "/dashboard" : "/"}
          className="text-[28px] font-bold leading-none tracking-[-0.04em] text-[#4876EF]"
          aria-label="bburi home"
        >
          bburi
        </Link>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={openSearch}
            aria-label="certificate search"
            className="flex h-11 w-11 items-center justify-center rounded-[8px] text-[#475467] transition-colors active:bg-[#F3F6FA]"
          >
            <Search className="h-5 w-5" strokeWidth={2.2} />
          </button>

          <button
            type="button"
            onClick={() => {
              setSearchOpen(false);
              setMenuOpen((prev) => !prev);
            }}
            aria-label="mobile menu"
            aria-expanded={menuOpen}
            className="flex h-11 w-11 items-center justify-center rounded-[8px] text-[#475467] transition-colors active:bg-[#F3F6FA]"
          >
            {menuOpen ? (
              <X className="h-5.5 w-5.5" strokeWidth={2.2} />
            ) : (
              <Menu className="h-5.5 w-5.5" strokeWidth={2.2} />
            )}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-[#EEF1F5] bg-white shadow-[0_16px_32px_rgba(15,23,42,0.12)]">
          <div className="mx-auto max-h-[calc(100vh-112px-var(--global-banner-height))] max-w-[430px] overflow-y-auto px-4 pb-5 pt-3">
            <form
              onSubmit={handleSearchSubmit}
              className="flex h-12 items-center gap-2 rounded-[8px] border border-[#4876EF] bg-white px-3"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="원하는 자격증, 분야 검색"
                className="min-w-0 flex-1 bg-transparent text-[15px] text-[#2F3743] outline-none placeholder:text-[#B3BBC8]"
                autoFocus
              />
              <button
                type="submit"
                aria-label="search submit"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#4876EF] text-white active:bg-[#3F68D8]"
              >
                <Search className="h-4.5 w-4.5" strokeWidth={2.4} />
              </button>
              <button
                type="button"
                onClick={closeSearch}
                aria-label="close search"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] text-[#8A94A6] active:bg-[#F3F6FA]"
              >
                <X className="h-4.5 w-4.5" strokeWidth={2.2} />
              </button>
            </form>

            {searchQuery.trim() ? (
              <section className="mt-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-[15px] font-bold text-[#2F3743]">
                    검색 결과
                  </h2>
                  {isSearching && (
                    <span className="text-[12px] font-semibold text-[#98A2B3]">
                      검색 중
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-2">
                  {!isSearching && searchResults.length === 0 && (
                    <p className="rounded-[8px] bg-[#F7F9FB] px-4 py-5 text-center text-[14px] font-medium text-[#98A2B3]">
                      검색 결과가 없습니다.
                    </p>
                  )}

                  {searchResults.map((certificate) => (
                    <button
                      key={certificate.examCode}
                      type="button"
                      onClick={() => handleResultClick(certificate.examCode)}
                      className="flex w-full items-start justify-between gap-3 rounded-[8px] border border-[#EEF1F5] bg-white px-4 py-3 text-left active:bg-[#F7F9FB]"
                    >
                      <span className="min-w-0">
                        <span className="block line-clamp-2 text-[15px] font-bold leading-[1.45] text-[#2F3743]">
                          {certificate.examName}
                        </span>
                        <span className="mt-1 block line-clamp-1 text-[12px] font-medium text-[#7B8798]">
                          {[certificate.category, certificate.organization]
                            .filter(Boolean)
                            .join(" · ") || "자격증 정보"}
                        </span>
                      </span>
                      <span className="shrink-0 rounded-full bg-[#EEF4FF] px-2.5 py-1 text-[11px] font-bold text-[#4876EF]">
                        {certificate.examGroup ?? "자격증"}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            ) : (
              <>
                <section className="mt-5">
                  <h2 className="text-[15px] font-bold text-[#2F3743]">
                    자격증 분야
                  </h2>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {certificateCategories.slice(0, 8).map(({ label, icon }) => (
                      <Link
                        key={label}
                        href="/certificate"
                        onClick={closeSearch}
                        className="flex min-h-11 items-center gap-2 rounded-[8px] bg-[#F7F9FB] px-3 text-[13px] font-semibold text-[#344054] active:bg-[#EEF4FF]"
                      >
                        <span className="shrink-0">{icon}</span>
                        <span className="min-w-0 truncate">{label}</span>
                      </Link>
                    ))}
                  </div>
                </section>

                <section className="mt-5">
                  <div className="flex items-end justify-between">
                    <h2 className="text-[15px] font-bold text-[#2F3743]">
                      인기 검색어
                    </h2>
                    <span className="text-[12px] font-semibold text-[#98A2B3]">
                      실시간 기준
                    </span>
                  </div>

                  <div className="mt-3 space-y-1">
                    {trendingCertificates.slice(0, 8).map((certificate, index) => (
                      <Link
                        key={certificate.name}
                        href={`/certificate/search?keyword=${encodeURIComponent(
                          certificate.name
                        )}`}
                        onClick={closeSearch}
                        className="flex min-h-10 items-center gap-3 rounded-[8px] px-2 text-[14px] active:bg-[#F7F9FB]"
                      >
                        <span
                          className={`w-5 shrink-0 text-center font-extrabold ${
                            index < 3 ? "text-[#4876EF]" : "text-[#B3BBC8]"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span className="min-w-0 flex-1 truncate font-semibold text-[#2F3743]">
                          {certificate.name}
                        </span>
                        {certificate.isNew && (
                          <span className="shrink-0 text-[11px] font-extrabold text-[#16A34A]">
                            NEW
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="border-t border-[#EEF1F5] bg-white shadow-[0_16px_32px_rgba(15,23,42,0.12)]">
          <div className="mx-auto max-w-[430px] px-4 py-3">
            {isLoggedIn ? (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/notification"
                  onClick={closeMenu}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-[#E5E8EB] text-[14px] font-semibold text-[#475467] active:bg-[#F3F6FA]"
                >
                  <Bell className="h-4.5 w-4.5" strokeWidth={2.2} />
                  알림
                </Link>
                <Link
                  href="/mypage"
                  onClick={closeMenu}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-[#E5E8EB] text-[14px] font-semibold text-[#475467] active:bg-[#F3F6FA]"
                >
                  <User className="h-4.5 w-4.5" strokeWidth={2.2} />
                  마이
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={closeMenu}
                className="flex min-h-12 items-center justify-center gap-2 rounded-[8px] bg-[#4876EF] text-[15px] font-bold text-white active:bg-[#3F68D8]"
              >
                <LogIn className="h-4.5 w-4.5" strokeWidth={2.2} />
                로그인
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
