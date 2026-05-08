"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  getArchivePopularPosts,
  getArchivePostDetail,
  getArchivePosts,
} from "@/app/api/archive/archive";
import type { ArchiveBoardType, ArchivePost } from "@/app/api/archive/types";
import CertificateWikiSubNav from "@/components/certificate/CertificateWikiSubNav";
import { getWeightedPopularPosts } from "@/lib/archivePopularity";

// ── helpers ────────────────────────────────────────────────────────────────
const GRADIENTS = [
  "from-[#38BDF8] via-[#7DD3FC] to-[#BAE6FD]",
  "from-[#4876EF] via-[#60A5FA] to-[#BFDBFE]",
  "from-[#0F766E] via-[#14B8A6] to-[#CCFBF1]",
  "from-[#0F172A] to-[#334155]",
  "from-[#164E63] to-[#06B6D4]",
  "from-[#4C1D95] to-[#8B5CF6]",
];

const HERO_GRADIENTS = [
  "from-[#1E3A8A] via-[#1D4ED8] to-[#3B82F6]",
  "from-[#5B21B6] to-[#8B5CF6]",
  "from-[#064E3B] to-[#059669]",
];

const BOARD_LABELS: Record<ArchiveBoardType, string> = {
  RECOMMAND: "입문자 추천",
  CERT_ANALYSIS: "자격증 분석",
  JOB_ANALYSIS: "직무 분석",
  EXAM_INFO: "시험 정보",
  STUDY_METHOD: "공부법",
  PASS_STRATEGY: "합격 전략",
  JOB_STRATEGY: "취업 전략",
  EXPERT_INSIGHT: "전문가 인사이트",
};

function extractFirstImage(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function getCategoryLabel(post: ArchivePost): string {
  return post.category || BOARD_LABELS[post.boardType] || "아카이브";
}

// ── hero components ────────────────────────────────────────────────────────
function HeroCard({ post, gradient }: { post: ArchivePost; gradient: string }) {
  const firstImage = extractFirstImage(post.content);
  return (
    <Link href={`/certificate/archive/${post.postId}`} className="block h-full">
      <div
        className={`relative flex aspect-video h-full flex-col justify-end overflow-hidden rounded-[18px] p-7 ${
          firstImage ? "bg-[#F3F6FA]" : `bg-linear-to-br ${gradient}`
        }`}
      >
        {firstImage && (
          <img
            src={firstImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {!firstImage && (
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[18px_18px]" />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/72 via-black/36 to-transparent" />
        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-2">
            <span className="inline-flex w-fit rounded-full bg-white/20 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur-sm">
              {getCategoryLabel(post)}
            </span>
            <span className="text-[12px] font-normal text-white/68">
              {post.author}
            </span>
          </div>
          <h2 className="line-clamp-2 text-[25px] font-semibold leading-[1.32] tracking-[-0.03em] text-white">
            {post.title}
          </h2>
          <p className="mt-3 line-clamp-2 text-[14px] font-normal leading-[1.7] text-white/80">
            {stripHtml(post.content)}
          </p>
        </div>
      </div>
    </Link>
  );
}

function SmallCard({ post, gradient }: { post: ArchivePost; gradient: string }) {
  const firstImage = extractFirstImage(post.content);
  return (
    <Link href={`/certificate/archive/${post.postId}`} className="block flex-1">
      <div
        className={`relative flex aspect-video h-full flex-col justify-end overflow-hidden rounded-2xl p-5 ${
          firstImage ? "bg-[#F3F6FA]" : `bg-linear-to-br ${gradient}`
        }`}
      >
        {firstImage && (
          <img
            src={firstImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {!firstImage && (
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-size-[16px_16px]" />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/72 via-black/32 to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/18 px-2.5 py-1 text-[11px] font-normal text-white/78 backdrop-blur-sm">
              {getCategoryLabel(post)}
            </span>
            <span className="text-[11px] font-normal text-white/62">
              {post.author}
            </span>
          </div>
          <h3 className="mt-2 line-clamp-2 text-[16px] font-semibold leading-[1.42] text-white">
            {post.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}

function HeroSkeleton() {
  return (
    <section className="grid grid-cols-[2fr_1fr] gap-4">
      <div className="aspect-video animate-pulse rounded-[18px] bg-[#EEF2F7]" />
      <div className="flex flex-col gap-4">
        <div className="aspect-video flex-1 animate-pulse rounded-2xl bg-[#EEF2F7]" />
        <div className="aspect-video flex-1 animate-pulse rounded-2xl bg-[#F3F6FA]" />
      </div>
    </section>
  );
}

// ── archive section components ─────────────────────────────────────────────
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

function ArchiveFeaturedCard({
  post,
  gradientIndex,
}: {
  post: ArchivePost;
  gradientIndex: number;
}) {
  const firstImage = extractFirstImage(post.content);
  return (
    <Link href={`/certificate/archive/${post.postId}`} className="block">
      <div
        className={`relative flex h-65 overflow-hidden rounded-[14px] p-5 ${
          firstImage
            ? "bg-[#F3F6FA]"
            : `bg-linear-to-br ${GRADIENTS[gradientIndex % GRADIENTS.length]}`
        }`}
      >
        {firstImage && (
          <img
            src={firstImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {!firstImage && (
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[16px_16px]" />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/78 via-black/42 to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-end">
          <p className="mb-2 text-[12px] font-normal text-white/78">
            {getCategoryLabel(post)}
          </p>
          <h3 className="line-clamp-3 text-[21px] font-semibold leading-[1.38] tracking-[-0.035em] text-white">
            {post.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}

function ArchiveListItem({ post }: { post: ArchivePost }) {
  return (
    <Link
      href={`/certificate/archive/${post.postId}`}
      className="group flex min-h-[52px] items-center border-b border-[#EEF1F5] py-3 last:border-none"
    >
      <p className="line-clamp-1 text-[15px] font-normal leading-[1.45] tracking-[-0.02em] text-[#1F2937] transition-colors group-hover:text-[#4876EF]">
        {post.title}
      </p>
    </Link>
  );
}

function SectionSkeleton() {
  return (
    <section>
      <div className="h-6 w-52 animate-pulse rounded bg-[#EEF2F7]" />
      <div className="mt-7 grid grid-cols-[310px_minmax(0,1fr)] gap-6">
        <div className="h-65 animate-pulse rounded-[14px] bg-[#EEF2F7]" />
        <div className="space-y-1 pt-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-13 animate-pulse rounded bg-[#F3F6FA]" />
          ))}
        </div>
      </div>
    </section>
  );
}

function ArchiveSection({
  title,
  posts,
  gradientIndex,
  isLoading,
}: {
  title: string;
  posts: ArchivePost[];
  gradientIndex: number;
  isLoading: boolean;
}) {
  if (isLoading) return <SectionSkeleton />;

  if (posts.length === 0) {
    return (
      <section>
        <SectionHeader title={title} href="/certificate/archive" />
        <div className="mt-7 flex h-65 items-center justify-center rounded-[14px] border border-[#EEF2F7] bg-[#FBFCFE] text-[14px] text-[#94A3B8]">
          등록된 콘텐츠가 아직 없어요.
        </div>
      </section>
    );
  }

  const [featured, ...rest] = posts;
  return (
    <section>
      <SectionHeader title={title} href="/certificate/archive" />
      <div className="mt-7 grid grid-cols-[310px_minmax(0,1fr)] gap-6">
        <ArchiveFeaturedCard post={featured} gradientIndex={gradientIndex} />
        <div className="pt-0.5">
          {rest.slice(0, 5).map((post) => (
            <ArchiveListItem key={post.postId} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── popular panel ──────────────────────────────────────────────────────────
function PopularContentPanel({ posts }: { posts: ArchivePost[] }) {
  return (
    <aside
      className="sticky"
      style={{
        top: "calc(var(--global-banner-height) + var(--gnb-height) + 1.5rem)",
      }}
    >
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
          {posts.length === 0 && (
            <li className="py-8 text-center text-[13px] text-[#94A3B8]">
              인기 콘텐츠가 아직 없어요.
            </li>
          )}
          {posts.map((post, index) => (
            <li key={post.postId} className="flex items-center gap-3 py-2.5">
              <span
                className={`w-5 shrink-0 text-center text-[14px] font-normal tabular-nums ${
                  index < 3 ? "text-[#4876EF]" : "text-[#7B9CF5]"
                }`}
              >
                {index + 1}
              </span>
              <Link
                href={`/certificate/archive/${post.postId}`}
                className="min-w-0 flex-1 truncate text-[13px] font-normal text-[#334155] transition-colors hover:text-[#4876EF]"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}

// ── page ───────────────────────────────────────────────────────────────────
const HERO_POST_IDS = [30, 29, 28] as const;

export default function CertificateWikiPage() {
  const [heroPosts, setHeroPosts] = useState<ArchivePost[]>([]);
  const [certAnalysisPosts, setCertAnalysisPosts] = useState<ArchivePost[]>([]);
  const [jobAnalysisPosts, setJobAnalysisPosts] = useState<ArchivePost[]>([]);
  const [expertInsightPosts, setExpertInsightPosts] = useState<ArchivePost[]>([]);
  const [popularPosts, setPopularPosts] = useState<ArchivePost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      ...HERO_POST_IDS.map((id) => getArchivePostDetail(id).catch(() => null)),
      getArchivePosts({ boardType: "CERT_ANALYSIS", sort: "popular", size: 6 }),
      getArchivePosts({ boardType: "JOB_ANALYSIS", sort: "popular", size: 6 }),
      getArchivePosts({ boardType: "EXPERT_INSIGHT", sort: "popular", size: 6 }),
      getArchivePopularPosts(10),
    ])
      .then(([hero30, hero29, hero28, certAnalysis, jobAnalysis, expertInsight, popular]) => {
        if (!mounted) return;
        setHeroPosts(
          [hero30, hero29, hero28].filter((p): p is ArchivePost => p !== null)
        );
        setCertAnalysisPosts((certAnalysis as Awaited<ReturnType<typeof getArchivePosts>>).content);
        setJobAnalysisPosts((jobAnalysis as Awaited<ReturnType<typeof getArchivePosts>>).content);
        setExpertInsightPosts((expertInsight as Awaited<ReturnType<typeof getArchivePosts>>).content);
        setPopularPosts(popular as ArchivePost[]);
      })
      .catch(console.error)
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const weightedCertAnalysis = useMemo(
    () => getWeightedPopularPosts(certAnalysisPosts),
    [certAnalysisPosts]
  );
  const weightedJobAnalysis = useMemo(
    () => getWeightedPopularPosts(jobAnalysisPosts),
    [jobAnalysisPosts]
  );
  const weightedExpertInsight = useMemo(
    () => getWeightedPopularPosts(expertInsightPosts),
    [expertInsightPosts]
  );
  const weightedPopular = useMemo(
    () => getWeightedPopularPosts(popularPosts),
    [popularPosts]
  );

  return (
    <div>
      <CertificateWikiSubNav />
      <main className="mx-auto w-full max-w-265.5 pb-24 pt-8">
        {/* Hero — 아카이브 포스트 30, 29, 28 */}
        {isLoading ? (
          <HeroSkeleton />
        ) : heroPosts.length > 0 ? (
          <section className="grid grid-cols-[2fr_1fr] gap-4">
            <HeroCard post={heroPosts[0]} gradient={HERO_GRADIENTS[0]} />
            <div className="flex flex-col gap-4">
              {heroPosts.slice(1).map((post, i) => (
                <SmallCard
                  key={post.postId}
                  post={post}
                  gradient={HERO_GRADIENTS[i + 1]}
                />
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-16 grid grid-cols-[minmax(0,850px)_300px] items-start gap-10">
          <div className="space-y-20">
            <ArchiveSection
              title="자격증 취득을 준비하는 당신에게"
              posts={weightedCertAnalysis}
              gradientIndex={0}
              isLoading={isLoading}
            />
            <ArchiveSection
              title="분야별 자격증 가이드"
              posts={weightedJobAnalysis}
              gradientIndex={2}
              isLoading={isLoading}
            />
            <ArchiveSection
              title="커리어에 바로 쓰는 자격증 이야기"
              posts={weightedExpertInsight}
              gradientIndex={4}
              isLoading={isLoading}
            />
          </div>

          <PopularContentPanel posts={weightedPopular} />
        </div>
      </main>
    </div>
  );
}
