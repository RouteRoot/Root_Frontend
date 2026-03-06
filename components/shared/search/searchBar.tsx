"use client";

import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="mt-10 flex items-center gap-3 w-full max-w-md border-b-2 border-[#6B4F3A] pb-2">
      <Search size={20} className="text-[#6B4F3A]" />

      <input
        type="text"
        placeholder="찾고 싶은 자격증을 검색하세요"
        className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500"
      />
    </div>
  );
}
