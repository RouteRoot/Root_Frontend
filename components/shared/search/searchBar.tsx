"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && keyword.trim()) {
      router.push(`/qualifications/${keyword}`);
    }
  };

  return (
    <div className="mt-10 flex items-center gap-3 w-full max-w-md border-b-2 border-[#6B4F3A] pb-2">
      <Search size={20} className="text-[#6B4F3A]" />

      <input
        type="text"
        placeholder="찾고 싶은 자격증을 검색하세요"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleSearch}
        className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500"
      />
    </div>
  );
}
