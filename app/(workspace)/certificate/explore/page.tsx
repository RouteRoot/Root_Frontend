"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import CertificateWikiSubNav from "@/components/certificate/CertificateWikiSubNav";

type SubCategory = { label: string; value: string };

type CertItem = {
  examCode: string;
  examName: string;
  organization: string;
  examType: "국가기술자격" | "국가전문자격" | "국가자격" | "국가공인민간자격" | "민간자격";
  subCategory: string;
  dday?: string;
};

type MainCategory = {
  label: string;
  value: string;
  icon: string;
  subCategories: SubCategory[];
  certs: CertItem[];
};

const CATEGORIES: MainCategory[] = [
  {
    label: "IT/정보통신",
    value: "it",
    icon: "💻",
    subCategories: [
      { label: "전체", value: "all" },
      { label: "프로그래밍", value: "programming" },
      { label: "데이터베이스", value: "database" },
      { label: "정보보안", value: "security" },
      { label: "네트워크", value: "network" },
    ],
    certs: [
      { examCode: "1320", examName: "정보처리기사", organization: "한국산업인력공단", examType: "국가기술자격", subCategory: "programming", dday: "D-45" },
      { examCode: "1321", examName: "정보처리산업기사", organization: "한국산업인력공단", examType: "국가기술자격", subCategory: "programming" },
      { examCode: "CQ1", examName: "컴퓨터활용능력 1급", organization: "대한상공회의소", examType: "국가기술자격", subCategory: "programming" },
      { examCode: "CQ2", examName: "컴퓨터활용능력 2급", organization: "대한상공회의소", examType: "국가기술자격", subCategory: "programming" },
      { examCode: "SQLD", examName: "SQLD", organization: "한국데이터산업진흥원", examType: "국가공인민간자격", subCategory: "database", dday: "D-30" },
      { examCode: "SQLP", examName: "SQLP", organization: "한국데이터산업진흥원", examType: "국가공인민간자격", subCategory: "database" },
      { examCode: "BDA", examName: "빅데이터분석기사", organization: "한국데이터산업진흥원", examType: "국가기술자격", subCategory: "database", dday: "D-60" },
      { examCode: "ISE1", examName: "정보보안기사", organization: "한국인터넷진흥원", examType: "국가기술자격", subCategory: "security" },
      { examCode: "ISE2", examName: "정보보안산업기사", organization: "한국인터넷진흥원", examType: "국가기술자격", subCategory: "security" },
      { examCode: "NM2", examName: "네트워크관리사 2급", organization: "한국정보통신자격협회", examType: "민간자격", subCategory: "network" },
    ],
  },
  {
    label: "전기/전자",
    value: "electric",
    icon: "⚡",
    subCategories: [
      { label: "전체", value: "all" },
      { label: "전기", value: "electricity" },
      { label: "전자", value: "electronics" },
    ],
    certs: [
      { examCode: "EE1", examName: "전기기사", organization: "한국산업인력공단", examType: "국가기술자격", subCategory: "electricity" },
      { examCode: "EE2", examName: "전기산업기사", organization: "한국산업인력공단", examType: "국가기술자격", subCategory: "electricity" },
      { examCode: "EE3", examName: "전기기능사", organization: "한국산업인력공단", examType: "국가기술자격", subCategory: "electricity" },
      { examCode: "EL1", examName: "전자기기기능사", organization: "한국산업인력공단", examType: "국가기술자격", subCategory: "electronics" },
      { examCode: "EL2", examName: "전자계산기기능사", organization: "한국산업인력공단", examType: "국가기술자격", subCategory: "electronics" },
    ],
  },
  {
    label: "건설/안전",
    value: "construction",
    icon: "🏗️",
    subCategories: [
      { label: "전체", value: "all" },
      { label: "건설", value: "construction_sub" },
      { label: "안전", value: "safety" },
    ],
    certs: [
      { examCode: "SA1", examName: "산업안전기사", organization: "한국산업인력공단", examType: "국가기술자격", subCategory: "safety" },
      { examCode: "SA2", examName: "산업안전산업기사", organization: "한국산업인력공단", examType: "국가기술자격", subCategory: "safety" },
      { examCode: "CA1", examName: "건설안전기사", organization: "한국산업인력공단", examType: "국가기술자격", subCategory: "safety" },
      { examCode: "CB1", examName: "건축기사", organization: "한국산업인력공단", examType: "국가기술자격", subCategory: "construction_sub" },
      { examCode: "CB2", examName: "건설재료시험기사", organization: "한국산업인력공단", examType: "국가기술자격", subCategory: "construction_sub" },
    ],
  },
  {
    label: "경영/회계",
    value: "business",
    icon: "📊",
    subCategories: [
      { label: "전체", value: "all" },
      { label: "회계", value: "accounting" },
      { label: "금융", value: "finance" },
      { label: "경영", value: "management" },
    ],
    certs: [
      { examCode: "TAX1", examName: "전산세무 1급", organization: "한국세무사회", examType: "국가공인민간자격", subCategory: "accounting" },
      { examCode: "TAX2", examName: "전산세무 2급", organization: "한국세무사회", examType: "국가공인민간자격", subCategory: "accounting" },
      { examCode: "ACC1", examName: "전산회계 1급", organization: "한국세무사회", examType: "국가공인민간자격", subCategory: "accounting" },
      { examCode: "FRM1", examName: "재경관리사", organization: "삼일아이닷컴", examType: "국가공인민간자격", subCategory: "accounting" },
      { examCode: "FIN1", examName: "증권투자권유대행인", organization: "금융투자협회", examType: "국가공인민간자격", subCategory: "finance" },
      { examCode: "FIN2", examName: "펀드투자권유대행인", organization: "금융투자협회", examType: "국가공인민간자격", subCategory: "finance" },
    ],
  },
  {
    label: "어학",
    value: "language",
    icon: "🗣️",
    subCategories: [
      { label: "전체", value: "all" },
      { label: "영어", value: "english" },
      { label: "일본어", value: "japanese" },
      { label: "중국어", value: "chinese" },
    ],
    certs: [
      { examCode: "TOEIC", examName: "TOEIC", organization: "YBM", examType: "국가공인민간자격", subCategory: "english" },
      { examCode: "TOEFL", examName: "TOEFL", organization: "ETS", examType: "민간자격", subCategory: "english" },
      { examCode: "OPIC", examName: "OPIc", organization: "ACTFL", examType: "국가공인민간자격", subCategory: "english" },
      { examCode: "JLPT1", examName: "JLPT N1", organization: "일본국제교류기금", examType: "민간자격", subCategory: "japanese" },
      { examCode: "JLPT2", examName: "JLPT N2", organization: "일본국제교류기금", examType: "민간자격", subCategory: "japanese" },
      { examCode: "HSK5", examName: "HSK 5급", organization: "한국HSK사무국", examType: "민간자격", subCategory: "chinese" },
      { examCode: "HSK6", examName: "HSK 6급", organization: "한국HSK사무국", examType: "민간자격", subCategory: "chinese" },
    ],
  },
  {
    label: "인문/사회",
    value: "humanities",
    icon: "📚",
    subCategories: [
      { label: "전체", value: "all" },
      { label: "역사", value: "history" },
      { label: "법률", value: "law" },
    ],
    certs: [
      { examCode: "KH1", examName: "한국사능력검정시험 1급", organization: "국사편찬위원회", examType: "국가자격", subCategory: "history", dday: "D-20" },
      { examCode: "KH2", examName: "한국사능력검정시험 2급", organization: "국사편찬위원회", examType: "국가자격", subCategory: "history" },
      { examCode: "KH3", examName: "한국사능력검정시험 3급", organization: "국사편찬위원회", examType: "국가자격", subCategory: "history" },
      { examCode: "ADM", examName: "행정사", organization: "행정안전부", examType: "국가전문자격", subCategory: "law" },
    ],
  },
];

const EXAM_TYPE_STYLE: Record<CertItem["examType"], string> = {
  국가기술자격: "bg-[#EEF4FF] text-[#4876EF]",
  국가전문자격: "bg-[#ECFDF3] text-[#039855]",
  국가자격: "bg-[#ECFDF3] text-[#039855]",
  국가공인민간자격: "bg-[#FFF7ED] text-[#EA580C]",
  민간자격: "bg-[#F5F7FA] text-[#6B7280]",
};

export default function CertificateExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState("it");
  const [selectedSub, setSelectedSub] = useState("all");
  const [query, setQuery] = useState("");

  const currentCategory = CATEGORIES.find((c) => c.value === selectedCategory)!;

  const filteredCerts = currentCategory.certs.filter((cert) => {
    const subMatch = selectedSub === "all" || cert.subCategory === selectedSub;
    const queryMatch =
      query.trim() === "" || cert.examName.includes(query.trim());
    return subMatch && queryMatch;
  });

  return (
    <div>
      <CertificateWikiSubNav />
      <main className="mx-auto w-full max-w-265.5 pb-24 pt-8">
        <div className="flex items-end justify-between">
          <h1 className="text-[28px] font-bold tracking-[-0.03em] text-[#1F2D4A]">
            자격증 탐색
          </h1>
          <p className="text-[14px] text-[#8A94A6]">
            분야별로 자격증을 찾아보세요
          </p>
        </div>

        {/* 검색 */}
        <label className="mt-6 flex h-12 items-center gap-3 rounded-xl border border-[#E1E6EE] bg-white px-4">
          <Search className="h-4 w-4 shrink-0 text-[#B3BBC8]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="자격증 이름으로 검색"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-[#333333] outline-none placeholder:text-[#B3BBC8]"
          />
        </label>

        {/* 대분류 */}
        <div className="mt-8 flex flex-wrap gap-3">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.value);
                  setSelectedSub("all");
                }}
                className={`flex items-center gap-2 rounded-[14px] border px-5 py-3 text-[14px] font-medium transition-all ${
                  active
                    ? "border-[#4876EF] bg-[#4876EF] text-white shadow-sm"
                    : "border-[#E1E6EE] bg-white text-[#475569] hover:border-[#C9D7F5]"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
                <span
                  className={`text-[12px] ${active ? "text-white/70" : "text-[#B3BBC8]"}`}
                >
                  {cat.certs.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* 소분류 */}
        <div className="mt-4 flex flex-wrap gap-2">
          {currentCategory.subCategories.map((sub) => {
            const active = selectedSub === sub.value;
            return (
              <button
                key={sub.value}
                type="button"
                onClick={() => setSelectedSub(sub.value)}
                className={`h-8 rounded-full border px-4 text-[13px] transition-colors ${
                  active
                    ? "border-[#4876EF] font-semibold text-[#4876EF]"
                    : "border-[#E5E8EE] text-[#6B7280] hover:border-[#C9D7F5]"
                }`}
              >
                {sub.label}
              </button>
            );
          })}
        </div>

        {/* 자격증 그리드 */}
        {filteredCerts.length > 0 ? (
          <div className="mt-8 grid grid-cols-3 gap-4">
            {filteredCerts.map((cert) => (
              <Link
                key={cert.examCode}
                href={`/certificate/${cert.examCode}`}
                className="group block rounded-2xl border border-[#E8ECF5] bg-white p-5 transition-all hover:border-[#C9D7F5] hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <span
                      className={`inline-flex rounded-sm px-2 py-0.5 text-[11px] font-medium ${EXAM_TYPE_STYLE[cert.examType]}`}
                    >
                      {cert.examType}
                    </span>
                    <h3 className="mt-2 line-clamp-1 text-[15px] font-semibold text-[#1F2D4A] transition-colors group-hover:text-[#4876EF]">
                      {cert.examName}
                    </h3>
                    <p className="mt-1 text-[12px] text-[#8A94A6]">
                      {cert.organization}
                    </p>
                  </div>
                  {cert.dday && (
                    <span className="shrink-0 rounded-md bg-[#FEF2F2] px-2 py-1 text-[11px] font-semibold text-[#EF4444]">
                      {cert.dday}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[12px] text-[#B3BBC8]">상세 보기</span>
                  <ChevronRight className="h-4 w-4 text-[#C0C8D5] transition-colors group-hover:text-[#4876EF]" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-20 text-center text-[15px] text-[#9AA3B2]">
            검색 결과가 없어요.
          </div>
        )}
      </main>
    </div>
  );
}
