"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import {
  getAllCertificates,
  getExamCategories,
  type CertificateDetail,
} from "@/app/api/certificate/certificate";
import CertificateWikiSubNav from "@/components/certificate/CertificateWikiSubNav";

const PAGE_SIZE = 32;
const MOBILE_PAGE_SIZE = 10;

function getPageNumbers(currentPage: number, totalPages: number): number[] {
  const blockStart = Math.floor(currentPage / 10) * 10;
  const blockEnd = Math.min(blockStart + 10, totalPages);
  return Array.from({ length: blockEnd - blockStart }, (_, i) => blockStart + i + 1);
}

const ALL_FILTER = "전체";
const ETC_GROUP = "기타";

type CategoryGroup = {
  label: string;
  categories: string[];
};

const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    label: "기술·제조",
    categories: [
      "금형·공작기계",
      "기계장비설비·설치",
      "기계제작",
      "금속·재료",
      "자동차",
      "조선",
      "항공",
      "전기",
      "전자",
      "에너지·기상",
      "환경",
    ],
  },
  {
    label: "건설·인프라",
    categories: [
      "건축",
      "토목",
      "철도",
      "도시·교통",
      "건설배관",
      "단조·주조",
      "위험물",
      "안전관리",
    ],
  },
  {
    label: "IT·데이터",
    categories: ["정보기술", "디자인", "인쇄·사진"],
  },
  {
    label: "생산·품질·관리",
    categories: [
      "생산관리",
      "품질관리",
      "농산물품질관리사",
      "수산물품질관리사",
      "산업안전지도사",
      "산업보건지도사",
    ],
  },
  {
    label: "경영·전문직",
    categories: [
      "경영",
      "영업·판매",
      "세무사",
      "관세사",
      "변리사",
      "감정평가사",
      "노무사",
    ],
  },
  {
    label: "공공·행정",
    categories: [
      "공인중개사",
      "행정사",
      "경비지도사",
      "청소년지도사",
    ],
  },
  {
    label: "교육·복지",
    categories: [
      "교육·자연·과학·사회과학",
      "사회복지·종교",
      "청소년상담사",
      "보건·의료",
    ],
  },
  {
    label: "서비스·관광",
    categories: [
      "숙박·여행·오락·스포츠",
      "관광통역안내사",
      "호텔경영사",
      "호텔관리사",
      "호텔서비스사",
    ],
  },
  {
    label: "생활·기능 서비스",
    categories: [
      "조리",
      "제과·제빵",
      "이용·미용",
      "섬유",
      "의복",
      "목재·가구·공예",
    ],
  },
  {
    label: "농림·축산",
    categories: ["농업", "축산", "임업"],
  },
];

const EXAM_TYPE_STYLE: Record<string, string> = {
  국가기술자격: "bg-[#EEF4FF] text-[#4876EF]",
  국가전문자격: "bg-[#F5F8FF] text-[#5B79D6]",
  국가자격: "bg-[#F5F8FF] text-[#5B79D6]",
  국가공인민간자격: "bg-[#F7F9FC] text-[#667085]",
  민간자격: "bg-[#F7F9FC] text-[#8A94A6]",
};

function getCategoryLabel(certificate: CertificateDetail) {
  return (
    certificate.category?.trim() ||
    certificate.examGroup?.trim() ||
    "기타"
  );
}

function getExamTypeLabel(certificate: CertificateDetail) {
  return certificate.examType?.trim() || "유형 미정";
}

function getExamTypeStyle(examType: string) {
  return EXAM_TYPE_STYLE[examType] ?? "bg-[#F7F9FC] text-[#667085]";
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function normalizeCategory(value: string) {
  return value.replace(/[.\sㆍ]/g, "·").replace(/·+/g, "·").trim();
}

function categoryMatches(source: string, target: string) {
  return normalizeCategory(source) === normalizeCategory(target);
}

function getGroupLabel(category: string, groups: CategoryGroup[]) {
  return (
    groups.find((group) =>
      group.categories.some((groupCategory) =>
        categoryMatches(category, groupCategory)
      )
    )?.label ?? ETC_GROUP
  );
}

function getCanonicalCategoryLabel(category: string, groups: CategoryGroup[]) {
  for (const group of groups) {
    const matchedCategory = group.categories.find((groupCategory) =>
      categoryMatches(category, groupCategory)
    );

    if (matchedCategory) return matchedCategory;
  }

  return category;
}


type SortBy = "recommended" | "viewCount" | "name";

const SORT_OPTIONS: { label: string; value: SortBy }[] = [
  { label: "추천순", value: "recommended" },
  { label: "조회순", value: "viewCount" },
  { label: "이름순", value: "name" },
];

function SortDropdown({ value, onChange }: { value: SortBy; onChange: (v: SortBy) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = SORT_OPTIONS.find((o) => o.value === value)!;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 items-center gap-1.5 px-1 text-[13px] text-[#667085] transition-colors hover:text-[#4876EF]"
      >
        {selected.label}
        <ChevronDown className={`h-3.5 w-3.5 text-[#9AA3B2] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+4px)] z-10 min-w-25 overflow-hidden rounded-xl border border-[#E5E8EB] bg-white shadow-lg">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full px-4 py-2.5 text-left text-[13px] transition-colors hover:bg-[#F5F7FA] ${
                opt.value === value ? "font-semibold text-[#4876EF]" : "font-normal text-[#334155]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CertificateCardSkeleton() {
  return (
    <div className="min-h-[150px] rounded-[8px] border border-[#EEF2F7] bg-white p-5">
      <div className="h-5 w-20 rounded bg-[#EEF2F7]" />
      <div className="mt-5 h-4 w-32 rounded bg-[#F3F6FA]" />
      <div className="mt-3 h-5 w-40 rounded bg-[#EEF2F7]" />
      <div className="mt-8 h-4 w-24 rounded bg-[#F3F6FA]" />
    </div>
  );
}

function MobileCertificateExplorePage({
  groupOptions,
  subCategoryOptions,
  selectedGroup,
  selectedCategory,
  sortBy,
  certificates,
  filteredCount,
  currentPage,
  totalPages,
  isLoading,
  errorMessage,
  groupCounts,
  categoryCounts,
  apiGroupCountMap,
  onGroupChange,
  onCategoryChange,
  onSortChange,
  onPageChange,
}: {
  groupOptions: string[];
  subCategoryOptions: string[];
  selectedGroup: string;
  selectedCategory: string;
  sortBy: SortBy;
  certificates: CertificateDetail[];
  filteredCount: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  errorMessage: string;
  groupCounts: Record<string, number>;
  categoryCounts: Record<string, number>;
  apiGroupCountMap: Record<string, number>;
  onGroupChange: (group: string) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: SortBy) => void;
  onPageChange: (page: number) => void;
}) {
  const visiblePages = Array.from({ length: totalPages }, (_, index) => index)
    .filter((page) => {
      if (totalPages <= 5) return true;
      if (page === 0 || page === totalPages - 1) return true;
      return Math.abs(page - currentPage) <= 1;
    });

  return (
    <div className="mx-auto flex w-full max-w-[430px] flex-col gap-4 pb-8">
      <nav className="-mx-4 border-b border-[#E5E8EB] bg-white px-4">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
          {[
            { label: "자격증 위키", href: "/certificate/wiki" },
            { label: "아카이브", href: "/certificate/archive" },
            { label: "자격증 탐색", href: "/certificate/explore" },
            { label: "커뮤니티", href: "/community" },
          ].map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative shrink-0 pb-3 pt-3 text-[14px] font-medium ${
                tab.href === "/certificate/explore" ? "text-[#252A32]" : "text-[#98A2B3]"
              }`}
            >
              {tab.label}
              {tab.href === "/certificate/explore" && (
                <span className="absolute bottom-[-1px] left-0 h-0.5 w-full bg-[#4876EF]" />
              )}
            </Link>
          ))}
        </div>
      </nav>

      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h1 className="text-[20px] font-semibold text-[#252A32]">자격증 탐색</h1>
            {isLoading && (
              <div className="mt-1 flex h-4 items-center">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#98A2B3]" />
              </div>
            )}
            <p className={`mt-1 text-[12px] font-medium text-[#98A2B3] ${isLoading ? "hidden" : ""}`}>
              {filteredCount.toLocaleString()}개 자격증
            </p>
          </div>
          <SortDropdown value={sortBy} onChange={onSortChange} />
        </div>

        <div className="grid grid-flow-col grid-rows-2 auto-cols-max gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {groupOptions.map((group) => {
            const active = selectedGroup === group;
            return (
              <button
                key={group}
                type="button"
                onClick={() => onGroupChange(group)}
                className={`min-h-9 rounded-[8px] border px-3 text-[12px] font-medium ${
                  active
                    ? "border-[#4876EF] bg-[#4876EF] text-white"
                    : "border-[#E5E8EB] bg-white text-[#667085]"
                }`}
              >
                {group}
                <span className={`ml-1 ${active ? "text-white/70" : "text-[#A0AEC0]"}`}>
                  {group === ALL_FILTER
                    ? (groupCounts[ALL_FILTER] ?? 0)
                    : (apiGroupCountMap[group] ?? groupCounts[group] ?? 0)}
                </span>
              </button>
            );
          })}
        </div>

        {subCategoryOptions.length > 1 && (
          <div className="flex snap-x gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {subCategoryOptions.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => onCategoryChange(category)}
                  className={`min-h-8 shrink-0 snap-start rounded-full border px-3 text-[12px] font-medium ${
                    active
                      ? "border-[#4876EF] bg-[#EEF4FF] text-[#4876EF]"
                      : "border-[#E5E8EB] bg-white text-[#667085]"
                  }`}
                >
                  {category}
                  <span className={`ml-1 ${active ? "text-[#4876EF]" : "text-[#A0AEC0]"}`}>
                    {category === ALL_FILTER
                      ? (apiGroupCountMap[selectedGroup] ?? categoryCounts[ALL_FILTER] ?? 0)
                      : (categoryCounts[category] ?? 0)}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-[8px] bg-white" />
          ))}
        </div>
      ) : errorMessage ? (
        <div className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-8 text-center text-[13px] text-[#8A94A6]">
          {errorMessage}
        </div>
      ) : certificates.length > 0 ? (
        <section className="space-y-2">
          {certificates.map((certificate) => {
            const examType = getExamTypeLabel(certificate);
            const hasSchedule = (certificate.schedules?.length ?? 0) > 0;
            return (
              <Link
                key={certificate.examCode}
                href={`/certificate/${encodeURIComponent(certificate.examCode)}`}
                className="block rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-4 active:bg-[#F7F9FB]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`rounded-sm px-2 py-0.5 text-[11px] font-medium ${getExamTypeStyle(examType)}`}>
                    {examType}
                  </span>
                  {!certificate.isActive && (
                    <span className="shrink-0 rounded-md bg-[#F7F9FC] px-2 py-1 text-[11px] font-medium text-[#9AA3B2]">
                      비활성
                    </span>
                  )}
                </div>
                <p className="mt-3 line-clamp-1 text-[12px] font-medium text-[#667085]">
                  {certificate.organization || "기관 정보 없음"}
                </p>
                <h2 className="mt-1.5 line-clamp-2 text-[16px] font-semibold leading-[1.45] text-[#252A32]">
                  {certificate.examName}
                </h2>
                <div className="mt-3 flex items-center justify-between text-[12px] font-medium text-[#8A94A6]">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {hasSchedule ? "일정 있음" : "일정 확인"}
                  </span>
                  <ChevronRight className="h-4 w-4 text-[#C0C8D5]" />
                </div>
              </Link>
            );
          })}
        </section>
      ) : (
        <div className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-8 text-center text-[13px] text-[#8A94A6]">
          조건에 맞는 자격증이 없어요.
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {visiblePages.map((page, index) => {
            const previousPage = visiblePages[index - 1];
            const showGap = index > 0 && page - previousPage > 1;
            const active = page === currentPage;

            return (
              <div key={page} className="flex items-center gap-1.5">
                {showGap && <span className="px-1 text-[12px] font-medium text-[#98A2B3]">...</span>}
                <button
                  type="button"
                  onClick={() => onPageChange(page)}
                  className={`flex h-9 min-w-9 items-center justify-center rounded-[8px] px-2 text-[13px] font-semibold ${
                    active
                      ? "bg-[#4876EF] text-white"
                      : "border border-[#E5E8EB] bg-white text-[#667085]"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {page + 1}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CertificateExplorePage() {
  const [certificates, setCertificates] = useState<CertificateDetail[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState(ALL_FILTER);
  const [selectedCategory, setSelectedCategory] = useState(ALL_FILTER);
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>(CATEGORY_GROUPS);
  const [sortBy, setSortBy] = useState<SortBy>("recommended");
  const [apiGroupCountMap, setApiGroupCountMap] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    async function loadAll() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const data = await getAllCertificates(0, 9999);
        if (mounted) {
          setCertificates(data.content);
          setTotalCount(data.totalElements);
        }
      } catch {
        if (mounted) {
          setCertificates([]);
          setErrorMessage("자격증 목록을 불러오지 못했어요.");
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadAll();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    getExamCategories()
      .then((tree) => {
        if (!mounted) return;
        const groups = tree
          .filter((item) => item.subCategories.length > 0)
          .map((item) => ({
            label: item.examCategoryName,
            categories: item.subCategories.map((sub) => sub.examCategoryName),
          }));
        if (groups.length > 0) setCategoryGroups(groups);

        const groupMap: Record<string, number> = {};
        const subMap: Record<string, number> = {};
        for (const parent of tree) {
          groupMap[parent.examCategoryName] = parent.examCount;
          for (const sub of parent.subCategories) {
            subMap[sub.examCategoryName] = sub.examCount;
          }
        }
        setApiGroupCountMap(groupMap);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  const etcCategories = useMemo(() => {
    const loaded = uniqueValues(
      certificates.map((c) => getCanonicalCategoryLabel(getCategoryLabel(c), categoryGroups))
    );
    return loaded.filter((cat) => getGroupLabel(cat, categoryGroups) === ETC_GROUP);
  }, [certificates, categoryGroups]);

  const groupOptions = useMemo(() => {
    const allGroups = categoryGroups.map((g) => g.label).filter((g) => g !== ETC_GROUP);
    return [
      ALL_FILTER,
      ...allGroups,
      ...(etcCategories.length > 0 ? [ETC_GROUP] : []),
    ];
  }, [categoryGroups, etcCategories]);

  const subCategoryOptions = useMemo(() => {
    if (selectedGroup === ALL_FILTER) return [ALL_FILTER];
    if (selectedGroup === ETC_GROUP) return [ALL_FILTER, ...etcCategories];
    const group = categoryGroups.find((g) => g.label === selectedGroup);
    return [ALL_FILTER, ...(group?.categories ?? [])];
  }, [selectedGroup, categoryGroups, etcCategories]);

  const groupFilteredCertificates = useMemo(() => {
    if (selectedGroup === ALL_FILTER) return certificates;
    return certificates.filter(
      (certificate) =>
        getGroupLabel(getCategoryLabel(certificate), categoryGroups) === selectedGroup
    );
  }, [certificates, selectedGroup, categoryGroups]);

  const filteredCertificates = useMemo(() => {
    const filtered = groupFilteredCertificates.filter((certificate) => {
      if (selectedCategory === ALL_FILTER) return true;
      return categoryMatches(getCategoryLabel(certificate), selectedCategory);
    });

    return filtered.sort((a, b) => {
      if (sortBy === "viewCount") {
        return (b.viewCount ?? 0) - (a.viewCount ?? 0);
      }
      if (sortBy === "name") {
        return a.examName.localeCompare(b.examName, "ko");
      }
      const activeScore = Number(b.isActive) - Number(a.isActive);
      if (activeScore !== 0) return activeScore;
      const scheduleScore = (b.schedules?.length ?? 0) - (a.schedules?.length ?? 0);
      if (scheduleScore !== 0) return scheduleScore;
      return a.examName.localeCompare(b.examName, "ko");
    });
  }, [groupFilteredCertificates, selectedCategory, sortBy]);

  const groupCounts = useMemo(() => {
    const counts = certificates.reduce<Record<string, number>>((acc, certificate) => {
      const groupLabel = getGroupLabel(getCategoryLabel(certificate), categoryGroups);
      acc[groupLabel] = (acc[groupLabel] ?? 0) + 1;
      return acc;
    }, {});
    counts[ALL_FILTER] = totalCount;
    return counts;
  }, [certificates, categoryGroups, totalCount]);

  const categoryCounts = useMemo(() => {
    return groupFilteredCertificates.reduce<Record<string, number>>(
      (acc, certificate) => {
        const category = getCanonicalCategoryLabel(getCategoryLabel(certificate), categoryGroups);
        acc[category] = (acc[category] ?? 0) + 1;
        acc[ALL_FILTER] = (acc[ALL_FILTER] ?? 0) + 1;
        return acc;
      },
      {}
    );
  }, [groupFilteredCertificates, categoryGroups]);

  const totalFilteredPages = Math.ceil(filteredCertificates.length / PAGE_SIZE);

  const paginatedCertificates = useMemo(
    () => filteredCertificates.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE),
    [filteredCertificates, currentPage]
  );

  const mobileTotalFilteredPages = Math.ceil(filteredCertificates.length / MOBILE_PAGE_SIZE);

  const mobilePaginatedCertificates = useMemo(
    () =>
      filteredCertificates.slice(
        currentPage * MOBILE_PAGE_SIZE,
        (currentPage + 1) * MOBILE_PAGE_SIZE
      ),
    [filteredCertificates, currentPage]
  );

  useEffect(() => { setCurrentPage(0); }, [selectedGroup, selectedCategory, sortBy]);

  const hasSubCategories = subCategoryOptions.length > 1;

  return (
    <div>
      <div className="lg:hidden">
        <MobileCertificateExplorePage
          groupOptions={groupOptions}
          subCategoryOptions={subCategoryOptions}
          selectedGroup={selectedGroup}
          selectedCategory={selectedCategory}
          sortBy={sortBy}
          certificates={mobilePaginatedCertificates}
          filteredCount={filteredCertificates.length}
          currentPage={currentPage}
          totalPages={mobileTotalFilteredPages}
          isLoading={isLoading}
          errorMessage={errorMessage}
          groupCounts={groupCounts}
          categoryCounts={categoryCounts}
          apiGroupCountMap={apiGroupCountMap}
          onGroupChange={(group) => {
            setSelectedGroup(group);
            setSelectedCategory(ALL_FILTER);
          }}
          onCategoryChange={setSelectedCategory}
          onSortChange={setSortBy}
          onPageChange={(page) => {
            setCurrentPage(page);
            topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        />
      </div>

      <div className="hidden lg:block">
        <CertificateWikiSubNav />
      <main className="mx-auto w-full max-w-265.5 pb-24 pt-10">
        <section ref={topRef}>
          {!isLoading && !errorMessage && (
            <>
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="mb-2 text-[12px] font-medium text-[#8A94A6]">상위 분야</p>
                  <div className="flex flex-wrap items-center gap-2">
                    {groupOptions.map((group) => {
                      const active = selectedGroup === group;
                      return (
                        <button
                          key={group}
                          type="button"
                          onClick={() => {
                            setSelectedGroup(group);
                            setSelectedCategory(ALL_FILTER);
                          }}
                          className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3.5 text-[13px] transition-colors ${
                            active
                              ? "border-[#4876EF] bg-white font-medium text-[#4876EF]"
                              : "border-[#DDE2EA] bg-white font-normal text-[#334155] hover:border-[#BFD0FF] hover:text-[#4876EF]"
                          }`}
                        >
                          <span>{group}</span>
                          <span className={`text-[11px] ${active ? "text-[#4876EF]" : "text-[#9AA3B2]"}`}>
                            {group === ALL_FILTER
                              ? (groupCounts[ALL_FILTER] ?? 0)
                              : (apiGroupCountMap[group] ?? groupCounts[group] ?? 0)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <SortDropdown value={sortBy} onChange={setSortBy} />
              </div>

              {hasSubCategories && (
                <div className="mt-5">
                  <p className="mb-2 text-[12px] font-medium text-[#8A94A6]">세부 분야</p>
                  <div className="flex flex-wrap gap-2">
                    {subCategoryOptions.map((category) => {
                      const active = selectedCategory === category;
                      return (
                        <button
                          key={category}
                          type="button"
                          onClick={() => setSelectedCategory(category)}
                          className={`h-9 rounded-full border px-4 text-[13px] transition-colors ${
                            active
                              ? "border-[#4876EF] bg-white font-medium text-[#4876EF]"
                              : "border-[#DDE2EA] bg-white font-normal text-[#334155] hover:border-[#BFD0FF] hover:text-[#4876EF]"
                          }`}
                        >
                          {category}
                          <span className={`ml-1.5 text-[11px] ${active ? "text-[#4876EF]" : "text-[#9AA3B2]"}`}>
                            {category === ALL_FILTER
                              ? (apiGroupCountMap[selectedGroup] ?? categoryCounts[ALL_FILTER] ?? 0)
                              : (categoryCounts[category] ?? 0)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {isLoading && (
            <div className="mt-7 grid grid-cols-4 gap-x-5 gap-y-8">
              {Array.from({ length: 8 }).map((_, i) => <CertificateCardSkeleton key={i} />)}
            </div>
          )}

          {!isLoading && errorMessage && (
            <div className="mt-16 rounded-lg border border-dashed border-[#DDE2EA] py-14 text-center">
              <p className="text-[15px] font-medium text-[#667085]">{errorMessage}</p>
              <p className="mt-2 text-[13px] text-[#9AA3B2]">잠시 후 다시 시도해주세요.</p>
            </div>
          )}

          {!isLoading && !errorMessage && filteredCertificates.length > 0 && (
            <>
              <div className="mt-7 grid grid-cols-4 gap-x-5 gap-y-8">
                {paginatedCertificates.map((certificate) => {
                  const examType = getExamTypeLabel(certificate);
                  const hasSchedule = (certificate.schedules?.length ?? 0) > 0;
                  return (
                    <Link
                      key={certificate.examCode}
                      href={`/certificate/${encodeURIComponent(certificate.examCode)}`}
                      className="group block min-h-37.5"
                    >
                      <div className="flex min-h-37.5 flex-col rounded-lg border border-[#E8ECF5] bg-white p-5 transition-colors hover:border-[#C9D7F5]">
                        <div className="flex items-start justify-between gap-2">
                          <span className={`inline-flex rounded-sm px-2 py-0.5 text-[11px] font-normal ${getExamTypeStyle(examType)}`}>
                            {examType}
                          </span>
                          {!certificate.isActive && (
                            <span className="shrink-0 rounded-md bg-[#F7F9FC] px-2 py-1 text-[11px] font-normal text-[#9AA3B2]">
                              비활성
                            </span>
                          )}
                        </div>
                        <p className="mt-4 line-clamp-1 text-[13px] text-[#475569]">
                          {certificate.organization || "기관 정보 없음"}
                        </p>
                        <h2 className="mt-2 line-clamp-2 text-[17px] font-medium leading-[1.42] tracking-[-0.025em] text-[#263241]">
                          {certificate.examName}
                        </h2>
                        <div className="mt-auto flex items-center justify-between pt-6">
                          <span className="inline-flex items-center gap-1.5 text-[12px] text-[#8A94A6]">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {hasSchedule ? "일정 있음" : "일정 확인"}
                          </span>
                          <ChevronRight className="h-4 w-4 text-[#C0C8D5] transition-colors group-hover:text-[#4876EF]" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {totalFilteredPages > 1 && (
                <div className="flex items-center justify-center gap-1 pt-12">
                  {[
                    { label: "<<", disabled: currentPage === 0, to: Math.max(0, currentPage - 10) },
                    { label: "<",  disabled: currentPage === 0, to: currentPage - 1 },
                  ].map(({ label, disabled, to }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => { setCurrentPage(to); topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                      disabled={disabled}
                      className="flex h-9 min-w-9 items-center justify-center rounded-lg px-1 text-[13px] font-medium text-[#9AA3B2] transition-colors hover:bg-[#F3F6FA] hover:text-[#4876EF] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      {label}
                    </button>
                  ))}

                  {getPageNumbers(currentPage, totalFilteredPages).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => { setCurrentPage(page - 1); topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-[14px] transition-colors ${
                        page === currentPage + 1
                          ? "bg-[#4876EF] font-semibold text-white"
                          : "font-normal text-[#334155] hover:bg-[#F3F6FA] hover:text-[#4876EF]"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {[
                    { label: ">",  disabled: currentPage === totalFilteredPages - 1, to: currentPage + 1 },
                    { label: ">>", disabled: currentPage === totalFilteredPages - 1, to: Math.min(totalFilteredPages - 1, currentPage + 10) },
                  ].map(({ label, disabled, to }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => { setCurrentPage(to); topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                      disabled={disabled}
                      className="flex h-9 min-w-9 items-center justify-center rounded-lg px-1 text-[13px] font-medium text-[#9AA3B2] transition-colors hover:bg-[#F3F6FA] hover:text-[#4876EF] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {!isLoading && !errorMessage && filteredCertificates.length === 0 && (
            <div className="mt-16 rounded-lg border border-dashed border-[#DDE2EA] py-14 text-center">
              <p className="text-[15px] font-medium text-[#667085]">조건에 맞는 자격증이 없어요.</p>
              <p className="mt-2 text-[13px] text-[#9AA3B2]">다른 분야나 유형을 선택해보세요.</p>
            </div>
          )}
        </section>
      </main>
      </div>
    </div>
  );
}
