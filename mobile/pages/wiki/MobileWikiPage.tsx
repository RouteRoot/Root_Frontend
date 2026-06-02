"use client";

import type { ArchiveBoardType, ArchivePost } from "@/app/api/archive/types";
import type { CertificateDetail } from "@/app/api/certificate/certificate";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type MobileWikiPageProps = {
  heroPosts: ArchivePost[];
  certAnalysisPosts: ArchivePost[];
  jobAnalysisPosts: ArchivePost[];
  expertInsightPosts: ArchivePost[];
  popularPosts: ArchivePost[];
  topCertificates: CertificateDetail[];
  isLoading: boolean;
  isCertLoading: boolean;
};

const boardLabels: Record<ArchiveBoardType, string> = {
  RECOMMAND: "입문자 추천",
  CERT_ANALYSIS: "자격증 분석",
  JOB_ANALYSIS: "직무 분석",
  EXAM_INFO: "시험 정보",
  STUDY_METHOD: "공부법",
  PASS_STRATEGY: "합격 전략",
  JOB_STRATEGY: "취업 전략",
  EXPERT_INSIGHT: "전문가 인사이트",
};

const wikiTabs = [
  { label: "자격증 위키", href: "/certificate/wiki" },
  { label: "아카이브", href: "/certificate/archive" },
  { label: "자격증 탐색", href: "/certificate/explore" },
  { label: "커뮤니티", href: "/community" },
] as const;

const fallbackGradients = [
  "linear-gradient(135deg,#1D4ED8,#93C5FD)",
  "linear-gradient(135deg,#0F766E,#5EEAD4)",
  "linear-gradient(135deg,#6D28D9,#C4B5FD)",
  "linear-gradient(135deg,#1F2937,#94A3B8)",
];

function stripHtml(content: string) {
  return content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function extractFirstImage(html: string) {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] ?? "";
}

function getCategoryLabel(post: ArchivePost) {
  return post.category || boardLabels[post.boardType] || "아카이브";
}

function ImageSurface({
  post,
  index,
  className,
}: {
  post: ArchivePost;
  index: number;
  className: string;
}) {
  const imageUrl = extractFirstImage(post.content);

  return (
    <div
      className={`relative overflow-hidden bg-[#F3F6FA] ${className}`}
      style={{
        backgroundImage: imageUrl
          ? `url("${imageUrl}")`
          : fallbackGradients[index % fallbackGradients.length],
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
      {!imageUrl && (
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.11)_1px,transparent_1px)] bg-size-[16px_16px]" />
      )}
    </div>
  );
}

function HeroCarousel({
  posts,
  isLoading,
}: {
  posts: ArchivePost[];
  isLoading: boolean;
}) {
  const [current, setCurrent] = useState(0);
  const post = posts.length > 0 ? posts[current % posts.length] : null;

  if (isLoading) {
    return (
      <section className="h-55 animate-pulse rounded-[8px] bg-white" />
    );
  }

  if (!post) return null;

  return (
    <section className="overflow-hidden rounded-[8px] border border-[#E5E8EB] bg-white">
      <Link
        href={`/certificate/archive/${post.postId}`}
        className="relative block h-55 overflow-hidden"
      >
        <ImageSurface post={post} index={current} className="absolute inset-0" />
        <div className="relative z-10 flex h-full flex-col justify-end px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="w-fit rounded-full bg-white/18 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
              {getCategoryLabel(post)}
            </span>
            <span className="text-[11px] font-medium text-white/70">
              {post.author}
            </span>
          </div>
          <h1 className="mt-3 line-clamp-2 text-[20px] font-semibold leading-[1.35] text-white">
            {post.title}
          </h1>
          <p className="mt-2 line-clamp-2 text-[12px] leading-[1.55] text-white/80">
            {stripHtml(post.content)}
          </p>
        </div>
      </Link>

      {posts.length > 1 && (
        <div className="flex items-center justify-between border-t border-[#EEF1F5] px-4 py-3">
          <div className="flex items-center gap-1.5">
            {posts.map((item, index) => (
              <button
                key={item.postId}
                type="button"
                onClick={() => setCurrent(index)}
                className={`h-1.5 rounded-full transition-all ${
                  current === index ? "w-4 bg-[#4876EF]" : "w-1.5 bg-[#D0D5DD]"
                }`}
                aria-label={`${index + 1}번째 위키 콘텐츠 보기`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                setCurrent((value) => (value - 1 + posts.length) % posts.length)
              }
              className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#E5E8EB] text-[#667085]"
              aria-label="이전 위키 콘텐츠"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrent((value) => (value + 1) % posts.length)}
              className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#E5E8EB] text-[#667085]"
              aria-label="다음 위키 콘텐츠"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function WikiSection({
  title,
  posts,
  index,
  isLoading,
}: {
  title: string;
  posts: ArchivePost[];
  index: number;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <section>
        <div className="h-5 w-36 animate-pulse rounded bg-[#EEF2F7]" />
        <div className="mt-3 h-36 animate-pulse rounded-[8px] bg-white" />
        <div className="mt-2 space-y-2">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-12 animate-pulse rounded-[8px] bg-white" />
          ))}
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section>
        <SectionTitle title={title} />
        <div className="mt-3 rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-8 text-center text-[13px] text-[#8A94A6]">
          콘텐츠가 아직 없어요.
        </div>
      </section>
    );
  }

  const [featured, ...items] = posts;

  return (
    <section>
      <SectionTitle title={title} />
      <Link
        href={`/certificate/archive/${featured.postId}`}
        className="mt-3 block overflow-hidden rounded-[8px] border border-[#E5E8EB] bg-white"
      >
        <div className="relative h-36">
          <ImageSurface post={featured} index={index} className="h-full w-full" />
          <div className="absolute bottom-3 left-3 right-3">
            <span className="rounded-full bg-white/18 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
              {getCategoryLabel(featured)}
            </span>
            <h3 className="mt-2 line-clamp-2 text-[16px] font-semibold leading-[1.4] text-white">
              {featured.title}
            </h3>
          </div>
        </div>
      </Link>

      <div className="mt-2 space-y-2">
        {items.slice(0, 4).map((post) => (
          <Link
            key={post.postId}
            href={`/certificate/archive/${post.postId}`}
            className="flex min-h-13 items-center rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-3 active:bg-[#F7F9FB]"
          >
            <p className="line-clamp-2 text-[13px] font-medium leading-[1.5] text-[#344054]">
              {post.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between px-1">
      <h2 className="text-[16px] font-semibold text-[#252A32]">{title}</h2>
      <Link
        href="/certificate/archive"
        className="flex items-center text-[12px] font-medium text-[#8A94A6]"
      >
        더보기
        <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function PopularList({
  posts,
  topCertificates,
  isLoading,
  isCertLoading,
}: {
  posts: ArchivePost[];
  topCertificates: CertificateDetail[];
  isLoading: boolean;
  isCertLoading: boolean;
}) {
  return (
    <section className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-4">
      <h2 className="text-[15px] font-semibold text-[#252A32]">실시간 인기</h2>
      <div className="mt-3 grid grid-cols-2 gap-4">
        <div>
          <p className="mb-2 text-[12px] font-semibold text-[#4876EF]">콘텐츠</p>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-[#98A2B3]" />
          ) : (
            <ol className="space-y-2">
              {posts.slice(0, 5).map((post, index) => (
                <li key={post.postId} className="flex gap-2">
                  <span className="w-4 text-[12px] font-semibold text-[#4876EF]">
                    {index + 1}
                  </span>
                  <Link
                    href={`/certificate/archive/${post.postId}`}
                    className="min-w-0 flex-1 truncate text-[12px] font-medium text-[#344054]"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </div>
        <div>
          <p className="mb-2 text-[12px] font-semibold text-[#4876EF]">자격증</p>
          {isCertLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-[#98A2B3]" />
          ) : (
            <ol className="space-y-2">
              {topCertificates.slice(0, 5).map((cert, index) => (
                <li key={cert.examCode} className="flex gap-2">
                  <span className="w-4 text-[12px] font-semibold text-[#4876EF]">
                    {index + 1}
                  </span>
                  <Link
                    href={`/certificate/${encodeURIComponent(cert.examCode)}`}
                    className="min-w-0 flex-1 truncate text-[12px] font-medium text-[#344054]"
                  >
                    {cert.examName}
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}

export default function MobileWikiPage({
  heroPosts,
  certAnalysisPosts,
  jobAnalysisPosts,
  expertInsightPosts,
  popularPosts,
  topCertificates,
  isLoading,
  isCertLoading,
}: MobileWikiPageProps) {
  return (
    <div className="mx-auto flex w-full max-w-[430px] flex-col gap-4 pb-8">
      <nav className="-mx-4 border-b border-[#E5E8EB] bg-white px-4">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
          {wikiTabs.map((tab) => {
            const active = tab.href === "/certificate/wiki";

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`relative shrink-0 pb-3 pt-3 text-[14px] font-medium ${
                  active ? "text-[#252A32]" : "text-[#98A2B3]"
                }`}
              >
                {tab.label}
                {active && (
                  <span className="absolute bottom-[-1px] left-0 h-0.5 w-full bg-[#4876EF]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <HeroCarousel posts={heroPosts} isLoading={isLoading} />

      <WikiSection
        title="자격증 취득을 준비하는 당신에게"
        posts={certAnalysisPosts}
        index={0}
        isLoading={isLoading}
      />
      <WikiSection
        title="분야별 자격증 가이드"
        posts={jobAnalysisPosts}
        index={1}
        isLoading={isLoading}
      />
      <WikiSection
        title="커리어에 바로 닿는 이야기"
        posts={expertInsightPosts}
        index={2}
        isLoading={isLoading}
      />

      <PopularList
        posts={popularPosts}
        topCertificates={topCertificates}
        isLoading={isLoading}
        isCertLoading={isCertLoading}
      />
    </div>
  );
}
