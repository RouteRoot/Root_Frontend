"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const mockCertificates = [
  {
    slug: "information-processing-engineer",
    name: "정보처리기사",
    category: "국가기술자격",
    difficulty: "중",
    summary:
      "소프트웨어 개발, 데이터베이스, 운영체제, 네트워크 등 IT 전반의 기초 지식을 검증하는 대표 자격증",
    tags: ["개발", "CS", "취업", "국가자격증"],
  },
  {
    slug: "sqld",
    name: "SQLD",
    category: "민간자격",
    difficulty: "중하",
    summary:
      "데이터베이스 기본 이론과 SQL 활용 능력을 검증하는 대표적인 데이터 자격증",
    tags: ["데이터베이스", "SQL", "분석"],
  },
  {
    slug: "toeic",
    name: "TOEIC",
    category: "어학",
    difficulty: "중",
    summary:
      "취업 준비생이 가장 많이 준비하는 공인 영어 시험으로, 기업 지원 시 활용도가 높음",
    tags: ["영어", "취업", "어학"],
  },
];

export default function CertificateSearchPage() {
  const [query, setQuery] = useState("");

  const filteredCertificates = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    if (!keyword) return mockCertificates;

    return mockCertificates.filter((item) => {
      return (
        item.name.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword) ||
        item.summary.toLowerCase().includes(keyword) ||
        item.tags.some((tag) => tag.toLowerCase().includes(keyword))
      );
    });
  }, [query]);

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-[#111]">
      <section className="mb-10">
        <p className="mb-2 text-[14px] text-[#9a948c]">Certificate Search</p>
        <h1 className="text-[36px] font-bold tracking-[-0.02em] text-[#191919]">
          자격증 탐색
        </h1>
        <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#6b7280]">
          자격증 정보를 검색하고, 상세 페이지에서 시험 개요와 학습 포인트를
          확인할 수 있어요.
        </p>
      </section>

      {/* 검색 박스 */}
      <section className="mb-8 rounded-2xl border border-[#e7e5e4] bg-white p-5">
        <label
          htmlFor="certificate-search"
          className="mb-3 block text-[14px] text-[#9a948c]"
        >
          검색
        </label>
        <input
          id="certificate-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="예: 정보처리기사, SQL, 영어"
          className="w-full rounded-xl border border-[#e7e5e4] bg-[#fcfcfb] px-4 py-3 text-[15px] text-[#191919] outline-none placeholder:text-[#a8a29e] focus:border-[#cfcac3]"
        />
      </section>

      {/* 결과 개수 */}
      <section className="mb-5 flex items-center justify-between">
        <p className="text-[14px] text-[#8b8680]">
          검색 결과 {filteredCertificates.length}개
        </p>
      </section>

      {/* 결과 리스트 */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filteredCertificates.map((item) => (
          <Link
            key={item.slug}
            href={`/certificate/${item.slug}`}
            className="group rounded-2xl border border-[#e7e5e4] bg-white p-5 transition hover:border-[#d9d4cd] hover:bg-[#fcfcfb]"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full bg-[#f5f5f4] px-3 py-1 text-[12px] text-[#6b7280]">
                {item.category}
              </span>
              <span className="text-[13px] text-[#8b8680]">
                난이도 {item.difficulty}
              </span>
            </div>

            <h2 className="text-[22px] font-semibold text-[#191919]">
              {item.name}
            </h2>

            <p className="mt-3 text-[14px] leading-6 text-[#6b7280]">
              {item.summary}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#ece8e2] bg-[#faf8f6] px-2.5 py-1 text-[12px] text-[#7c746b]"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-5 text-[14px] font-medium text-[#44403c] transition group-hover:translate-x-0.5">
              상세 정보 보기 →
            </div>
          </Link>
        ))}
      </section>

      {filteredCertificates.length === 0 && (
        <section className="mt-10 rounded-2xl border border-[#e7e5e4] bg-white p-8 text-center">
          <p className="text-[16px] text-[#6b7280]">
            검색 결과가 없어요. 다른 키워드로 다시 찾아보세요.
          </p>
        </section>
      )}
    </div>
  );
}
