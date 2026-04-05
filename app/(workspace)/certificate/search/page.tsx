"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CertificateSearchBar from "@/components/certificate/CertificateSearchBar";
import ExploreSectionHeader from "@/components/certificate/ExploreSectionHeader";
import CertificateResultCard from "@/components/certificate/CertificateResultcard";
import {
  searchCertificates,
  type ExamSearchItem,
} from "@/app/api/certificate/certificate";

export default function CertificateSearchPage() {
  const searchParams = useSearchParams();
  const initialKeyword = searchParams.get("keyword") ?? "";

  const [keyword, setKeyword] = useState(initialKeyword);
  const [results, setResults] = useState<ExamSearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async (searchedKeyword: string) => {
    try {
      setLoading(true);
      const data = await searchCertificates(searchedKeyword);
      setResults(data);
      setKeyword(searchedKeyword);
    } catch (error) {
      console.error("자격증 검색 실패:", error);
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
    <main className="px-8 py-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="text-center">
          <h1 className="text-[42px] font-black tracking-tight text-slate-900">
            Search <span className="italic text-indigo-600">Certificate</span>
          </h1>
          <p className="mt-4 text-[16px] font-semibold text-slate-500">
            원하는 자격증 정보를 확인해보세요.
          </p>
        </div>

        <div className="mt-10">
          <CertificateSearchBar
            value={keyword}
            onChange={setKeyword}
            onSearch={fetchResults}
          />
        </div>

        <div className="mt-16">
          <ExploreSectionHeader
            title="RESULT"
            description={`${keyword || "검색어"} 검색 결과`}
          />
        </div>

        <div className="mt-10">
          {loading && (
            <p className="text-[14px] font-semibold text-slate-400">
              검색 중...
            </p>
          )}

          {!loading && results.length === 0 && keyword && (
            <p className="text-[14px] font-semibold text-slate-400">
              검색 결과가 없습니다.
            </p>
          )}

          {!loading && results.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {results.map((item, index) => (
                <CertificateResultCard
                  key={`${item.examName}-${index}`}
                  examName={item.examName}
                  schedules={item.schedules}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}