"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/dashboard")}
      className="mt-10 flex items-center gap-3 w-full max-w-107.5 border-b-2 border-[#000000] pb-2 cursor-pointer"
    >
      <Search size={20} className="text-[#000000]" />

      <input
        type="text"
        placeholder="로그인하고 이용해 보세요"
        readOnly
        className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500 cursor-pointer"
      />
    </div>
  );
}
