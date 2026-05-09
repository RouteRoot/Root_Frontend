"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  searchCertificates,
  type CertificateSearchItem,
} from "@/app/api/certificate/certificate";
import CertificateResultCard from "@/components/certificate/CertificateResultcard";

const PAGE_SIZE = 50;

export default function CertificateSearchPage() {
  const searchParams = useSearchParams();
  const initialKeyword = searchParams.get("keyword") ?? "";

  const [keyword, setKeyword] = useState(initialKeyword);
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
    totalElements > PAGE_SIZE ? `${PAGE_SIZE}+개` : `${totalElements}개`;

  return (
    <div className="mx-auto mt-8 w-full max-w-[1062px]">
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
  );
}
