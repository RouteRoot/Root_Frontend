"use client";

import type { Comment, Post } from "@/app/api/community/types";
import { updateComment } from "@/app/api/community/comment";
import { sanitizeRichText } from "@/components/community/RichTextEditor";
import {
  Eye,
  MessageCircle,
  MoreVertical,
  Send,
  Share2,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type MobileCommunityDetailPageProps = {
  post: Post;
  comments: Comment[];
  liked: boolean;
  commentText: string;
  isSubmittingComment: boolean;
  myName: string | null;
  canManagePost: boolean;
  isEditor: boolean;
  isPicked: boolean;
  categoryLabel: string;
  pickLabel: string;
  errorMessage?: string;
  onLike: () => void;
  onShare: () => void;
  onCommentTextChange: (value: string) => void;
  onCreateComment: () => void;
  onRequestDeleteComment: (commentId: number) => void;
  onUpdateComment: (commentId: number, content: string) => void;
  onEditPost: () => void;
  onRequestDeletePost: () => void;
  onTogglePick: () => void;
};

function formatRelativeTime(createdAt: string) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return createdAt;

  const diffMinutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (diffMinutes < 1) return "방금 전";
  if (diffMinutes < 60) return `${diffMinutes}분 전`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
  }).format(date);
}

function MobileActionMenu({
  canPick,
  pickLabel,
  onTogglePick,
  onEdit,
  onDelete,
}: {
  canPick: boolean;
  pickLabel: string;
  onTogglePick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="absolute right-0 top-8 z-20 w-36 overflow-hidden rounded-[8px] border border-[#E5E8EB] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.14)]">
      {canPick && (
        <button
          type="button"
          onClick={onTogglePick}
          className="flex min-h-11 w-full items-center px-4 text-[13px] font-medium text-[#4876EF]"
        >
          {pickLabel}
        </button>
      )}
      <button
        type="button"
        onClick={onEdit}
        className="flex min-h-11 w-full items-center px-4 text-[13px] font-medium text-[#252A32]"
      >
        수정하기
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="flex min-h-11 w-full items-center px-4 text-[13px] font-medium text-[#EF4444]"
      >
        삭제하기
      </button>
    </div>
  );
}

function MobileCommentItem({
  comment,
  isAuthor,
  onDelete,
  onUpdate,
}: {
  comment: Comment;
  isAuthor: boolean;
  onDelete: (commentId: number) => void;
  onUpdate: (commentId: number, content: string) => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSave = async () => {
    const next = editText.trim();
    if (!next || isSaving) return;

    try {
      setIsSaving(true);
      await updateComment(comment.commentId, {
        content: next,
        postId: comment.postId,
      });
      onUpdate(comment.commentId, next);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <article className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-[#252A32]">
              {comment.author}
            </span>
            <span className="text-[11px] font-medium text-[#A0AEC0]">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>
        </div>

        {isAuthor && (
          <div ref={menuRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex h-7 w-7 items-center justify-center text-[#667085]"
              aria-label="댓글 더보기"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-7 z-10 w-28 overflow-hidden rounded-[8px] border border-[#E5E8EB] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.14)]">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setIsEditing(true);
                  }}
                  className="flex min-h-10 w-full items-center px-3 text-[13px] font-medium text-[#252A32]"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(comment.commentId);
                  }}
                  className="flex min-h-10 w-full items-center px-3 text-[13px] font-medium text-[#EF4444]"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="mt-3">
          <textarea
            value={editText}
            onChange={(event) => setEditText(event.target.value)}
            className="min-h-24 w-full resize-none rounded-[8px] border border-[#4876EF] px-3 py-3 text-[14px] leading-[1.6] text-[#252A32] outline-none"
            autoFocus
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setEditText(comment.content);
                setIsEditing(false);
              }}
              className="flex min-h-9 items-center rounded-[8px] border border-[#E5E8EB] px-3 text-[12px] font-medium text-[#667085]"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!editText.trim() || isSaving}
              className="flex min-h-9 items-center rounded-[8px] bg-[#4876EF] px-3 text-[12px] font-semibold text-white disabled:bg-[#CBD8FF]"
            >
              저장
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-2 whitespace-pre-wrap text-[14px] leading-[1.65] text-[#344054]">
          {comment.content}
        </p>
      )}
    </article>
  );
}

export function MobileCommunityDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[430px] pb-8">
      <div className="h-10 w-10 animate-pulse rounded-[8px] bg-[#EEF2F7]" />
      <div className="mt-5 rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-5">
        <div className="h-4 w-24 animate-pulse rounded bg-[#EEF2F7]" />
        <div className="mt-4 h-6 w-5/6 animate-pulse rounded bg-[#F3F6FA]" />
        <div className="mt-6 h-4 w-full animate-pulse rounded bg-[#F3F6FA]" />
        <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-[#F3F6FA]" />
      </div>
    </div>
  );
}

export function MobileCommunityDetailError({
  message,
}: {
  message: string;
}) {
  return (
    <div className="mx-auto w-full max-w-[430px] pb-8">
      <div className="rounded-[8px] border border-[#E5E8EB] bg-white px-5 py-10 text-center">
        <p className="text-[14px] font-medium text-[#8A94A6]">{message}</p>
        <Link
          href="/community"
          className="mt-5 inline-flex min-h-10 items-center rounded-[8px] bg-[#4876EF] px-4 text-[13px] font-semibold text-white"
        >
          커뮤니티로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default function MobileCommunityDetailPage({
  post,
  comments,
  liked,
  commentText,
  isSubmittingComment,
  myName,
  canManagePost,
  isEditor,
  isPicked,
  categoryLabel,
  pickLabel,
  errorMessage,
  onLike,
  onShare,
  onCommentTextChange,
  onCreateComment,
  onRequestDeleteComment,
  onUpdateComment,
  onEditPost,
  onRequestDeletePost,
  onTogglePick,
}: MobileCommunityDetailPageProps) {
  const postMenuRef = useRef<HTMLDivElement>(null);
  const [postMenuOpen, setPostMenuOpen] = useState(false);
  const sanitizedContent = useMemo(() => sanitizeRichText(post.content), [post.content]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (postMenuRef.current && !postMenuRef.current.contains(event.target as Node)) {
        setPostMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-[430px] flex-col gap-4 pb-8">
      <article className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="rounded-full bg-[#F7F9FB] px-2.5 py-1 text-[11px] font-medium text-[#667085]">
              {categoryLabel}
            </span>
            {isPicked && (
              <span className="rounded-full bg-[#EEF4FF] px-2.5 py-1 text-[11px] font-semibold text-[#4876EF]">
                PICK
              </span>
            )}
          </div>

          {canManagePost && (
            <div ref={postMenuRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setPostMenuOpen((prev) => !prev)}
                className="flex h-8 w-8 items-center justify-center text-[#252A32]"
                aria-label="게시글 더보기"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
              {postMenuOpen && (
                <MobileActionMenu
                  canPick={isEditor}
                  pickLabel={pickLabel}
                  onTogglePick={() => {
                    setPostMenuOpen(false);
                    onTogglePick();
                  }}
                  onEdit={() => {
                    setPostMenuOpen(false);
                    onEditPost();
                  }}
                  onDelete={() => {
                    setPostMenuOpen(false);
                    onRequestDeletePost();
                  }}
                />
              )}
            </div>
          )}
        </div>

        <h1 className="mt-4 text-[20px] font-semibold leading-[1.45] tracking-tight text-[#252A32]">
          {post.title}
        </h1>

        <div className="mt-3 flex items-center gap-2 text-[12px] font-medium text-[#98A2B3]">
          <span className="text-[#667085]">{post.author}</span>
          <span className="h-1 w-1 rounded-full bg-[#D0D5DD]" />
          <span>{formatRelativeTime(post.createdAt)}</span>
        </div>

        <div
          className="rich-text-content mt-6 text-[15px] leading-[1.75] text-[#344054]"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        <div className="mt-7 grid grid-cols-3 rounded-[8px] bg-[#F7F9FB] px-2 py-3 text-center">
          <div className="flex flex-col items-center gap-1 text-[11px] font-medium text-[#8A94A6]">
            <ThumbsUp className="h-4 w-4" />
            <span>{post.likeCount}</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-[11px] font-medium text-[#8A94A6]">
            <MessageCircle className="h-4 w-4" />
            <span>{comments.length}</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-[11px] font-medium text-[#8A94A6]">
            <Eye className="h-4 w-4" />
            <span>{post.viewCount}</span>
          </div>
        </div>
      </article>

      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={onLike}
          className={`flex min-h-12 items-center justify-center gap-2 rounded-[8px] text-[14px] font-semibold ${
            liked
              ? "bg-[#EEF4FF] text-[#4876EF]"
              : "border border-[#E5E8EB] bg-white text-[#475467]"
          }`}
        >
          <ThumbsUp className="h-4.5 w-4.5" />
          좋아요
        </button>
        <a
          href="#mobile-comments"
          className="flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-[#E5E8EB] bg-white text-[14px] font-semibold text-[#475467]"
        >
          <MessageCircle className="h-4.5 w-4.5" />
          댓글
        </a>
        <button
          type="button"
          onClick={onShare}
          className="flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-[#E5E8EB] bg-white text-[14px] font-semibold text-[#475467]"
        >
          <Share2 className="h-4.5 w-4.5" />
          공유
        </button>
      </div>

      <section id="mobile-comments" className="scroll-mt-28">
        <div className="mb-3 flex items-center justify-between px-1">
          <h2 className="text-[16px] font-semibold text-[#252A32]">
            댓글 {comments.length}
          </h2>
        </div>

        <div className="space-y-2">
          {comments.map((comment) => (
            <MobileCommentItem
              key={comment.commentId}
              comment={comment}
              isAuthor={Boolean(myName && comment.author === myName)}
              onDelete={onRequestDeleteComment}
              onUpdate={onUpdateComment}
            />
          ))}
        </div>

        {comments.length === 0 && (
          <div className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-8 text-center text-[13px] text-[#8A94A6]">
            아직 댓글이 없어요.
          </div>
        )}

        {errorMessage && (
          <p className="mt-3 px-1 text-[12px] font-medium text-[#EF4444]">
            {errorMessage}
          </p>
        )}

        <div className="mt-3 rounded-[8px] border border-[#E5E8EB] bg-white px-3 py-3">
          <textarea
            value={commentText}
            onChange={(event) => onCommentTextChange(event.target.value)}
            placeholder="댓글을 남겨보세요"
            className="min-h-24 w-full resize-none bg-transparent text-[14px] leading-[1.65] text-[#252A32] outline-none placeholder:text-[#A0AEC0]"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onCreateComment}
              disabled={!commentText.trim() || isSubmittingComment}
              className="flex min-h-10 items-center gap-1.5 rounded-[8px] bg-[#4876EF] px-4 text-[13px] font-semibold text-white disabled:bg-[#CBD8FF]"
            >
              <Send className="h-4 w-4" />
              등록
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
