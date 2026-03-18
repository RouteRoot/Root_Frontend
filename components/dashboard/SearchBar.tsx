"use client";

import { Search } from "lucide-react";
import { KeyboardEvent } from "react";

type DashboardSearchBarProps = {
  nickname?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
};

export default function DashboardSearchBar({
  nickname = "민서",
  value,
  onChange,
  onSearch,
}: DashboardSearchBarProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch?.();
    }
  };

  return (
    <div className="flex w-full justify-center">
      <div className="flex h-12 w-full max-w-105 items-center gap-3 rounded-full px-4 text-[15px] text-[#666666]">
        <Search
          className="h-4.5 w-4.5 shrink-0 text-[#6B6B6B]"
          strokeWidth={1.8}
        />

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`안녕하세요 ${nickname}님, 검색을 원하시나요?`}
          className="w-full bg-transparent text-[#333333] outline-none placeholder:text-[#666666]"
        />
      </div>
    </div>
  );
}
