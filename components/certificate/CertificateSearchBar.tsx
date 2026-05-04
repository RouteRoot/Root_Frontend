"use client";

import { Search } from "lucide-react";

type CertificateSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch: (keyword: string) => void | Promise<void>;
  placeholder?: string;
};

export default function CertificateSearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "자격증명, 분야, 기관 검색",
}: CertificateSearchBarProps) {
  const handleSearch = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  };

  return (
    <div className="w-full">
      <div className="flex h-12 items-center rounded-lg border border-[#DDE2EA] bg-white pl-4 pr-2 transition-colors focus-within:border-[#4876EF]">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-[15px] font-normal text-[#333333] outline-none placeholder:text-[#B8C0CC]"
        />

        <button
          type="button"
          onClick={handleSearch}
          disabled={!value.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#4876EF] text-white transition-colors disabled:bg-[#DDE7FF] hover:enabled:bg-[#3F68D8]"
          aria-label="검색"
        >
          <Search className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
