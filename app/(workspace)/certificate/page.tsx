"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CertificateSearchBar from "@/features/certificate/components/CertificateSearchBar";
import ExploreSectionHeader from "@/features/certificate/components/ExploreSectionHeader";

export default function Page() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const handleSearch = (searchedKeyword: string) => {
    router.push(
      `/certificate/search?keyword=${encodeURIComponent(searchedKeyword)}`
    );
  };

  return (
    <>
      <CertificateSearchBar
        value={keyword}
        onChange={setKeyword}
        onSearch={handleSearch}
      />
      <ExploreSectionHeader
        title="EXPLORE"
        description="Explore certificates"
      />
      <pre>{JSON.stringify({ keyword }, null, 2)}</pre>
    </>
  );
}
