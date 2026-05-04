"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CertificateSearchBar from "@/components/certificate/CertificateSearchBar";

const SUGGESTED_KEYWORDS = [
  "정보처리기사",
  "컴퓨터활용능력",
  "SQLD",
  "전기기사",
  "산업안전기사",
  "한국사능력검정시험",
];

export default function Page() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const handleSearch = (searchedKeyword: string) => {
    const trimmedKeyword = searchedKeyword.trim();
    if (!trimmedKeyword) return;

    router.push(
      `/certificate/search?keyword=${encodeURIComponent(trimmedKeyword)}`
    );
  };

  return (
    <div className="mx-auto w-full max-w-230">
      <section className="border-b border-[#E5E8EB] pb-12">
        <p className="text-[14px] font-semibold text-[#4876EF]">Certificate</p>
        <h1 className="mt-2 text-[30px] font-bold tracking-tight text-[#333333]">
          자격증 찾기
        </h1>
        <p className="mt-3 max-w-160 text-[15px] leading-[1.75] text-[#7B8798]">
          목표 자격증을 검색하고 시험 일정, 주관 기관, 상세 정보를 한 번에
          확인해보세요.
        </p>

        <div className="mt-8 max-w-140">
          <CertificateSearchBar
            value={keyword}
            onChange={setKeyword}
            onSearch={handleSearch}
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-[18px] font-semibold text-[#333333]">
          많이 찾는 자격증
        </h2>
        <div className="mt-5 flex flex-wrap gap-3">
          {SUGGESTED_KEYWORDS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleSearch(item)}
              className="rounded-full border border-[#DDE2EA] bg-white px-4 py-2 text-[14px] font-medium text-[#667085] transition-colors hover:border-[#4876EF] hover:text-[#4876EF]"
            >
              {item}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
