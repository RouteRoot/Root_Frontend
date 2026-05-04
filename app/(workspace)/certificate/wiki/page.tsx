import Link from "next/link";
import { ChevronRight } from "lucide-react";
import CertificateWikiSubNav from "@/components/certificate/CertificateWikiSubNav";

type Article = {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  gradient: string;
};

type PopularCert = {
  rank: number;
  name: string;
  category: string;
  trend: "up" | "down" | "same";
  change?: number;
};

const HERO: Article = {
  id: 1,
  title: "정보처리기사 필기, 3주 안에 합격하는 방법",
  description:
    "비전공자도 3주면 충분합니다. 과목별 핵심 이론 정리와 CBT 기출 활용법을 공개합니다.",
  category: "오늘의 자격증",
  author: "bburi 에디터",
  gradient: "from-[#1E3A8A] via-[#1D4ED8] to-[#3B82F6]",
};

const SIDE_ARTICLES: Article[] = [
  {
    id: 2,
    title: "컴퓨터활용능력 1급 vs 2급, 취업에 더 유리한 건?",
    description:
      "직무별로 요구하는 수준이 다릅니다. 나에게 맞는 등급을 먼저 확인하세요.",
    category: "자격증 비교",
    author: "bburi 에디터",
    gradient: "from-[#5B21B6] to-[#8B5CF6]",
  },
  {
    id: 3,
    title: "SQLD 취득 완벽 로드맵 2026",
    description:
      "SQL 비전공자를 위한 단계별 준비 가이드. 시험 구성부터 합격 전략까지.",
    category: "합격 전략",
    author: "bburi 에디터",
    gradient: "from-[#064E3B] to-[#059669]",
  },
];

const PREP_FEATURED: Article = {
  id: 4,
  title: "전기기사 시험, 이렇게 준비하면 한 번에 붙습니다",
  description: "합격률 20% 전기기사, 3개월 공략법을 정리했습니다.",
  category: "합격 전략",
  author: "bburi 에디터",
  gradient: "from-[#92400E] to-[#F59E0B]",
};

const PREP_ARTICLES: Article[] = [
  { id: 5, title: "한국사능력검정시험 1급 준비 기간과 방법", description: "", category: "공부법", author: "bburi 에디터", gradient: "from-[#831843] to-[#EC4899]" },
  { id: 6, title: "산업안전기사 실기 핵심 요약", description: "", category: "핵심 요약", author: "bburi 에디터", gradient: "from-[#164E63] to-[#06B6D4]" },
  { id: 7, title: "네트워크관리사 2급 기출 유형 분석", description: "", category: "기출 분석", author: "bburi 에디터", gradient: "from-[#1E40AF] to-[#60A5FA]" },
  { id: 8, title: "정보보안기사 합격률과 준비 전략", description: "", category: "합격 전략", author: "bburi 에디터", gradient: "from-[#4C1D95] to-[#8B5CF6]" },
];

const GUIDE_FEATURED: Article = {
  id: 9,
  title: "IT 계열 자격증 완전 정복 가이드",
  description:
    "정보처리기사부터 빅데이터분석기사까지, IT 직무별 필수 자격증 로드맵을 정리했습니다.",
  category: "분야 가이드",
  author: "bburi 에디터",
  gradient: "from-[#0F172A] to-[#334155]",
};

const GUIDE_ARTICLES: Article[] = [
  { id: 10, title: "경영/회계 자격증, 취업에 실제로 도움이 될까?", description: "", category: "분야 가이드", author: "bburi 에디터", gradient: "from-[#1E3A8A] to-[#3B82F6]" },
  { id: 11, title: "건설 분야 필수 자격증 TOP 5", description: "", category: "분야 가이드", author: "bburi 에디터", gradient: "from-[#78350F] to-[#D97706]" },
  { id: 12, title: "전기/전자 자격증 난이도 순위 정리", description: "", category: "분야 가이드", author: "bburi 에디터", gradient: "from-[#14532D] to-[#22C55E]" },
  { id: 13, title: "어학 자격증 종류와 인정 범위 비교", description: "", category: "분야 가이드", author: "bburi 에디터", gradient: "from-[#4A044E] to-[#C026D3]" },
  { id: 14, title: "의료/보건 자격증 취득 경로 안내", description: "", category: "분야 가이드", author: "bburi 에디터", gradient: "from-[#7F1D1D] to-[#EF4444]" },
];

const COMPANY_FEATURED: Article = {
  id: 15,
  title: "취업 준비생이 자격증을 포트폴리오처럼 활용하는 법",
  description: "이력서와 면접에서 자격증 경험을 설득력 있게 풀어내는 방법을 정리했습니다.",
  category: "커리어",
  author: "bburi 에디터",
  gradient: "from-[#0F3B5F] to-[#1E88C8]",
};

const COMPANY_ARTICLES: Article[] = [
  { id: 16, title: "[공기업] 서류 가점에 도움 되는 자격증 조합", description: "", category: "커리어", author: "bburi 에디터", gradient: "from-[#0F766E] to-[#14B8A6]" },
  { id: 17, title: "[IT] 신입 개발자가 먼저 준비하면 좋은 자격증", description: "", category: "커리어", author: "bburi 에디터", gradient: "from-[#1D4ED8] to-[#60A5FA]" },
  { id: 18, title: "[사무직] 컴활과 전산회계, 어떤 순서로 딸까?", description: "", category: "커리어", author: "bburi 에디터", gradient: "from-[#7C2D12] to-[#F97316]" },
  { id: 19, title: "[안전관리] 산업안전기사 취득 후 가능한 직무", description: "", category: "커리어", author: "bburi 에디터", gradient: "from-[#365314] to-[#84CC16]" },
  { id: 20, title: "[데이터] SQLD 이후 이어가기 좋은 학습 루트", description: "", category: "커리어", author: "bburi 에디터", gradient: "from-[#581C87] to-[#A855F7]" },
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

function HeroCard({ article }: { article: Article }) {
  return (
    <Link href={`/certificate/wiki/${article.id}`} className="block h-full">
      <div
        className={`relative flex h-full min-h-[360px] flex-col justify-between overflow-hidden rounded-[20px] bg-gradient-to-br p-8 ${article.gradient}`}
      >
        <span className="inline-flex w-fit rounded-full bg-white/20 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur-sm">
          📌 {article.category}
        </span>
        <div>
          <h2 className="line-clamp-2 text-[26px] font-bold leading-[1.3] tracking-[-0.03em] text-white">
            {article.title}
          </h2>
          <p className="mt-3 line-clamp-2 text-[14px] leading-[1.7] text-white/80">
            {article.description}
          </p>
          <p className="mt-5 text-[13px] text-white/60">{article.author}</p>
        </div>
      </div>
    </Link>
  );
}

function SmallCard({ article }: { article: Article }) {
  return (
    <Link href={`/certificate/wiki/${article.id}`} className="block flex-1">
      <div
        className={`flex h-full flex-col justify-between overflow-hidden rounded-[16px] bg-gradient-to-br p-5 ${article.gradient}`}
      >
        <span className="text-[11px] font-medium text-white/70">
          {article.category}
        </span>
        <div>
          <h3 className="mt-2 line-clamp-2 text-[16px] font-bold leading-[1.4] text-white">
            {article.title}
          </h3>
          {article.description && (
            <p className="mt-1.5 line-clamp-2 text-[12px] leading-[1.6] text-white/70">
              {article.description}
            </p>
          )}
          <p className="mt-4 text-[12px] text-white/50">{article.author}</p>
        </div>
      </div>
    </Link>
  );
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-[20px] font-semibold tracking-[-0.03em] text-[#1F2D4A]">
        {title}
      </h2>
      <Link
        href={href}
        className="flex items-center text-[13px] text-[#8A94A6] transition-colors hover:text-[#4876EF]"
      >
        더보기
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function FeaturedCard({ article }: { article: Article }) {
  return (
    <Link href={`/certificate/wiki/${article.id}`} className="block">
      <div
        className={`relative flex h-[260px] overflow-hidden rounded-[14px] bg-gradient-to-br p-5 ${article.gradient}`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:16px_16px]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/78 via-black/42 to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-end">
          <p className="mb-2 text-[12px] font-normal text-white/78">
            {article.author}
          </p>
          <h3 className="line-clamp-3 text-[21px] font-semibold leading-[1.38] tracking-[-0.035em] text-white">
            {article.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}

function ArticleListItem({ article }: { article: Article }) {
  return (
    <Link
      href={`/certificate/wiki/${article.id}`}
      className="group flex min-h-[52px] items-center border-b border-[#EEF1F5] py-3 last:border-none"
    >
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-[15px] font-normal leading-[1.45] tracking-[-0.02em] text-[#1F2937] transition-colors group-hover:text-[#4876EF]">
          {article.title}
        </p>
      </div>
    </Link>
  );
}

function EditorialSection({
  title,
  featured,
  articles,
}: {
  title: string;
  featured: Article;
  articles: Article[];
}) {
  return (
    <section>
      <SectionHeader title={title} href="#" />
      <div className="mt-7 grid grid-cols-[310px_minmax(0,1fr)] gap-6">
        <FeaturedCard article={featured} />
        <div className="pt-0.5">
          {articles.map((article) => (
            <ArticleListItem key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
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
            자격증
          </button>
          <button
            type="button"
            className="h-14 text-[15px] font-medium text-[#9AA3B2]"
          >
            가이드
          </button>
        </div>
        <ol className="px-4 py-3">
          {POPULAR_CERTS.map((cert) => (
            <li key={cert.rank} className="flex items-center gap-3 py-2.5">
              <span
                className={`w-5 shrink-0 text-center text-[14px] font-normal tabular-nums ${
                  cert.rank <= 3 ? "text-[#4876EF]" : "text-[#7B9CF5]"
                }`}
              >
                {cert.rank}
              </span>
              <Link
                href="/certificate"
                className="min-w-0 flex-1 truncate text-[13px] font-normal text-[#334155] transition-colors hover:text-[#4876EF]"
              >
                {cert.name} 준비 전 꼭 확인할 핵심 정보
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}

export default function CertificateWikiPage() {
  return (
    <div>
      <CertificateWikiSubNav />
      <main className="mx-auto w-full max-w-265.5 pb-24 pt-8">
        {/* Hero */}
        <section className="grid grid-cols-[3fr_2fr] gap-4">
          <HeroCard article={HERO} />
          <div className="flex flex-col gap-4">
            {SIDE_ARTICLES.map((a) => (
              <SmallCard key={a.id} article={a} />
            ))}
          </div>
        </section>

        <div className="mt-16 grid grid-cols-[minmax(0,850px)_300px] items-start gap-10">
          <div className="space-y-20">
            <EditorialSection
              title="자격증 취득을 준비하는 당신에게"
              featured={PREP_FEATURED}
              articles={PREP_ARTICLES}
            />

            <EditorialSection
              title="분야별 자격증 가이드"
              featured={GUIDE_FEATURED}
              articles={GUIDE_ARTICLES}
            />

            <EditorialSection
              title="커리어에 바로 쓰는 자격증 이야기"
              featured={COMPANY_FEATURED}
              articles={COMPANY_ARTICLES}
            />
          </div>

          <PopularContentPanel />
        </div>
      </main>
    </div>
  );
}
