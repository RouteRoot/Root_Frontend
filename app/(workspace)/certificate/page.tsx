"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CertificateSearchBar from "@/components/certificate/CertificateSearchBar";
import ExploreSectionHeader from "@/components/certificate/ExploreSectionHeader";

export default function Page() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const handleSearch = (searchedKeyword: string) => {
    router.push(
      `/certificate/search?keyword=${encodeURIComponent(searchedKeyword)}`
    );
  };

  return (
    <main className="px-8 py-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="text-center">
          <h1 className="text-[42px] font-black tracking-tight text-slate-900">
            Search <span className="italic text-indigo-600">Certificate</span>
          </h1>
          <p className="mt-4 text-[16px] font-semibold text-slate-500">
            나에게 맞는 자격증을 탐색해보세요.
          </p>
        </div>

        <div className="mt-10">
          <CertificateSearchBar
            value={keyword}
            onChange={setKeyword}
            onSearch={handleSearch}
          />
        </div>

        <div className="mt-16">
          <ExploreSectionHeader
            title="EXPLORE"
            description="다양한 분류의 자격증을 둘러보세요"
          />
        </div>

        <div className="mt-10 text-[14px] text-slate-400">자격증 카드들</div>
      </div>
    </main>
  );
}