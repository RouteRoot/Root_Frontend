"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CertificateResultCard from "@/components/certificate/CertificateResultcard";
import {
  searchCertificates,
  type CertificateSearchItem,
} from "@/app/api/certificate/certificate";

export default function CertificateSearchPage() {
  const searchParams = useSearchParams();
  const initialKeyword = searchParams.get("keyword") ?? "";

  const [keyword, setKeyword] = useState(initialKeyword);
  const [results, setResults] = useState<CertificateSearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async (searchedKeyword: string) => {
    const trimmedKeyword = searchedKeyword.trim();

    if (!trimmedKeyword) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const data = await searchCertificates(trimmedKeyword, 0, 50);
      setResults(data.content);
      setKeyword(trimmedKeyword);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialKeyword.trim()) return;
    fetchResults(initialKeyword);
  }, [initialKeyword]);

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
              {results.length}개
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
          <div>
            {results.map((item) => (
              <CertificateResultCard key={item.examCode} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
