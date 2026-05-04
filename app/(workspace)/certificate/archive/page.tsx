"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CertificateWikiSubNav from "@/components/certificate/CertificateWikiSubNav";

type Article = {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  date: string;
  gradient: string;
  featured?: boolean;
};

type PopularCert = {
  rank: number;
  name: string;
  category: string;
  trend: "up" | "down" | "same";
  change?: number;
};

const FEATURED_ARTICLES: Article[] = [
  {
    id: 1,
    title: "2026년 상반기 자격증 시험 일정 총정리",
    description:
      "올해 상반기 국가기술자격부터 민간자격까지, 주요 시험 일정을 한눈에 정리했습니다. 시험 준비 계획을 세우기 전에 꼭 확인하세요.",
    category: "시험정보",
    author: "bburi 에디터",
    date: "2026.01.15",
    gradient: "from-[#1E3A8A] via-[#1D4ED8] to-[#3B82F6]",
    featured: true,
  },
  {
    id: 2,
    title: "정보처리기사 필기 합격 후기 — 비전공자 3주 완성",
    description:
      "전공 지식 없이 시작해서 3주 만에 합격한 실제 후기입니다. 사용한 교재와 공부 방법을 공개합니다.",
    category: "자격증",
    author: "bburi 에디터",
    date: "2026.01.10",
    gradient: "from-[#5B21B6] to-[#8B5CF6]",
    featured: true,
  },
  {
    id: 3,
    title: "취업 준비생이 꼭 알아야 할 자격증 우선순위",
    description:
      "채용 담당자 100명에게 물었습니다. 실제로 서류에서 가산점이 되는 자격증과 그렇지 않은 것을 구분했습니다.",
    category: "취업전략",
    author: "bburi 에디터",
    date: "2026.01.05",
    gradient: "from-[#064E3B] to-[#059669]",
    featured: true,
  },
];

const ARTICLES: Article[] = [
  {
    id: 4,
    title: "SQLD 시험 완벽 가이드 — 개념부터 실전까지",
    description: "SQL 비전공자를 위한 단계별 준비 가이드. 시험 구성부터 합격 전략까지 모두 담았습니다.",
    category: "자격증",
    author: "bburi 에디터",
    date: "2025.12.28",
    gradient: "from-[#0F172A] to-[#334155]",
  },
  {
    id: 5,
    title: "IT 개발자 취업에 도움이 되는 자격증 TOP 5",
    description: "현직 개발자들이 추천하는 IT 자격증. 취득 난이도와 실무 활용도를 함께 분석했습니다.",
    category: "IT/개발",
    author: "bburi 에디터",
    date: "2025.12.20",
    gradient: "from-[#1E40AF] to-[#60A5FA]",
  },
  {
    id: 6,
    title: "전기기사 합격률 분석 — 이 방법이 정답이었다",
    description: "합격률 20% 전기기사, 실제 합격자들의 공통 학습 패턴을 분석했습니다.",
    category: "자격증",
    author: "bburi 에디터",
    date: "2025.12.15",
    gradient: "from-[#92400E] to-[#F59E0B]",
  },
  {
    id: 7,
    title: "스터디 모집 가이드 — 함께 공부하면 합격률이 높아집니다",
    description: "자격증 스터디를 효율적으로 운영하는 방법과 구성원 모집 팁을 정리했습니다.",
    category: "스터디",
    author: "bburi 에디터",
    date: "2025.12.10",
    gradient: "from-[#831843] to-[#EC4899]",
  },
  {
    id: 8,
    title: "한국사능력검정시험 심화 1급 준비 전략",
    description: "최근 출제 경향과 고득점을 위한 학습 전략을 공유합니다.",
    category: "자격증",
    author: "bburi 에디터",
    date: "2025.12.05",
    gradient: "from-[#164E63] to-[#06B6D4]",
  },
  {
    id: 9,
    title: "자기계발을 위한 자격증 선택법",
    description: "커리어 목표에 맞는 자격증을 선택하는 방법과 우선순위 설정 가이드입니다.",
    category: "자기계발",
    author: "bburi 에디터",
    date: "2025.11.28",
    gradient: "from-[#4C1D95] to-[#8B5CF6]",
  },
  {
    id: 10,
    title: "빅데이터분석기사 시험 후기 및 공부법",
    description: "국가기술자격으로 격상된 빅데이터분석기사, 실제 시험장에서 느낀 점과 합격 팁을 공유합니다.",
    category: "IT/개발",
    author: "bburi 에디터",
    date: "2025.11.20",
    gradient: "from-[#14532D] to-[#22C55E]",
  },
  {
    id: 11,
    title: "커리어 전환을 위한 자격증 로드맵",
    description: "비전공자가 IT 직군으로 전환할 때 필요한 자격증과 학습 순서를 단계별로 안내합니다.",
    category: "커리어",
    author: "bburi 에디터",
    date: "2025.11.15",
    gradient: "from-[#7F1D1D] to-[#EF4444]",
  },
];

const CATEGORIES = [
  "전체",
  "IT/개발",
  "취업전략",
  "자격증",
  "스터디",
  "커리어",
  "자기계발",
  "시험정보",
];

const POPULAR_CERTS: PopularCert[] = [
  { rank: 1, name: "정보처리기사", category: "IT/정보통신", trend: "same" },
  { rank: 2, name: "컴퓨터활용능력 1급", category: "IT/정보통신", trend: "up", change: 1 },
  { rank: 3, name: "SQLD", category: "IT/정보통신", trend: "up", change: 2 },
  { rank: 4, name: "전기기사", category: "전기/전자", trend: "down", change: 1 },
  { rank: 5, name: "한국사능력검정시험", category: "인문/사회", trend: "same" },
  { rank: 6, name: "산업안전기사", category: "건설/안전", trend: "up", change: 1 },
  { rank: 7, name: "네트워크관리사", category: "IT/정보통신", trend: "down", change: 1 },
  { rank: 8, name: "정보보안기사", category: "IT/정보통신", trend: "up", change: 1 },
  { rank: 9, name: "빅데이터분석기사", category: "IT/정보통신", trend: "up", change: 3 },
  { rank: 10, name: "전기산업기사", category: "전기/전자", trend: "down", change: 2 },
];

function FeaturedCarousel({ articles }: { articles: Article[] }) {
  const [current, setCurrent] = useState(0);
  const article = articles[current];

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E8ECF5]">
      <div className="grid grid-cols-[5fr_4fr]">
        {/* Image area */}
        <div className={`relative min-h-[280px] bg-gradient-to-br ${article.gradient}`}>
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            <span className="inline-flex w-fit rounded-full bg-white/20 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur-sm">
              📌 {article.category}
            </span>
            <p className="text-[13px] text-white/60">{article.date}</p>
          </div>
          {/* Prev/Next */}
          <button
            type="button"
            onClick={() => setCurrent((c) => (c - 1 + articles.length) % articles.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setCurrent((c) => (c + 1) % articles.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
            {articles.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === current ? "w-5 bg-white" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Text area */}
        <div className="flex flex-col justify-center p-8">
          <span className="text-[12px] font-medium text-[#4876EF]">
            {article.category}
          </span>
          <h2 className="mt-2 text-[22px] font-bold leading-[1.35] tracking-[-0.03em] text-[#1F2D4A]">
            {article.title}
          </h2>
          <p className="mt-3 text-[14px] leading-[1.7] text-[#6B7280]">
            {article.description}
          </p>
          <div className="mt-6 flex items-center justify-between">
            <span className="text-[12px] text-[#9AA3B2]">{article.author}</span>
            <Link
              href={`/certificate/archive/${article.id}`}
              className="flex items-center gap-1 text-[13px] font-medium text-[#4876EF] hover:underline"
            >
              읽기
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          {/* Counter */}
          <p className="mt-4 text-[12px] text-[#C0C8D5]">
            {current + 1} / {articles.length}
          </p>
        </div>
      </div>
    </div>
  );
}

function ArticleListItem({ article }: { article: Article }) {
  return (
    <Link
      href={`/certificate/archive/${article.id}`}
      className="group flex items-start gap-4 border-b border-[#F3F5F9] py-5 last:border-none"
    >
      <div
        className={`h-[88px] w-[88px] shrink-0 rounded-xl bg-gradient-to-br ${article.gradient}`}
      />
      <div className="min-w-0 flex-1">
        <span className="inline-flex rounded-sm bg-[#EEF4FF] px-2 py-0.5 text-[11px] font-medium text-[#4876EF]">
          {article.category}
        </span>
        <h3 className="mt-1.5 line-clamp-1 text-[15px] font-semibold leading-snug tracking-tight text-[#1F2D4A] transition-colors group-hover:text-[#4876EF]">
          {article.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-[13px] leading-[1.6] text-[#6B7280]">
          {article.description}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[12px] text-[#9AA3B2]">{article.author}</span>
          <span className="text-[12px] text-[#D1D5DB]">·</span>
          <span className="text-[12px] text-[#9AA3B2]">{article.date}</span>
        </div>
      </div>
    </Link>
  );
}

export default function CertificateArchivePage() {
  const [activeCategory, setActiveCategory] = useState("전체");

  const filteredArticles =
    activeCategory === "전체"
      ? ARTICLES
      : ARTICLES.filter((a) => a.category === activeCategory);

  return (
    <div>
      <CertificateWikiSubNav />
      <main className="mx-auto w-full max-w-265.5 pb-24 pt-8">
        <div className="flex items-end justify-between">
          <h1 className="text-[28px] font-bold tracking-[-0.03em] text-[#1F2D4A]">
            아카이브
          </h1>
          <p className="text-[14px] text-[#8A94A6]">
            자격증에 관한 모든 이야기
          </p>
        </div>

        {/* Featured carousel */}
        <div className="mt-6">
          <FeaturedCarousel articles={FEATURED_ARTICLES} />
        </div>

        {/* Content + Sidebar */}
        <div className="mt-10 grid grid-cols-[1fr_300px] items-start gap-10">
          <div>
            {/* Category chips */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`h-9 rounded-full border px-4 text-[13px] transition-colors ${
                      active
                        ? "border-[#4876EF] font-semibold text-[#4876EF]"
                        : "border-[#E5E8EE] text-[#6B7280] hover:border-[#C9D7F5]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Article list */}
            <div className="mt-4">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <ArticleListItem key={article.id} article={article} />
                ))
              ) : (
                <div className="py-20 text-center text-[15px] text-[#9AA3B2]">
                  해당 카테고리의 아티클이 없어요.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="sticky top-6">
            <div className="rounded-[20px] border border-[#E8ECF5] bg-white p-6">
              <h3 className="text-[16px] font-bold text-[#1F2D4A]">
                실시간 인기 자격증
              </h3>
              <ul className="mt-4">
                {POPULAR_CERTS.map((cert) => (
                  <li
                    key={cert.rank}
                    className="flex items-center gap-3 border-b border-[#F5F7FA] py-3 last:border-none"
                  >
                    <span
                      className={`w-5 shrink-0 text-[14px] font-bold tabular-nums ${
                        cert.rank <= 3 ? "text-[#4876EF]" : "text-[#C0C8D5]"
                      }`}
                    >
                      {cert.rank}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-[13px] font-medium text-[#333333]">
                        {cert.name}
                      </p>
                      <p className="text-[11px] text-[#9AA3B2]">
                        {cert.category}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-[11px] font-medium tabular-nums ${
                        cert.trend === "up"
                          ? "text-[#E84040]"
                          : cert.trend === "down"
                            ? "text-[#4876EF]"
                            : "text-[#C0C8D5]"
                      }`}
                    >
                      {cert.trend === "up"
                        ? `▲ ${cert.change}`
                        : cert.trend === "down"
                          ? `▼ ${cert.change}`
                          : "—"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
