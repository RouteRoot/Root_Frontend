"use client";

import {
  searchCertificates,
  type CertificateSearchItem,
} from "@/app/api/certificate/certificate";
import { getMe } from "@/app/api/service/user";
import {
  ArrowLeft,
  Bell,
  LogIn,
  Menu,
  Search,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const mobileSearchCategories = [
  { label: "IT/개발", icon: "💻" },
  { label: "데이터", icon: "📊" },
  { label: "디자인", icon: "🎨" },
  { label: "마케팅", icon: "📢" },
  { label: "회계/세무", icon: "🧾" },
  { label: "전기/전자", icon: "⚡" },
  { label: "안전/보건", icon: "🛡️" },
  { label: "건축/토목", icon: "🚧" },
  { label: "물류/유통", icon: "📦" },
  { label: "교육", icon: "🎓" },
  { label: "금융", icon: "💰" },
  { label: "외국어", icon: "🌐" },
];

const mobileTrendingCertificates = [
  { name: "정보처리기사", isNew: true },
  { name: "컴퓨터활용능력 1급", isNew: true },
  { name: "산업안전기사", isNew: false },
  { name: "전기기사", isNew: false },
  { name: "빅데이터분석기사", isNew: true },
  { name: "SQL 개발자(SQLD)", isNew: false },
  { name: "데이터분석 준전문가(ADsP)", isNew: true },
  { name: "한국사능력검정시험", isNew: false },
  { name: "직업상담사 2급", isNew: false },
  { name: "GTQ 포토샵 1급", isNew: true },
];

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
      <div
        className={`mx-auto h-14 max-w-[430px] items-center justify-between px-4 ${
          searchOpen ? "hidden" : "flex"
        }`}
      >
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
            onClick={() => setMenuOpen((prev) => !prev)}
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
        <div
          className="absolute inset-x-0 top-0 z-[90] bg-white lg:hidden"
          style={{
            minHeight: "calc(100vh - var(--global-banner-height))",
          }}
        >
          <div className="mx-auto flex min-h-[calc(100vh-var(--global-banner-height))] max-w-[430px] flex-col px-4 pb-8 pt-3">
            <form
              onSubmit={handleSearchSubmit}
              className="flex h-11 items-center gap-2 bg-white"
            >
              <button
                type="button"
                onClick={closeSearch}
                aria-label="back"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] text-[#172033] active:bg-[#F3F6FA]"
              >
                <ArrowLeft className="h-5 w-5" strokeWidth={2.1} />
              </button>
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="원하는 자격증, 분야 검색"
                className="h-full min-w-0 flex-1 border-b border-[#E5E8EB] bg-transparent text-[14px] font-medium text-[#252A32] outline-none placeholder:text-[#98A2B3]"
                autoFocus
              />
              <button
                type="submit"
                aria-label="search submit"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#4876EF] text-white active:bg-[#3F68D8]"
              >
                <Search className="h-4.5 w-4.5" strokeWidth={2.4} />
              </button>
            </form>

            {searchQuery.trim() ? (
              <section className="mt-7">
                <div className="flex items-center justify-between">
                  <h2 className="text-[14px] font-bold text-[#252A32]">
                    검색 결과
                  </h2>
                  {isSearching && (
                    <span className="text-[12px] font-medium text-[#98A2B3]">
                      검색 중
                    </span>
                  )}
                </div>
                <div className="mt-3 space-y-2">
                  {!isSearching && searchResults.length === 0 && (
                    <p className="py-4 text-[13px] font-medium text-[#98A2B3]">
                      검색 결과가 없어요.
                    </p>
                  )}
                  {searchResults.map((certificate) => (
                    <button
                      key={certificate.examCode}
                      type="button"
                      onClick={() => handleResultClick(certificate.examCode)}
                      className="flex w-full items-center justify-between gap-3 rounded-[8px] border border-[#EEF1F5] bg-white px-3 py-3 text-left active:bg-[#F7F9FB]"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[14px] font-semibold text-[#252A32]">
                          {certificate.examName}
                        </span>
                        <span className="mt-1 block truncate text-[12px] font-medium text-[#98A2B3]">
                          {[certificate.category, certificate.organization]
                            .filter(Boolean)
                            .join(" · ") || "자격증 정보"}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            ) : (
              <>
                <section className="mt-8">
                  <h2 className="text-[14px] font-bold text-[#252A32]">
                    자격증 분야
                  </h2>
                  <div className="mt-4 grid grid-cols-3 gap-2.5">
                    {mobileSearchCategories.map((category) => (
                      <Link
                        key={category.label}
                        href={`/certificate/search?keyword=${encodeURIComponent(
                          category.label
                        )}`}
                        onClick={closeSearch}
                        className="flex min-h-10 items-center justify-center gap-2 rounded-[8px] bg-[#F7F9FB] px-2 text-[12px] font-semibold text-[#344054] active:bg-[#EEF4FF]"
                      >
                        <span className="shrink-0 text-[13px]">{category.icon}</span>
                        <span className="min-w-0 truncate">{category.label}</span>
                      </Link>
                    ))}
                  </div>
                </section>

                <section className="mt-8">
                  <div className="flex items-end gap-2">
                    <h2 className="text-[14px] font-bold text-[#252A32]">
                      자격증 검색 상승 순위
                    </h2>
                    <span className="text-[12px] font-semibold text-[#B3BBC8]">
                      실시간 기준
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-x-6">
                    {mobileTrendingCertificates.map((certificate, index) => (
                      <Link
                        key={certificate.name}
                        href={`/certificate/search?keyword=${encodeURIComponent(
                          certificate.name
                        )}`}
                        onClick={closeSearch}
                        className="flex min-h-9 items-center gap-3 text-[13px] active:bg-[#F7F9FB]"
                      >
                        <span
                          className={`w-5 shrink-0 text-center font-bold ${
                            index < 3 ? "text-[#4876EF]" : "text-[#C3C8D0]"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span className="min-w-0 flex-1 truncate font-medium text-[#344054]">
                          {certificate.name}
                        </span>
                        <span className="w-8 shrink-0 text-right text-[10px] font-bold text-[#16A34A]">
                          {certificate.isNew ? "NEW" : "-"}
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      )}

      {menuOpen && !searchOpen && (
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
