"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CertificateSearchBar from "@/features/certificate/components/CertificateSearchBar";
import ExploreSectionHeader from "@/features/certificate/components/ExploreSectionHeader";
import CertificateResultCard from "@/features/certificate/components/CertificateResultcard";
import {
  searchCertificates,
  type ExamSearchItem,
} from "@/features/certificate/api/certificate";

export default function CertificateSearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialKeyword = searchParams.get("keyword") ?? "";

  const [keyword, setKeyword] = useState(initialKeyword);
  const [results, setResults] = useState<ExamSearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async (searchedKeyword: string) => {
    const trimmedKeyword = searchedKeyword.trim();

    if (!trimmedKeyword) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const data = await searchCertificates(trimmedKeyword);
      setResults(data);
      setKeyword(trimmedKeyword);
    } catch (error) {
      console.error("Failed to search certificates:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchedKeyword: string) => {
    const trimmedKeyword = searchedKeyword.trim();

    if (!trimmedKeyword) {
      return;
    }

    router.push(
      `/certificate/search?keyword=${encodeURIComponent(trimmedKeyword)}`
    );
  };

  useEffect(() => {
    if (!initialKeyword.trim()) {
      return;
    }

    fetchResults(initialKeyword);
  }, [initialKeyword]);

  return (
    <>
      <CertificateSearchBar
        value={keyword}
        onChange={setKeyword}
        onSearch={handleSearch}
      />
      <ExploreSectionHeader
        title="RESULT"
        description={`${keyword || "Keyword"} search result`}
      />
      {loading && <p>Loading</p>}
      {!loading && results.length === 0 && keyword && <p>No results</p>}
      {!loading &&
        results.map((item, index) => (
          <CertificateResultCard
            key={`${item.examName}-${index}`}
            examName={item.examName}
            schedules={item.schedules}
          />
        ))}
      <pre>{JSON.stringify({ keyword, loading, results }, null, 2)}</pre>
    </>
  );
}
