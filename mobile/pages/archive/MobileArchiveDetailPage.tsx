"use client";

import type { ArchivePost } from "@/app/api/archive/types";
import { Eye, Heart, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type MobileArchiveDetailPageProps = {
  post: ArchivePost;
  categoryLabel: string;
  formattedDate: string;
  isEditor: boolean;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export function MobileArchiveDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[430px] pb-8">
      <div className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-5">
        <div className="h-4 w-24 animate-pulse rounded bg-[#EEF2F7]" />
        <div className="mt-4 h-7 w-5/6 animate-pulse rounded bg-[#F3F6FA]" />
        <div className="mt-3 h-4 w-40 animate-pulse rounded bg-[#F3F6FA]" />
        <div className="mt-8 space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-[#F3F6FA]" />
          <div className="h-4 w-full animate-pulse rounded bg-[#F3F6FA]" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-[#F3F6FA]" />
        </div>
      </div>
    </div>
  );
}

export function MobileArchiveDetailError({ message }: { message: string }) {
  return (
    <div className="mx-auto w-full max-w-[430px] pb-8">
      <div className="rounded-[8px] border border-[#E5E8EB] bg-white px-5 py-10 text-center">
        <p className="text-[14px] font-medium text-[#8A94A6]">{message}</p>
        <Link
          href="/certificate/archive"
          className="mt-5 inline-flex min-h-10 items-center rounded-[8px] bg-[#4876EF] px-4 text-[13px] font-semibold text-white"
        >
          아카이브로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default function MobileArchiveDetailPage({
  post,
  categoryLabel,
  formattedDate,
  isEditor,
  isDeleting,
  onEdit,
  onDelete,
}: MobileArchiveDetailPageProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <div className="mx-auto flex w-full max-w-[430px] flex-col gap-4 pb-8">
      <article className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="rounded-full bg-[#F7F9FB] px-2.5 py-1 text-[11px] font-semibold text-[#4876EF]">
              {categoryLabel}
            </span>
          </div>

          {isEditor && (
            <div ref={menuRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                className="flex h-8 w-8 items-center justify-center text-[#667085]"
                aria-label="관리 메뉴 열기"
              >
                <MoreVertical className="h-5 w-5" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-8 z-20 w-32 overflow-hidden rounded-[8px] border border-[#E5E8EB] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.14)]">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit();
                    }}
                    className="flex min-h-11 w-full items-center px-4 text-[13px] font-medium text-[#252A32]"
                  >
                    수정하기
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete();
                    }}
                    disabled={isDeleting}
                    className="flex min-h-11 w-full items-center px-4 text-[13px] font-medium text-[#EF4444] disabled:opacity-40"
                  >
                    {isDeleting ? "삭제 중" : "삭제하기"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <h1 className="mt-4 text-[21px] font-semibold leading-[1.42] text-[#252A32]">
          {post.title}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] font-medium text-[#98A2B3]">
          <span className="text-[#667085]">{post.author}</span>
          <span className="h-1 w-1 rounded-full bg-[#D0D5DD]" />
          <span>{formattedDate}</span>
        </div>

        <div className="mt-4 flex items-center gap-3 text-[12px] font-medium text-[#98A2B3]">
          <span className="inline-flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{post.viewCount}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span>{post.likeCount}</span>
          </span>
        </div>

        <div
          className="rich-text-content mt-7 overflow-x-auto pb-2 text-[15px] leading-[1.75] text-[#344054]"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <Link
        href="/certificate/archive"
        className="flex min-h-12 items-center justify-center rounded-[8px] border border-[#E5E8EB] bg-white text-[14px] font-semibold text-[#475467]"
      >
        목록으로
      </Link>
    </div>
  );
}
