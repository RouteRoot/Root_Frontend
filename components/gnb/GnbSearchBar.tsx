"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { certificateCategories, trendingCertificates } from "./gnb-data";

function TrendStatus({ isNew }: { isNew: boolean }) {
  if (isNew) {
    return <span className="text-[12px] font-bold text-[#16a34a]">NEW</span>;
  }
  return <span className="h-px w-2.5 rounded-full bg-[#9aa3af]" />;
}

type GnbSearchBarProps = {
  compact?: boolean;
};

export default function GnbSearchBar({ compact = false }: GnbSearchBarProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTrendIndex, setActiveTrendIndex] = useState(0);
  const [previousTrendIndex, setPreviousTrendIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const trendTimerRef = useRef<number | null>(null);

  const activeTrend = trendingCertificates[activeTrendIndex];
  const previousTrend = previousTrendIndex === null ? null : trendingCertificates[previousTrendIndex];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveTrendIndex((prev) => {
        const next = (prev + 1) % trendingCertificates.length;
        setPreviousTrendIndex(prev);
        if (trendTimerRef.current) window.clearTimeout(trendTimerRef.current);
        trendTimerRef.current = window.setTimeout(() => {
          setPreviousTrendIndex(null);
          trendTimerRef.current = null;
        }, 620);
        return next;
      });
    }, 3600);
    return () => {
      window.clearInterval(id);
      if (trendTimerRef.current) window.clearTimeout(trendTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/certificate/search?keyword=${encodeURIComponent(q)}`);
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  const inner = (
    <div ref={containerRef} className="relative w-full max-w-[1062px]">
        <div
          className={`flex h-[50px] w-full items-center bg-white px-4 transition-shadow ${
            isOpen
              ? "rounded-t-[7px] border border-b-0 border-[#0075c3]"
              : "rounded-[7px] border border-[#0075c3] hover:shadow-[0_0_0_3px_rgba(15,169,204,0.08)]"
          }`}
        >
          {isOpen ? (
            <form onSubmit={handleSearch} className="flex w-full items-center gap-3">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="원하는 자격증, 분야 검색"
                className="min-w-0 flex-1 text-[15px] text-[#2f3743] outline-none placeholder:text-[#bec0c4]"
              />
              <button
                type="submit"
                className="flex h-8 w-8 flex-none items-center justify-center rounded-[6px] bg-[#0075c3] transition-colors hover:bg-[#0d96b5]"
              >
                <Search className="h-[16px] w-[16px] text-white" strokeWidth={2.6} />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex h-full w-full items-center text-left"
              aria-expanded={isOpen}
              aria-haspopup="dialog"
            >
              <span className="min-w-0 flex-1 text-[15px] text-[#bec0c4]">
                원하는 자격증, 분야 검색
              </span>
              <span className="flex w-[304px] flex-none items-center">
                <Search className="h-[20px] w-[20px] flex-none text-[#0075c3]" strokeWidth={2.6} />
                <span className="mx-4 h-7 w-px flex-none bg-[#e5e8eb]" />
                <span className="relative h-6 w-5 flex-none overflow-hidden">
                  {previousTrend && previousTrendIndex !== null && (
                    <span className="gnb-trend-exit absolute inset-x-0 top-0 block h-full text-center text-[15px] font-extrabold leading-6 text-[#0FA9CC]">
                      {previousTrendIndex + 1}
                    </span>
                  )}
                  <span
                    key={activeTrendIndex}
                    className={`absolute inset-x-0 top-0 block h-full text-center text-[15px] font-extrabold leading-6 text-[#0FA9CC] ${
                      previousTrend ? "gnb-trend-enter" : ""
                    }`}
                  >
                    {activeTrendIndex + 1}
                  </span>
                </span>

                <span className="relative ml-5 h-6 w-[170px] flex-none overflow-hidden">
                  {previousTrend && (
                    <span
                      className="gnb-trend-exit absolute inset-x-0 top-0 block h-full truncate text-[15px] font-bold leading-6 text-[#333]"
                      title={previousTrend.name}
                    >
                      {previousTrend.name}
                    </span>
                  )}
                  <span
                    key={activeTrend.name}
                    className={`absolute inset-x-0 top-0 block h-full truncate text-[15px] font-bold leading-6 text-[#333] ${
                      previousTrend ? "gnb-trend-enter" : ""
                    }`}
                    title={activeTrend.name}
                  >
                    {activeTrend.name}
                  </span>
                </span>

                <span className="relative h-6 w-10 flex-none overflow-hidden">
                  {previousTrend && (
                    <span className="gnb-trend-exit absolute inset-x-0 top-0 flex h-full items-center justify-end">
                      <TrendStatus isNew={previousTrend.isNew} />
                    </span>
                  )}
                  <span
                    key={`${activeTrendIndex}-${activeTrend.isNew}`}
                    className={`absolute inset-x-0 top-0 flex h-full items-center justify-end ${
                      previousTrend ? "gnb-trend-enter" : ""
                    }`}
                  >
                    <TrendStatus isNew={activeTrend.isNew} />
                  </span>
                </span>
              </span>
            </button>
          )}
        </div>

        {isOpen && (
          <div className="absolute left-0 right-0 top-[50px] z-[70] rounded-b-[8px] border border-t-0 border-[#0FA9CC] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
            <div className="h-px bg-[#dfdfdf]" />
            <div className="p-7">
              <section>
                <h2 className="text-[16px] font-semibold text-[#2f3743]">
                  자격증 분야
                </h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {certificateCategories.map(({ label, icon }) => (
                    <Link
                      key={label}
                      href="/certificate"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 rounded-[8px] bg-[#f7f9fb] px-4 py-3 text-[14px] font-semibold text-[#344054] transition-colors hover:bg-[#eef8fb]"
                    >
                      <span>{icon}</span>
                      {label}
                    </Link>
                  ))}
                </div>
              </section>

              <section className="mt-7">
                <div className="flex items-end gap-3">
                  <h2 className="text-[16px] font-semibold text-[#2f3743]">
                    자격증 검색 상승 순위
                  </h2>
                  <span className="text-[13px] font-medium text-[#98a2b3]">
                    실시간 기준
                  </span>
                </div>
                <div className="mt-5 grid grid-cols-2 grid-rows-5 grid-flow-col gap-x-12 gap-y-4">
                  {trendingCertificates.map((certificate, index) => (
                    <Link
                      key={certificate.name}
                      href={`/certificate/search?keyword=${encodeURIComponent(certificate.name)}`}
                      onClick={() => setIsOpen(false)}
                      className="flex min-w-0 items-center gap-4 text-[15px] transition-colors hover:text-[#0FA9CC]"
                    >
                      <span
                        className={`w-5 flex-none text-center font-bold ${
                          index < 3 ? "text-[#0FA9CC]" : "text-[#c0c6cf]"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate font-normal text-[#2f3743]">
                        {certificate.name}
                      </span>
                      <span className="flex w-10 flex-none items-center justify-end">
                        <TrendStatus isNew={certificate.isNew} />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
  );

  if (compact) return inner;

  return (
    <div className="relative flex h-[64px] items-center justify-center border-b border-[#e5e8eb] bg-white px-6">
      {inner}
    </div>
  );
}
