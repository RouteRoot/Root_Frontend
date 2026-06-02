"use client";

import type { ArchiveBoardType, ArchivePost, ArchiveSort } from "@/app/api/archive/types";
import type { CertificateDetail } from "@/app/api/certificate/certificate";
import { ChevronLeft, ChevronRight, Eye, Loader2, MessageCircle, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export type MobileArchiveTag = {
  label: string;
  boardType?: ArchiveBoardType;
};

type MobileArchivePageProps = {
  tags: MobileArchiveTag[];
  activeTag: MobileArchiveTag;
  sort: ArchiveSort;
  posts: ArchivePost[];
  featuredPosts: ArchivePost[];
  popularPosts: ArchivePost[];
  topCertificates: CertificateDetail[];
  currentPage: number;
  totalPages: number;
  isFeaturedLoading: boolean;
  isListLoading: boolean;
  isCertLoading: boolean;
  errorMessage: string;
  onTagChange: (tag: MobileArchiveTag) => void;
  onSortChange: (sort: ArchiveSort) => void;
  onPageChange: (page: number) => void;
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

const fallbackGradients = [
  "linear-gradient(135deg,#4876EF,#93C5FD)",
  "linear-gradient(135deg,#0F766E,#5EEAD4)",
  "linear-gradient(135deg,#1F2937,#64748B)",
  "linear-gradient(135deg,#7C3AED,#C4B5FD)",
];

const archiveTabs = [
  { label: "자격증 위키", href: "/certificate/wiki" },
  { label: "아카이브", href: "/certificate/archive" },
  { label: "자격증 탐색", href: "/certificate/explore" },
  { label: "커뮤니티", href: "/community" },
] as const;

function stripHtml(content: string) {
  return content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function extractFirstImage(html: string) {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] ?? "";
}

function formatDate(value: string) {
  const date = value.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date.replace(/-/g, ".");
  return value;
}

function getCategoryLabel(post: ArchivePost) {
  return post.category || boardLabels[post.boardType] || "아카이브";
}

function ArchiveThumb({
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
      className={`relative shrink-0 overflow-hidden bg-[#F3F6FA] ${className}`}
      style={{
        backgroundImage: imageUrl
          ? `url("${imageUrl}")`
          : fallbackGradients[index % fallbackGradients.length],
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {!imageUrl && (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-size-[16px_16px]" />
          <span className="absolute bottom-3 left-3 rounded-full bg-white/20 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur">
            {getCategoryLabel(post)}
          </span>
        </>
      )}
    </div>
  );
}

function FeaturedSection({
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
      <section className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-5">
        <div className="flex h-40 items-center justify-center text-[#98A2B3]">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-8 text-center text-[13px] text-[#8A94A6]">
        추천 콘텐츠가 아직 없어요.
      </section>
    );
  }

  return (
    <section className="-mx-4 overflow-x-auto px-4 pb-1 scrollbar-hide">
      <div className="flex snap-x snap-mandatory gap-3">
        {posts.map((post, index) => (
          <Link
            key={post.postId}
            href={`/certificate/archive/${post.postId}`}
            className="block w-full shrink-0 snap-start overflow-hidden rounded-[8px] border border-[#E5E8EB] bg-white"
          >
        <ArchiveThumb post={post} index={index} className="h-40 w-full" />
        <div className="px-4 py-4">
          <p className="text-[12px] font-semibold text-[#4876EF]">
            {getCategoryLabel(post)}
          </p>
          <h2 className="mt-2 line-clamp-2 text-[18px] font-semibold leading-[1.45] text-[#252A32]">
            {post.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-[13px] leading-[1.6] text-[#667085]">
            {stripHtml(post.content)}
          </p>
        </div>
          </Link>
        ))}
      </div>

      {false && posts.length > 1 && (
        <div className="flex items-center justify-between border-t border-[#EEF1F5] px-4 py-3">
          <span className="text-[12px] font-medium text-[#98A2B3]">
            {current + 1} / {posts.length}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCurrent((value) => (value - 1 + posts.length) % posts.length)}
              className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#E5E8EB] text-[#667085]"
              aria-label="이전 추천 콘텐츠"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrent((value) => (value + 1) % posts.length)}
              className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#E5E8EB] text-[#667085]"
              aria-label="다음 추천 콘텐츠"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function ArchiveCard({ post, index }: { post: ArchivePost; index: number }) {
  return (
    <Link
      href={`/certificate/archive/${post.postId}`}
      className="block rounded-[8px] border border-[#E5E8EB] bg-white p-3 active:bg-[#F7F9FB]"
    >
      <div className="flex gap-3">
        <ArchiveThumb post={post} index={index} className="h-22 w-24 rounded-[8px]" />
        <div className="min-w-0 flex-1">
          <span className="rounded-full bg-[#F7F9FB] px-2.5 py-1 text-[11px] font-medium text-[#667085]">
            {getCategoryLabel(post)}
          </span>
          <h3 className="mt-2 line-clamp-2 text-[14px] font-semibold leading-[1.45] text-[#252A32]">
            {post.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-[12px] leading-[1.5] text-[#667085]">
            {stripHtml(post.content)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-[11px] font-medium text-[#98A2B3]">
        <span>{post.author} · {formatDate(post.createdAt)}</span>
        <span className="flex items-center gap-2">
          <span className="flex items-center gap-0.5">
            <Eye className="h-3.5 w-3.5" />
            {post.viewCount}
          </span>
          <span className="flex items-center gap-0.5">
            <ThumbsUp className="h-3.5 w-3.5" />
            {post.likeCount}
          </span>
          <span className="flex items-center gap-0.5">
            <MessageCircle className="h-3.5 w-3.5" />
            {post.commentCount}
          </span>
        </span>
      </div>
    </Link>
  );
}

export default function MobileArchivePage({
  tags,
  activeTag,
  sort,
  posts,
  featuredPosts,
  popularPosts,
  topCertificates,
  currentPage,
  totalPages,
  isFeaturedLoading,
  isListLoading,
  isCertLoading,
  errorMessage,
  onTagChange,
  onSortChange,
  onPageChange,
}: MobileArchivePageProps) {
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
          {archiveTabs.map((tab) => {
            const active = tab.href === "/certificate/archive";

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

      <FeaturedSection posts={featuredPosts} isLoading={isFeaturedLoading} />

      <section>
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="text-[15px] font-semibold text-[#252A32]">인기 콘텐츠</h2>
          {isFeaturedLoading && <Loader2 className="h-4 w-4 animate-spin text-[#98A2B3]" />}
        </div>
        <div className="flex snap-x gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {popularPosts.slice(0, 5).map((post, index) => (
            <Link
              key={post.postId}
              href={`/certificate/archive/${post.postId}`}
              className="w-[78%] shrink-0 snap-start rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-4"
            >
              <span className="text-[12px] font-semibold text-[#4876EF]">
                {index + 1}
              </span>
              <h3 className="mt-2 line-clamp-2 text-[14px] font-semibold leading-[1.45] text-[#252A32]">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-[12px] leading-[1.55] text-[#667085]">
                {stripHtml(post.content)}
              </p>
            </Link>
          ))}
          {!isFeaturedLoading && popularPosts.length === 0 && (
            <div className="w-full rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-6 text-center text-[13px] text-[#8A94A6]">
              인기 콘텐츠가 아직 없어요.
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="mb-3 flex snap-x gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {tags.map((tag) => {
            const active =
              activeTag.boardType === tag.boardType ||
              (!activeTag.boardType && !tag.boardType);

            return (
              <button
                key={tag.label}
                type="button"
                onClick={() => onTagChange(tag)}
                className={`min-h-9 shrink-0 snap-start rounded-[8px] px-3 text-[12px] font-medium ${
                  active
                    ? "bg-[#252A32] text-white"
                    : "border border-[#E5E8EB] bg-white text-[#667085]"
                }`}
              >
                {tag.label}
              </button>
            );
          })}
        </div>

        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#252A32]">전체 콘텐츠</h2>
          <div className="grid grid-cols-2 rounded-[8px] bg-[#F7F9FB] p-1">
            {([
              { label: "최신", value: "latest" },
              { label: "인기", value: "popular" },
            ] as const).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onSortChange(option.value)}
                className={`min-h-8 rounded-[6px] px-3 text-[12px] font-medium ${
                  sort === option.value ? "bg-white text-[#252A32]" : "text-[#8A94A6]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {errorMessage ? (
          <div className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-8 text-center text-[13px] text-[#8A94A6]">
            {errorMessage}
          </div>
        ) : isListLoading ? (
          <div className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-8 text-center text-[#98A2B3]">
            <Loader2 className="mx-auto h-5 w-5 animate-spin" />
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-2">
            {posts.map((post, index) => (
              <ArchiveCard key={post.postId} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-8 text-center text-[13px] text-[#8A94A6]">
            등록된 아카이브 콘텐츠가 없어요.
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-5 flex items-center justify-center gap-1.5">
            {visiblePages.map((page, index) => {
              const previousPage = visiblePages[index - 1];
              const showGap = index > 0 && page - previousPage > 1;
              const active = page === currentPage;

              return (
                <div key={page} className="flex items-center gap-1.5">
                  {showGap && (
                    <span className="px-1 text-[12px] font-medium text-[#98A2B3]">
                      ...
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => onPageChange(page)}
                    className={`flex h-9 min-w-9 items-center justify-center rounded-[8px] px-2 text-[13px] font-semibold ${
                      active
                        ? "bg-[#252A32] text-white"
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

        {totalPages > 1 && (
          <div className="hidden">
            <button
              type="button"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="min-h-10 rounded-[8px] border border-[#E5E8EB] bg-white text-[13px] font-semibold text-[#667085] disabled:opacity-40"
            >
              이전
            </button>
            <button
              type="button"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="min-h-10 rounded-[8px] border border-[#E5E8EB] bg-white text-[13px] font-semibold text-[#667085] disabled:opacity-40"
            >
              다음
            </button>
          </div>
        )}
      </section>

      <section className="hidden">
        <h2 className="text-[15px] font-semibold text-[#252A32]">인기 자격증</h2>
        <div className="mt-3 space-y-2">
          {isCertLoading ? (
            <div className="py-5 text-center text-[#98A2B3]">
              <Loader2 className="mx-auto h-5 w-5 animate-spin" />
            </div>
          ) : (
            topCertificates.slice(0, 5).map((cert, index) => (
              <Link
                key={cert.examCode}
                href={`/certificate/${encodeURIComponent(cert.examCode)}`}
                className="flex min-h-9 items-center gap-3 rounded-[8px] px-1 text-[13px] active:bg-[#F7F9FB]"
              >
                <span className="w-5 text-center font-semibold text-[#4876EF]">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 truncate font-medium text-[#344054]">
                  {cert.examName}
                </span>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
