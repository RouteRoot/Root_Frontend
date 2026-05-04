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
};

const FEATURED_ARTICLES: Article[] = [
  {
    id: 1,
    title: "첫 자격증이라 막막할 때 이것만 따라하세요",
    description:
      "목표 선택부터 시험 일정 관리, 기출 회독까지 처음 시작하는 사람을 위한 준비 순서를 정리했습니다.",
    category: "추천 콘텐츠",
    author: "bburi 에디터",
    date: "2026.01.15",
    gradient: "from-[#38BDF8] via-[#7DD3FC] to-[#BAE6FD]",
  },
  {
    id: 2,
    title: "정보처리기사 필기 합격 후기, 비전공자 3주 완성",
    description:
      "전공 지식 없이 시작해서 3주 만에 합격한 실제 후기입니다. 사용한 교재와 공부 방법을 공개합니다.",
    category: "합격 후기",
    author: "bburi 에디터",
    date: "2026.01.10",
    gradient: "from-[#4876EF] via-[#60A5FA] to-[#BFDBFE]",
  },
  {
    id: 3,
    title: "취업 준비생이 꼭 알아야 할 자격증 우선순위",
    description:
      "실제로 서류에서 가산점이 되는 자격증과 그렇지 않은 자격증을 구분하는 법을 정리했습니다.",
    category: "취업전략",
    author: "bburi 에디터",
    date: "2026.01.05",
    gradient: "from-[#0F766E] via-[#14B8A6] to-[#CCFBF1]",
  },
];

const ARTICLES: Article[] = [
  {
    id: 4,
    title: "SQLD 시험 완벽 가이드, 개념부터 실전까지",
    description:
      "SQL 비전공자를 위한 단계별 준비 가이드. 시험 구성부터 합격 전략까지 모두 담았습니다.",
    category: "자격증",
    author: "bburi 에디터",
    date: "2025.12.28",
    gradient: "from-[#0F172A] to-[#334155]",
  },
  {
    id: 5,
    title: "IT 개발자 취업에 도움이 되는 자격증 TOP 5",
    description:
      "현직 개발자들이 추천하는 IT 자격증. 취득 난이도와 실무 활용도를 함께 분석했습니다.",
    category: "IT/개발",
    author: "bburi 에디터",
    date: "2025.12.20",
    gradient: "from-[#1E40AF] to-[#60A5FA]",
  },
  {
    id: 6,
    title: "전기기사 합격률 분석, 이 방법이 정답이었다",
    description:
      "합격률 20% 전기기사, 실제 합격자들의 공통 학습 패턴을 분석했습니다.",
    category: "자격증",
    author: "bburi 에디터",
    date: "2025.12.15",
    gradient: "from-[#92400E] to-[#F59E0B]",
  },
  {
    id: 7,
    title: "스터디 모집 가이드, 함께 공부하면 합격률이 높아집니다",
    description:
      "자격증 스터디를 효율적으로 운영하는 방법과 구성원 모집 팁을 정리했습니다.",
    category: "스터디",
    author: "bburi 에디터",
    date: "2025.12.10",
    gradient: "from-[#831843] to-[#EC4899]",
  },
  {
    id: 8,
    title: "한국사능력검정시험 심화 1급 준비 전략",
    description:
      "최근 출제 경향과 고득점을 위한 학습 전략을 공유합니다.",
    category: "자격증",
    author: "bburi 에디터",
    date: "2025.12.05",
    gradient: "from-[#164E63] to-[#06B6D4]",
  },
  {
    id: 9,
    title: "자기계발을 위한 자격증 선택법",
    description:
      "커리어 목표에 맞는 자격증을 선택하는 방법과 우선순위 설정 가이드입니다.",
    category: "자기계발",
    author: "bburi 에디터",
    date: "2025.11.28",
    gradient: "from-[#4C1D95] to-[#8B5CF6]",
  },
];

const TAGS = [
  "전체",
  "입문자 추천",
  "자격증 분석",
  "직무 분석",
  "시험 정보",
  "공부법",
  "합격 전략",
  "취업 전략",
  "전문가 인사이트",
];

const POPULAR_CONTENTS = [
  "2026년 자격증 일정, 직장인들이 말한 현실은",
  "26년 정보처리기사 준비, 첫 페이지 자료부터",
  "초봉 4800만원? 데이터 직무 성장비결",
  "면접 합격/불합격 시그널, 이거 맞아요?",
  "2026년 실수령액표 완벽 정리",
  "SQLD 생초보 합격 루틴과 회독법",
  "지금 퇴사하면 자격증 준비 가능할까?",
  "컴활 1급 찍으면 감점? 초단기 팁",
  "평균 연봉 1억 직무, 필요한 자격증은",
  "대우건설 신입·인턴 채용 서류 합격 전략",
];

function FeaturedArchive({ articles }: { articles: Article[] }) {
  const [current, setCurrent] = useState(0);
  const article = articles[current];

  return (
    <section className="relative max-w-[760px]">
      <Link
        href={`/certificate/archive/${article.id}`}
        className="group grid w-fit grid-cols-[456px_220px] items-start gap-[30px]"
      >
        <div
          className={`relative h-[253px] w-[456px] overflow-hidden rounded-[8px] bg-gradient-to-br ${article.gradient}`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_32%,rgba(255,255,255,0.45),transparent_22%),linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:auto,18px_18px,18px_18px]" />
          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/65" />
          <div className="absolute left-[48%] top-[42%] h-10 w-10 rounded-full bg-[#4876EF]/80" />
          <div className="absolute bottom-8 left-8 h-10 w-36 rounded-full bg-white/45" />
        </div>

        <div className="min-w-0 pt-1">
          <p className="text-[14px] font-semibold text-[#4876EF]">
            {article.category}
          </p>
          <h2 className="mt-1.5 line-clamp-2 max-h-[96px] break-words break-all text-[22px] font-bold leading-[1.42] text-[#333333]">
            {article.title}
          </h2>
        </div>
      </Link>

      <div className="absolute bottom-1 right-0 flex items-center gap-5 text-[#C0C8D5]">
        <button
          type="button"
          onClick={() => setCurrent((value) => (value - 1 + articles.length) % articles.length)}
          aria-label="이전 추천 콘텐츠"
          className="transition-colors hover:text-[#4876EF]"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => setCurrent((value) => (value + 1) % articles.length)}
          aria-label="다음 추천 콘텐츠"
          className="transition-colors hover:text-[#4876EF]"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

function TagFilters({
  activeTag,
  onChange,
}: {
  activeTag: string;
  onChange: (tag: string) => void;
}) {
  return (
    <div className="mt-16">
      <div className="flex flex-wrap gap-2.5">
        {TAGS.map((tag) => {
          const active = activeTag === tag;

          return (
            <button
              key={tag}
              type="button"
              onClick={() => onChange(tag)}
              className={`h-10 rounded-full border px-5 text-[14px] transition-colors ${
                active
                  ? "border-[#DDE7FF] bg-[#EEF4FF] font-medium text-[#4876EF]"
                  : "border-[#E5E8EB] bg-white font-normal text-[#667085] hover:border-[#C9D7F5] hover:text-[#4876EF]"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="ml-auto mt-5 flex items-center gap-1 text-[13px] text-[#9AA3B2] transition-colors hover:text-[#4876EF]"
      >
        태그 전체보기
        <ChevronRight className="h-4 w-4 rotate-90" />
      </button>
    </div>
  );
}

function ArchiveListItem({ article }: { article: Article }) {
  return (
    <Link
      href={`/certificate/archive/${article.id}`}
      className="group flex gap-5 py-5"
    >
      <div
        className={`relative h-[96px] w-[172px] shrink-0 overflow-hidden rounded-[8px] bg-gradient-to-br ${article.gradient}`}
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:16px_16px]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <h2 className="line-clamp-1 text-[20px] font-semibold leading-[1.35] tracking-[-0.02em] text-[#333333]">
          {article.title}
        </h2>
        <p className="mt-2.5 line-clamp-2 text-[13px] leading-[1.65] text-[#667085]">
          {article.description}
        </p>
        <p className="mt-3 text-[12px] text-[#6B7280]">{article.author}</p>
      </div>
    </Link>
  );
}

function PopularContentPanel() {
  return (
    <aside className="sticky top-6">
      <h3 className="text-[19px] font-semibold tracking-[-0.03em] text-[#1F2937]">
        실시간 인기 콘텐츠
      </h3>
      <div className="mt-7 overflow-hidden rounded-[14px] border border-[#E5E8EB] bg-white">
        <div className="grid grid-cols-2 border-b border-[#E5E8EB] text-center">
          <button
            type="button"
            className="h-14 border-b-2 border-[#1F2937] text-[15px] font-semibold text-[#1F2937]"
          >
            아티클
          </button>
          <button
            type="button"
            className="h-14 text-[15px] font-medium text-[#9AA3B2]"
          >
            영상
          </button>
        </div>
        <ol className="px-4 py-3">
          {POPULAR_CONTENTS.map((title, index) => (
            <li key={title} className="flex items-center gap-3 py-2.5">
              <span className="w-5 shrink-0 text-center text-[14px] font-normal text-[#4876EF] tabular-nums">
                {index + 1}
              </span>
              <Link
                href="/certificate/archive"
                className="min-w-0 flex-1 truncate text-[13px] font-normal text-[#334155] transition-colors hover:text-[#4876EF]"
              >
                {title}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}

export default function CertificateArchivePage() {
  const [activeTag, setActiveTag] = useState("전체");

  return (
    <div>
      <CertificateWikiSubNav />
      <main className="mx-auto w-full max-w-265.5 pb-24 pt-16">
        <div className="grid grid-cols-[minmax(0,850px)_300px] items-start gap-10">
          <div>
            <FeaturedArchive articles={FEATURED_ARTICLES} />
            <TagFilters activeTag={activeTag} onChange={setActiveTag} />

            <div className="mt-14 divide-y divide-[#F1F3F6]">
              {ARTICLES.map((article) => (
                <ArchiveListItem key={article.id} article={article} />
              ))}
            </div>
          </div>

          <PopularContentPanel />
        </div>
      </main>
    </div>
  );
}
