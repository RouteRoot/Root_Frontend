"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Eye, Heart, Loader2, MessageCircle, MoreVertical } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  deleteArchivePost,
  getArchivePopularPosts,
  getArchivePostDetail,
} from "@/app/api/archive/archive";
import type { ArchiveBoardType, ArchivePost } from "@/app/api/archive/types";
import CertificateWikiSubNav from "@/components/certificate/CertificateWikiSubNav";
import { useWikiEditorAccess } from "@/components/certificate/useWikiEditorAccess";

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

function formatDate(value: string) {
  if (!value) return "";
  const date = value.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date.replace(/-/g, ". ");
  return value;
}


function getCategoryLabel(post: ArchivePost) {
  return post.category || BOARD_LABELS[post.boardType] || "아카이브";
}

function PopularContentPanel({
  posts,
  isLoading,
}: {
  posts: ArchivePost[];
  isLoading: boolean;
}) {
  return (
    <aside className="sticky" style={{ top: "calc(var(--global-banner-height) + var(--gnb-height) + 1.5rem)" }}>
      <h3 className="text-[19px] font-semibold tracking-[-0.03em] text-[#1F2937]">
        실시간 인기 콘텐츠
      </h3>
      <div className="mt-6 overflow-hidden rounded-[14px] border border-[#E5E8EB] bg-white">
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
          {isLoading ? (
            <li className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-[#C0C8D5]" />
            </li>
          ) : posts.length === 0 ? (
            <li className="py-8 text-center text-[13px] text-[#94A3B8]">
              인기 콘텐츠가 아직 없어요.
            </li>
          ) : null}
          {!isLoading && posts.map((post, index) => (
            <li key={post.postId} className="flex items-center gap-3 py-2.5">
              <span className="w-5 shrink-0 text-center text-[14px] font-normal text-[#00A86B] tabular-nums">
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

function extractFirstImage(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

export default function ArchiveDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const postId = Number(params.id);
  const { isEditor } = useWikiEditorAccess();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [post, setPost] = useState<ArchivePost | null>(null);
  const [popularPosts, setPopularPosts] = useState<ArchivePost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!Number.isFinite(postId) || postId <= 0) {
      setErrorMessage("잘못된 콘텐츠 주소입니다.");
      setIsLoading(false);
      return;
    }

    let mounted = true;

    async function load() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [detail, popular] = await Promise.all([
          getArchivePostDetail(postId),
          getArchivePopularPosts(10),
        ]);

        if (!mounted) return;
        setPost(detail);
        setPopularPosts(popular);
      } catch {
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
  }, [postId]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleDelete = async () => {
    if (!post || isDeleting) return;
    const ok = window.confirm("아카이브 글을 삭제할까요?");
    if (!ok) return;

    try {
      setIsDeleting(true);
      await deleteArchivePost(post.postId);
      router.push("/certificate/archive");
    } catch {
      setErrorMessage("아카이브 글을 삭제하지 못했습니다.");
    } finally {
      setIsDeleting(false);
      setMenuOpen(false);
    }
  };

  return (
    <div>
      <CertificateWikiSubNav />
      <main className="mx-auto grid w-full max-w-[1066px] grid-cols-[700px_300px] items-start gap-[60px] pb-24 pt-12">
        <div>
          {isLoading ? (
            <div className="min-h-[620px]">
              <div className="h-4 w-24 animate-pulse rounded bg-[#EEF2F7]" />
              <div className="mt-4 h-9 w-4/5 animate-pulse rounded bg-[#EEF2F7]" />
              <div className="mt-4 h-6 w-2/3 animate-pulse rounded bg-[#F3F6FA]" />
              <div className="mt-12 h-[394px] animate-pulse bg-[#EEF2F7]" />
            </div>
          ) : errorMessage || !post ? (
            <div className="flex min-h-[520px] items-center justify-center rounded-[18px] border border-[#EEF2F7] bg-[#FBFCFE] text-[14px] text-[#94A3B8]">
              {errorMessage || "콘텐츠가 없습니다."}
            </div>
          ) : (
            <article className="relative">
              {isEditor && (
                <div ref={menuRef} className="absolute right-0 top-0 z-20">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((value) => !value)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#9AA3B2] transition hover:bg-[#F3F6FA] hover:text-[#333333]"
                    aria-label="관리 메뉴 열기"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-10 w-[160px] overflow-hidden rounded-[14px] border border-[#E5E8EB] bg-white py-2 shadow-[0_16px_42px_rgba(15,23,42,0.14)]">
                      <Link
                        href={`/certificate/archive/edit/${post.postId}`}
                        className="block px-5 py-3 text-[15px] font-semibold text-[#333333] transition hover:bg-[#F8FAFC]"
                        onClick={() => setMenuOpen(false)}
                      >
                        수정하기
                      </Link>
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="block w-full px-5 py-3 text-left text-[15px] font-semibold text-[#EF4444] transition hover:bg-[#FFF5F5] disabled:opacity-40"
                      >
                        {isDeleting ? "삭제 중" : "삭제하기"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              <p className="pr-12 text-[14px] font-semibold text-[#A0AEC0]">
                {getCategoryLabel(post)}
              </p>
              <h1 className="mt-3 pr-12 text-[32px] font-semibold leading-[1.35] tracking-[-0.04em] text-[#1F2937]">
                {post.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px] text-[#9AA3B2]">
                <span>{formatDate(post.createdAt)}</span>
                <span className="h-3 w-px bg-[#E5E8EB]" />
                <span>{post.author}</span>
                <span className="h-3 w-px bg-[#E5E8EB]" />
                <span className="inline-flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {post.viewCount}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5" />
                  {post.likeCount}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageCircle className="h-3.5 w-3.5" />
                  {post.commentCount}
                </span>
              </div>

              <div className="mt-10 border-t border-[#E5E8EB]" />

              <div className="mt-12">
                <div
                  className="rich-text-content prose prose-slate max-w-none text-[16px] leading-[1.6] text-[#333333] prose-p:my-4"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </article>
          )}
        </div>

        <PopularContentPanel posts={popularPosts} isLoading={isLoading} />
      </main>
    </div>
  );
}
