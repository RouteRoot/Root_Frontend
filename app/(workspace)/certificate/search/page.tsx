"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CertificateSearchBar from "@/components/certificate/CertificateSearchBar";
import ExploreSectionHeader from "@/components/certificate/ExploreSectionHeader";
import CertificateResultCard from "@/components/certificate/CertificateResultcard";
import {
  searchCertificates,
  type ExamSearchItem,
} from "@/app/api/certificate/certificate";

export default function CertificateSearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialKeyword = searchParams.get("keyword") ?? "";

  const [keyword, setKeyword] = useState(initialKeyword);
  const [results, setResults] = useState<ExamSearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async (searchedKeyword: string) => {
    const trimmedKeyword = searchedKeyword.trim();

    console.log("====================================");
    console.log("[검색 시작]");
    console.log("입력된 검색어:", searchedKeyword);
    console.log("trimmed 검색어:", trimmedKeyword);
    console.log("====================================");

    if (!trimmedKeyword) {
      console.log("[검색 중단] 검색어가 비어있음");
      setResults([]);
      return;
    }

    try {
      setLoading(true);

      console.log("[API 요청 전]");
      console.log("searchCertificates 호출 keyword:", trimmedKeyword);

      const data = await searchCertificates(trimmedKeyword);

      console.log("[API 응답 성공]");
      console.log("응답 전체 데이터:", data);
      console.log("배열 여부:", Array.isArray(data));
      console.log("결과 개수:", data?.length ?? 0);

      setResults(data);
      setKeyword(trimmedKeyword);
    } catch (error) {
      console.error("[자격증 검색 실패]");
      console.error("에러 내용:", error);
      setResults([]);
    } finally {
      setLoading(false);
      console.log("[검색 종료]");
    }
  };

  const handleSearch = (searchedKeyword: string) => {
    const trimmedKeyword = searchedKeyword.trim();

    console.log("====================================");
    console.log("[URL 이동]");
    console.log("검색바에서 전달받은 값:", searchedKeyword);
    console.log("trimmed 값:", trimmedKeyword);
    console.log("====================================");

    if (!trimmedKeyword) {
      console.log("[URL 이동 중단] 검색어 없음");
      return;
    }

    router.push(
      `/certificate/search?keyword=${encodeURIComponent(trimmedKeyword)}`
    );
  };

  useEffect(() => {
    console.log("====================================");
    console.log("[페이지 진입 / 쿼리 변경 감지]");
    console.log("initialKeyword:", initialKeyword);
    console.log("====================================");

    if (!initialKeyword.trim()) {
      console.log("[useEffect 종료] initialKeyword가 비어있음");
      return;
    }

    fetchResults(initialKeyword);
  }, [initialKeyword]);

  useEffect(() => {
    console.log("====================================");
    console.log("[state 변경]");
    console.log("keyword:", keyword);
    console.log("loading:", loading);
    console.log("results:", results);
    console.log("results.length:", results.length);
    console.log("====================================");
  }, [keyword, loading, results]);

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
            onChange={(value) => {
              console.log("[입력값 변경]", value);
              setKeyword(value);
            }}
            onSearch={handleSearch}
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
              {results.map((item, index) => {
                console.log("[카드 렌더링]", {
                  index,
                  examName: item.examName,
                  schedules: item.schedules,
                });

                return (
                  <CertificateResultCard
                    key={`${item.examName}-${index}`}
                    examName={item.examName}
                    schedules={item.schedules}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}