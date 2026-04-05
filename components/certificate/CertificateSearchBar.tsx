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
  placeholder = "자격증명, 직무, 기술스택으로 검색해보세요",
}: CertificateSearchBarProps) {
  const handleSearch = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  };

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <div
        className="
          flex items-center rounded-full border border-[#E5E7EB] bg-white
          pl-6 pr-2 shadow-[0_4px_18px_rgba(15,23,42,0.06)]
          transition-all duration-200
          focus-within:border-[#C7D2FE]
          focus-within:shadow-[0_8px_24px_rgba(79,70,229,0.10)]
        "
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          placeholder={placeholder}
          className="
            h-[58px] min-w-0 flex-1 bg-transparent text-[15px] font-medium
            text-slate-700 outline-none
            placeholder:text-slate-400
          "
        />

        <button
          type="button"
          onClick={handleSearch}
          disabled={!value.trim()}
          className={`
            flex h-[46px] w-[46px] shrink-0 items-center justify-center
            rounded-full text-white transition-transform duration-200
            ${
              value.trim()
                ? "bg-indigo-600 hover:scale-105"
                : "cursor-not-allowed bg-slate-300"
            }
          `}
          aria-label="검색"
        >
          <Search size={20} />
        </button>
      </div>
    </div>
  );
}