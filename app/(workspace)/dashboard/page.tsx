"use client";

import { useState } from "react";
import DashboardSearchBar from "@/components/dashboard/SearchBar";

function SectionPlaceholder({
  title,
  height,
}: {
  title: string;
  height?: string;
}) {
  return (
    <section className="w-full">
      <h2 className="mb-4 text-[15px] font-semibold text-[#676767]">{title}</h2>

      <div
        className={`w-full rounded-[20px] border border-[#E9E9E7] bg-white ${height ?? "h-[220px]"}`}
      />
    </section>
  );
}

export default function DashboardPage() {
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    console.log("검색어:", keyword);
  };

  return (
    <main className="min-h-screen px-8">
      <div className="mx-auto max-w-[1120px]">
        <div className="mb-12 flex justify-center">
          <DashboardSearchBar
            nickname="민서"
            value={keyword}
            onChange={setKeyword}
            onSearch={handleSearch}
          />
        </div>

        <div className="mb-10">
          <SectionPlaceholder title="자격증 정보" height="h-[240px]" />
        </div>

        <div className="mb-10">
          <SectionPlaceholder title="나만의 로드맵" height="h-[180px]" />
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.6fr_0.7fr]">
          <SectionPlaceholder title="커뮤니티 인기글" height="h-[220px]" />
          <SectionPlaceholder title="데일리 플랜" height="h-[220px]" />
        </div>
      </div>
    </main>
  );
}
