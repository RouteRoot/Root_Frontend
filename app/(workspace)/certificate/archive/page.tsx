"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import {
  getArchivePopularPosts,
  getArchivePosts,
} from "@/app/api/archive/archive";
import type { ArchiveBoardType, ArchivePost } from "@/app/api/archive/types";
import CertificateWikiSubNav from "@/components/certificate/CertificateWikiSubNav";

type ArchiveTag = {
  label: string;
  boardType?: ArchiveBoardType;
};

const ARCHIVE_TAGS: ArchiveTag[] = [
  { label: "전체" },
  { label: "입문자 추천", boardType: "RECOMMAND" },
  { label: "자격증 분석", boardType: "CERT_ANALYSIS" },
  { label: "직무 분석", boardType: "JOB_ANALYSIS" },
  { label: "시험 정보", boardType: "EXAM_INFO" },
  { label: "공부법", boardType: "STUDY_METHOD" },
  { label: "합격 전략", boardType: "PASS_STRATEGY" },
  { label: "취업 전략", boardType: "JOB_STRATEGY" },
  { label: "전문가 인사이트", boardType: "EXPERT_INSIGHT" },
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

const GRADIENTS = [
  "from-[#38BDF8] via-[#7DD3FC] to-[#BAE6FD]",
  "from-[#4876EF] via-[#60A5FA] to-[#BFDBFE]",
  "from-[#0F766E] via-[#14B8A6] to-[#CCFBF1]",
  "from-[#0F172A] to-[#334155]",
  "from-[#164E63] to-[#06B6D4]",
  "from-[#4C1D95] to-[#8B5CF6]",
];

function stripHtml(content: string) {
  if (!content) return "";
  return content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function formatDate(value: string) {
  if (!value) return "";
  const date = value.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date.replace(/-/g, ".");
  return value;
}

function getCategoryLabel(post: ArchivePost) {
  return post.category || BOARD_LABELS[post.boardType] || "아카이브";
}

function FeaturedArchive({ posts }: { posts: ArchivePost[] }) {
  const [current, setCurrent] = useState(0);
  const featuredPosts = posts.slice(0, 5);
  const currentIndex = featuredPosts.length > 0 ? current % featuredPosts.length : 0;
  const post = featuredPosts[currentIndex];

  if (!post) {
    return (
      <section className="flex h-[253px] max-w-[760px] items-center justify-center rounded-[8px] border border-[#EEF2F7] bg-[#FBFCFE] text-[14px] text-[#94A3B8]">
        추천 콘텐츠가 아직 없어요.
      </section>
    );
  }

  return (
    <section className="relative max-w-[760px]">
      <Link
        href={`/certificate/archive/${post.postId}`}
        className="group grid w-fit grid-cols-[456px_220px] items-start gap-[30px]"
      >
        <div
          className={`relative h-[253px] w-[456px] overflow-hidden rounded-[8px] bg-gradient-to-br ${
            GRADIENTS[currentIndex % GRADIENTS.length]
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_32%,rgba(255,255,255,0.45),transparent_22%),linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:auto,18px_18px,18px_18px]" />
          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/65" />
          <div className="absolute left-[48%] top-[42%] h-10 w-10 rounded-full bg-[#4876EF]/80" />
          <div className="absolute bottom-8 left-8 h-10 w-36 rounded-full bg-white/45" />
        </div>

        <div className="min-w-0 pt-1">
          <p className="text-[14px] font-semibold text-[#4876EF]">
            {getCategoryLabel(post)}
          </p>
          <h2 className="mt-1.5 line-clamp-2 max-h-[96px] break-words text-[22px] font-bold leading-[1.42] text-[#333333]">
            {post.title}
          </h2>
        </div>
      </Link>

      {featuredPosts.length > 1 && (
        <div className="absolute bottom-1 right-0 flex items-center gap-5 text-[#C0C8D5]">
          <button
            type="button"
            onClick={() =>
              setCurrent(
                (value) => (value - 1 + featuredPosts.length) % featuredPosts.length
              )
            }
            aria-label="이전 추천 콘텐츠"
            className="transition-colors hover:text-[#4876EF]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() =>
              setCurrent((value) => (value + 1) % featuredPosts.length)
            }
            aria-label="다음 추천 콘텐츠"
            className="transition-colors hover:text-[#4876EF]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </section>
  );
}

function ArchiveListItem({
  post,
  index,
}: {
  post: ArchivePost;
  index: number;
}) {
  return (
    <Link
      href={`/certificate/archive/${post.postId}`}
      className="group flex gap-5 py-5"
    >
      <div
        className={`relative h-[96px] w-[172px] shrink-0 overflow-hidden rounded-[8px] bg-gradient-to-br ${
          GRADIENTS[index % GRADIENTS.length]
        }`}
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:16px_16px]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
        <span className="absolute bottom-3 left-3 text-[12px] font-semibold text-white">
          {getCategoryLabel(post)}
        </span>
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <h2 className="line-clamp-1 text-[20px] font-semibold leading-[1.35] tracking-[-0.02em] text-[#333333]">
          {post.title}
        </h2>
        <p className="mt-2.5 line-clamp-2 text-[13px] leading-[1.65] text-[#667085]">
          {stripHtml(post.content)}
        </p>
        <p className="mt-3 text-[12px] text-[#6B7280]">
          {post.author} · {formatDate(post.createdAt)}
        </p>
      </div>
    </Link>
  );
}

function PopularContentPanel({ posts }: { posts: ArchivePost[] }) {
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
          {posts.length === 0 && (
            <li className="py-8 text-center text-[13px] text-[#94A3B8]">
              인기 콘텐츠가 아직 없어요.
            </li>
          )}
          {posts.map((post, index) => (
            <li key={post.postId} className="flex items-center gap-3 py-2.5">
              <span className="w-5 shrink-0 text-center text-[14px] font-normal text-[#4876EF] tabular-nums">
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

export default function CertificateArchivePage() {
  const [activeTag, setActiveTag] = useState<ArchiveTag>(ARCHIVE_TAGS[0]);
  const [posts, setPosts] = useState<ArchivePost[]>([]);
  const [popularPosts, setPopularPosts] = useState<ArchivePost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [archivePage, popular] = await Promise.all([
          getArchivePosts({
            boardType: activeTag.boardType,
            sort: "popular",
            page: 0,
            size: 12,
          }),
          getArchivePopularPosts(10),
        ]);

        if (!mounted) return;
        setPosts(archivePage.content);
        setPopularPosts(popular);
      } catch (error) {
        console.error("archive load failed:", error);
        if (!mounted) return;
        setErrorMessage("아카이브 콘텐츠를 불러오지 못했습니다.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [activeTag]);

  const featuredPosts = useMemo(() => {
    const recommendPosts = posts.filter((post) => post.boardType === "RECOMMAND");
    return recommendPosts.length > 0 ? recommendPosts : posts;
  }, [posts]);

  const listPosts = useMemo(
    () => posts.filter((post) => post.postId !== featuredPosts[0]?.postId),
    [featuredPosts, posts]
  );

  return (
    <div>
      <CertificateWikiSubNav />
      <main className="mx-auto w-full max-w-265.5 pb-24 pt-16">
        <div className="grid grid-cols-[minmax(0,850px)_300px] items-start gap-10">
          <div>
            <div className="mb-8">
              <h1 className="text-[26px] font-semibold tracking-[-0.04em] text-[#333333]">
                자격증 준비에 필요한 콘텐츠
              </h1>
            </div>

            {isLoading ? (
              <div className="flex min-h-[360px] items-center justify-center text-[#94A3B8]">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : errorMessage ? (
              <div className="flex min-h-[360px] items-center justify-center rounded-[18px] border border-[#EEF2F7] bg-[#FBFCFE] text-[14px] text-[#94A3B8]">
                {errorMessage}
              </div>
            ) : (
              <>
                <FeaturedArchive posts={featuredPosts} />

                <div className="mt-16">
                  <div className="flex flex-wrap gap-2.5">
                    {ARCHIVE_TAGS.map((tag) => {
                      const active = activeTag.label === tag.label;

                      return (
                        <button
                          key={tag.label}
                          type="button"
                          onClick={() => setActiveTag(tag)}
                          className={`h-10 rounded-full border px-5 text-[14px] transition-colors ${
                            active
                              ? "border-[#DDE7FF] bg-[#EEF4FF] font-medium text-[#4876EF]"
                              : "border-[#E5E8EB] bg-white font-normal text-[#667085] hover:border-[#C9D7F5] hover:text-[#4876EF]"
                          }`}
                        >
                          {tag.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-14 divide-y divide-[#F1F3F6]">
                  {listPosts.length === 0 ? (
                    <div className="py-16 text-center text-[14px] text-[#94A3B8]">
                      등록된 아카이브 콘텐츠가 아직 없어요.
                    </div>
                  ) : (
                    listPosts.map((post, index) => (
                      <ArchiveListItem
                        key={post.postId}
                        post={post}
                        index={index}
                      />
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          <PopularContentPanel posts={popularPosts} />
        </div>
      </main>
    </div>
  );
}
