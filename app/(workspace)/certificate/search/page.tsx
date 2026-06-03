"use client";

import {
  searchCertificates,
  type CertificateSearchItem,
} from "@/app/api/certificate/certificate";
import { getCertificateDescriptionText } from "@/components/certificate/certificateDescription";
import CertificateResultCard from "@/components/certificate/CertificateResultcard";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  ChevronRight,
  Loader2,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const PAGE_SIZE = 50;

function getNextScheduleLabel(item: CertificateSearchItem) {
  const next = item.schedules.find(
    (schedule) => schedule.docExamStart || schedule.pracExamStart
  );

  if (!next) return "등록된 일정 없음";
  return next.docExamStart
    ? `필기 ${next.docExamStart}`
    : `실기 ${next.pracExamStart}`;
}

function MobileResultCard({ item }: { item: CertificateSearchItem }) {
  const descriptionText = getCertificateDescriptionText(item.description);

  return (
    <Link
      href={`/certificate/${encodeURIComponent(item.examCode)}`}
      className="block rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-4 shadow-[0_3px_12px_rgba(15,23,42,0.035)]"
    >
      <article>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              {item.category && (
                <span className="rounded-[6px] bg-[#F5F7FA] px-2 py-1 text-[11px] font-medium text-[#667085]">
                  {item.category}
                </span>
              )}
              {item.examGroup && (
                <span className="rounded-[6px] bg-[#EEF4FF] px-2 py-1 text-[11px] font-medium text-[#4876EF]">
                  {item.examGroup}
                </span>
              )}
            </div>
            <h3 className="mt-2 line-clamp-2 text-[16px] font-semibold leading-snug text-[#252A32]">
              {item.examName}
            </h3>
          </div>
          <ChevronRight className="mt-1 h-4.5 w-4.5 shrink-0 text-[#B3BBC8]" />
        </div>

        <p className="mt-2 line-clamp-2 text-[13px] leading-[1.55] text-[#667085]">
          {descriptionText || "자격증 상세 정보와 시험 일정을 확인해보세요."}
        </p>

        <div className="mt-3 space-y-1.5 text-[12px] font-medium text-[#8A94A6]">
          <span className="flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5" />
            <span className="min-w-0 truncate">
              {item.organization || "기관 정보 없음"}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            <span className="min-w-0 truncate">{getNextScheduleLabel(item)}</span>
          </span>
        </div>
      </article>
    </Link>
  );
}

export default function CertificateSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialKeyword = searchParams.get("keyword") ?? "";

  const [keyword, setKeyword] = useState(initialKeyword);
  const [searchValue, setSearchValue] = useState(initialKeyword);
  const [results, setResults] = useState<CertificateSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [totalElements, setTotalElements] = useState(0);

  const loaderRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(0);
  const hasMoreRef = useRef(false);
  const isFetchingRef = useRef(false);
  const keywordRef = useRef(initialKeyword.trim());

  const fetchResults = useCallback(async (searchedKeyword: string) => {
    const trimmedKeyword = searchedKeyword.trim();
    keywordRef.current = trimmedKeyword;

    if (!trimmedKeyword) {
      setKeyword("");
      setResults([]);
      setTotalElements(0);
      pageRef.current = 0;
      hasMoreRef.current = false;
      return;
    }

    try {
      setLoading(true);
      isFetchingRef.current = true;

      const data = await searchCertificates(trimmedKeyword, 0, PAGE_SIZE);
      setKeyword(trimmedKeyword);
      setResults(data.content);
      setTotalElements(data.totalElements);
      pageRef.current = data.number;
      hasMoreRef.current = !data.last;
    } catch {
      setResults([]);
      setTotalElements(0);
      pageRef.current = 0;
      hasMoreRef.current = false;
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!keywordRef.current || !hasMoreRef.current || isFetchingRef.current) {
      return;
    }

    try {
      isFetchingRef.current = true;
      setIsFetchingMore(true);

      const nextPage = pageRef.current + 1;
      const data = await searchCertificates(
        keywordRef.current,
        nextPage,
        PAGE_SIZE
      );

      setResults((prev) => {
        const seen = new Set(prev.map((item) => item.examCode));
        const next = data.content.filter((item) => !seen.has(item.examCode));
        return [...prev, ...next];
      });
      setTotalElements(data.totalElements);
      pageRef.current = data.number;
      hasMoreRef.current = !data.last;
    } catch {
      hasMoreRef.current = false;
    } finally {
      isFetchingRef.current = false;
      setIsFetchingMore(false);
    }
  }, []);

  useEffect(() => {
    setSearchValue(initialKeyword);
    void fetchResults(initialKeyword);
  }, [fetchResults, initialKeyword]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: "240px 0px", threshold: 0.1 }
    );

    const loader = loaderRef.current;
    if (loader) observer.observe(loader);

    return () => observer.disconnect();
  }, [loadMore]);

  const resultCountText =
    totalElements > results.length ? `${results.length}+개` : `${results.length}개`;

  const handleMobileSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchValue.trim();
    if (!trimmed) return;
    router.push(`/certificate/search?keyword=${encodeURIComponent(trimmed)}`);
  };

  return (
    <>
      <div className="mx-auto w-full max-w-[430px] px-4 pb-8 lg:hidden">
        <form
          onSubmit={handleMobileSearch}
          className="flex h-11 items-center gap-2 border-b border-[#E5E8EB] bg-white"
        >
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="back"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] text-[#252A32] active:bg-[#F3F6FA]"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <input
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="원하는 자격증, 분야 검색"
            className="min-w-0 flex-1 bg-transparent text-[14px] font-medium text-[#252A32] outline-none placeholder:text-[#98A2B3]"
          />
          <button
            type="submit"
            aria-label="search"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#4876EF] text-white active:bg-[#3F68D8]"
          >
            <Search className="h-4.5 w-4.5" />
          </button>
        </form>

        <section className="mt-5">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-[18px] font-semibold tracking-tight text-[#252A32]">
                검색 결과
              </h1>
              <p className="mt-1 truncate text-[13px] font-medium text-[#8A94A6]">
                {keyword ? `"${keyword}" 검색 결과` : "검색어를 입력해주세요"}
              </p>
            </div>
            {!loading && (
              <span className="shrink-0 text-[12px] font-semibold text-[#4876EF]">
                {resultCountText}
              </span>
            )}
          </div>

          {loading && (
            <div className="mt-4 space-y-2">
              {[0, 1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-4"
                >
                  <div className="h-4 w-32 animate-pulse rounded bg-[#EEF2F7]" />
                  <div className="mt-3 h-5 w-48 animate-pulse rounded bg-[#F3F6FA]" />
                  <div className="mt-3 h-3 w-full animate-pulse rounded bg-[#F3F6FA]" />
                  <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-[#F3F6FA]" />
                </div>
              ))}
            </div>
          )}

          {!loading && results.length === 0 && keyword && (
            <div className="mt-4 rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-12 text-center">
              <p className="text-[15px] font-semibold text-[#252A32]">
                검색 결과가 없어요.
              </p>
              <p className="mt-2 text-[13px] leading-[1.6] text-[#8A94A6]">
                다른 자격증명이나 분야로 다시 검색해보세요.
              </p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              <div className="mt-4 space-y-2">
                {results.map((item) => (
                  <MobileResultCard key={item.examCode} item={item} />
                ))}
              </div>
              <div ref={loaderRef} className="flex justify-center py-7">
                {isFetchingMore && (
                  <Loader2 className="h-5 w-5 animate-spin text-[#C0C8D5]" />
                )}
              </div>
            </>
          )}
        </section>
      </div>

      <div className="mx-auto mt-8 hidden w-full max-w-[1062px] lg:block">
        <section>
          <div className="flex items-center justify-between border-b border-[#DDE2EA] pb-4">
            <div>
              <h2 className="text-[18px] font-semibold text-[#333333]">
                검색 결과
              </h2>
              <p className="mt-1 text-[13px] text-[#8A94A6]">
                {keyword ? `"${keyword}" 검색 결과` : "검색어를 입력해주세요"}
              </p>
            </div>
            {!loading && (
              <span className="text-[13px] font-medium text-[#8A94A6]">
                {resultCountText}
              </span>
            )}
          </div>

          {loading && (
            <div className="space-y-6 py-6">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="animate-pulse border-b border-[#EEF2F7] pb-6"
                >
                  <div className="h-5 w-44 rounded bg-[#EEF2F7]" />
                  <div className="mt-4 h-4 w-full rounded bg-[#F3F6FA]" />
                  <div className="mt-2 h-4 w-2/3 rounded bg-[#F3F6FA]" />
                </div>
              ))}
            </div>
          )}

          {!loading && results.length === 0 && keyword && (
            <div className="py-20 text-center">
              <p className="text-[15px] font-medium text-[#7B8798]">
                검색 결과가 없습니다.
              </p>
              <p className="mt-2 text-[13px] text-[#A0A7B3]">
                GNB 검색창에서 다른 키워드로 다시 검색해보세요.
              </p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              <div>
                {results.map((item) => (
                  <CertificateResultCard key={item.examCode} item={item} />
                ))}
              </div>
              <div ref={loaderRef} className="flex justify-center py-8">
                {isFetchingMore && (
                  <Loader2 className="h-5 w-5 animate-spin text-[#C0C8D5]" />
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
}
