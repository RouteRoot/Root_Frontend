"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Eye,
  MessageCircle,
  MoreVertical,
  Share2,
  ThumbsUp,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "@/app/api/community/comment";
import { checkLiked, toggleLike } from "@/app/api/community/like";
import { deletePost, getPostDetail } from "@/app/api/community/post";
import { getMe } from "@/app/api/service/user";
import type { Comment, Post } from "@/app/api/community/types";
import { sanitizeRichText } from "@/components/community/RichTextEditor";

const AVATAR_COLORS = ["#D7F2FF", "#FFE1EA", "#DDF7EC", "#E7E2FF", "#FFECCA"];

function getSeedValue(seed: string | number) {
  return String(seed)
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function getAvatarColor(seed: string | number) {
  return AVATAR_COLORS[getSeedValue(seed) % AVATAR_COLORS.length];
}

function CuteAvatar({
  seed,
  size = 22,
}: {
  seed: string | number;
  size?: number;
}) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-[#475467]"
      style={{
        width: size,
        height: size,
        backgroundColor: getAvatarColor(seed),
      }}
      aria-hidden="true"
    >
      <span className="inline-flex rotate-90 items-center justify-center leading-none">
        : )
      </span>
    </span>
  );
}

function formatRelativeTime(createdAt: string) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return createdAt;

  const diffMinutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (diffMinutes < 1) return "방금 전";
  if (diffMinutes < 60) return `${diffMinutes}분 전`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function getFirstImageUrl(content: string) {
  const imageTagMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imageTagMatch?.[1]) return imageTagMatch[1];

  const markdownMatch = content.match(/!\[[^\]]*]\(([^)]+)\)/);
  if (markdownMatch?.[1]) return markdownMatch[1];

  const urlMatch = content.match(/https?:\/\/\S+\.(?:png|jpe?g|gif|webp)/i);
  return urlMatch?.[0];
}

function stripImages(content: string) {
  return content
    .replace(/<img[^>]*>/gi, "")
    .replace(/!\[[^\]]*]\([^)]+\)/g, "")
    .trim();
}

function getCategoryLabel(post: Post) {
  if (post.category === "뿌리 PICK") return "뿌리 PICK";
  if (post.boardType === "STUDY") return "스터디 모집";
  return post.category || "자유";
}

function ConfirmModal({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onCancel}>
      <div className="w-[320px] rounded-2xl bg-white px-6 py-6 shadow-[0_8px_32px_rgba(15,23,42,0.15)]" onClick={(e) => e.stopPropagation()}>
        <p className="text-center text-[15px] font-medium leading-[1.6] text-[#323438]">
          {message}
        </p>
        <div className="mt-5 flex gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="flex h-10 flex-1 items-center justify-center rounded-lg border border-[#DDE2EA] text-[14px] font-semibold text-[#7B8798] transition-colors hover:bg-[#F3F6FA]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-10 flex-1 items-center justify-center rounded-lg bg-[#4876EF] text-[14px] font-semibold text-white transition-colors hover:bg-[#3F68D8]"
          >
            삭제
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function ActionMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="absolute right-0 top-6 z-10 w-32 overflow-hidden rounded-xl border border-[#E5E8EB] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.10)]">
      <button
        type="button"
        onClick={onEdit}
        className="flex w-full items-center px-3.5 py-2.5 text-[13px] font-medium text-[#333333] transition-colors hover:bg-[#F3F6FA]"
      >
        수정하기
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="flex w-full items-center px-3.5 py-2.5 text-[13px] font-medium text-[#EF4444] transition-colors hover:bg-[#FEF2F2]"
      >
        삭제하기
      </button>
    </div>
  );
}

function CommentItem({
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
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSave = async () => {
    const next = editText.trim();
    if (!next || isSaving) return;
    setIsSaving(true);
    try {
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
    <article className="py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <CuteAvatar seed={comment.commentId} />
          <div className="flex items-center gap-2 text-[13px] leading-none">
            <span className="font-semibold text-[#323438]">{comment.author}</span>
            <span className="text-[#94A3B8]">{formatRelativeTime(comment.createdAt)}</span>
          </div>
        </div>

        {isAuthor && (
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-[#A0A7B3] transition-colors hover:text-[#667085]"
              aria-label="댓글 더보기"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {menuOpen && (
              <ActionMenu
                onEdit={() => {
                  setIsEditing(true);
                  setMenuOpen(false);
                }}
                onDelete={() => {
                  setMenuOpen(false);
                  onDelete(comment.commentId);
                }}
              />
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="mt-2.5 pl-9">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="min-h-20 w-full resize-none rounded-lg border border-[#4876EF] px-3.5 py-3 text-[15px] leading-[1.6] tracking-[-0.01em] text-[#333333] outline-none placeholder:text-[#B8C0CC]"
            autoFocus
          />
          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditText(comment.content);
              }}
              className="flex h-8 items-center rounded-lg border border-[#DDE2EA] px-3.5 text-[13px] font-semibold text-[#7B8798] transition-colors hover:bg-[#F3F6FA]"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!editText.trim() || isSaving}
              className="flex h-8 items-center rounded-lg bg-[#4876EF] px-3.5 text-[13px] font-semibold text-white transition-colors disabled:bg-[#DDE7FF] hover:enabled:bg-[#3F68D8]"
            >
              저장
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-2.5 pl-9 text-[15px] leading-[1.6] tracking-[-0.01em] text-[#323438]">
          {comment.content}
        </p>
      )}
    </article>
  );
}

export default function Page() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const postId = Number(params.id);
  const postMenuRef = useRef<HTMLDivElement>(null);

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [postMenuOpen, setPostMenuOpen] = useState(false);
  const [myName, setMyName] = useState<string | null>(null);
  const [pendingDeleteCommentId, setPendingDeleteCommentId] = useState<number | null>(null);
  const [showDeletePostConfirm, setShowDeletePostConfirm] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  const imageUrl = useMemo(
    () => (post ? getFirstImageUrl(post.content) : undefined),
    [post]
  );
  const sanitizedContent = useMemo(
    () => (post ? sanitizeRichText(stripImages(post.content)) : ""),
    [post]
  );

  const isPostAuthor = Boolean(myName && post && post.author === myName);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (postMenuRef.current && !postMenuRef.current.contains(e.target as Node)) {
        setPostMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadDetail() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [postData, commentData, likedData, meData] = await Promise.all([
          getPostDetail(postId),
          getComments(postId),
          checkLiked(postId).catch(() => false),
          getMe().catch(() => null),
        ]);

        if (!mounted) return;
        setPost(postData);
        setComments(commentData);
        setLiked(likedData);
        setMyName(meData?.name ?? null);
      } catch {
        if (!mounted) return;
        setErrorMessage("게시글을 불러오지 못했어요.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    if (Number.isFinite(postId)) {
      loadDetail();
    }

    return () => {
      mounted = false;
    };
  }, [postId]);

  const handleLike = async () => {
    if (!post) return;

    const nextLiked = !liked;
    setLiked(nextLiked);
    setPost({
      ...post,
      likeCount: Math.max(0, post.likeCount + (nextLiked ? 1 : -1)),
    });

    try {
      await toggleLike(post.postId);
    } catch {
      setLiked(liked);
      setPost(post);
    }
  };

  const handleDeletePost = async () => {
    if (!post || !isPostAuthor) return;
    try {
      await deletePost(post.postId);
      router.push("/community");
    } catch {
      setErrorMessage("게시글 삭제에 실패했어요.");
    }
  };

  const handleCreateComment = async () => {
    const next = commentText.trim();
    if (!next || isSubmittingComment) return;

    try {
      setIsSubmittingComment(true);
      const created = await createComment({ postId, content: next });
      setComments((prev) => [...prev, created]);
      setCommentText("");
      setPost((prev) =>
        prev ? { ...prev, commentCount: prev.commentCount + 1 } : prev
      );
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    const targetComment = comments.find(
      (comment) => comment.commentId === commentId
    );
    if (!myName || targetComment?.author !== myName) return;

    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.commentId !== commentId));
      setPost((prev) =>
        prev ? { ...prev, commentCount: Math.max(0, prev.commentCount - 1) } : prev
      );
    } catch {
      setErrorMessage("댓글 삭제에 실패했어요.");
    }
  };

  const handleUpdateComment = (commentId: number, content: string) => {
    setComments((prev) =>
      prev.map((c) => (c.commentId === commentId ? { ...c, content } : c))
    );
  };

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-215 pb-24 pt-14">
        <div className="h-5 w-20 animate-pulse rounded bg-[#EEF2F7]" />
        <div className="mt-8 h-7 w-2/3 animate-pulse rounded bg-[#EEF2F7]" />
        <div className="mt-4 h-4 w-full animate-pulse rounded bg-[#F3F6FA]" />
      </main>
    );
  }

  if (!post || errorMessage) {
    return (
      <main className="mx-auto w-full max-w-215 pb-24 pt-14 text-center">
        <p className="text-[15px] text-[#94A3B8]">
          {errorMessage || "게시글이 없어요."}
        </p>
        <Link
          href="/community"
          className="mt-5 inline-flex text-[14px] font-medium text-[#4876EF]"
        >
          커뮤니티로 돌아가기
        </Link>
      </main>
    );
  }

  return (
    <>
    {pendingDeleteCommentId !== null && (
      <ConfirmModal
        message="댓글을 삭제하시겠습니까?"
        onConfirm={async () => {
          setPendingDeleteCommentId(null);
          await handleDeleteComment(pendingDeleteCommentId);
        }}
        onCancel={() => setPendingDeleteCommentId(null)}
      />
    )}
    {showDeletePostConfirm && (
      <ConfirmModal
        message="게시글을 삭제하시겠습니까?"
        onConfirm={async () => {
          setShowDeletePostConfirm(false);
          await handleDeletePost();
        }}
        onCancel={() => setShowDeletePostConfirm(false)}
      />
    )}
    <main className="relative mx-auto w-full max-w-230 pb-24 pt-14">
      <section className="mx-auto w-full max-w-180">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[14px] leading-none">
              <span className="font-semibold text-[#323438]">{post.author}</span>
              <span className="text-[13px] text-[#94A3B8]">
                {formatRelativeTime(post.createdAt)}
              </span>
            </div>

            <span className="mt-7 inline-flex rounded-sm bg-[#F5F7FA] px-2 py-1 text-[12px] font-medium text-[#7B8798]">
              {getCategoryLabel(post)}
            </span>

            <h1 className="mt-4 text-[17px] font-semibold leading-[1.55] tracking-tight text-[#323438]">
              {post.title}
            </h1>
          </div>

          {isPostAuthor && (
            <div ref={postMenuRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setPostMenuOpen((prev) => !prev)}
                className="text-[#A0A7B3] transition-colors hover:text-[#667085]"
                aria-label="게시글 더보기"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              {postMenuOpen && (
                <ActionMenu
                  onEdit={() => {
                    setPostMenuOpen(false);
                    router.push(`/community/edit/${post.postId}`);
                  }}
                  onDelete={() => {
                    setPostMenuOpen(false);
                    setShowDeletePostConfirm(true);
                  }}
                />
              )}
            </div>
          )}
        </div>

        <div
          className="rich-text-content mt-5 text-[16px] leading-[1.65] tracking-[-0.01em] text-[#323438]"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        {imageUrl && (
          <div className="mt-6 w-full overflow-hidden rounded-xl bg-[#F3F6FA]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt=""
              className="w-full object-cover"
            />
          </div>
        )}

        <div className="mt-8 flex items-center gap-5 text-[14px] text-[#8A94A6]">
          <span className="flex items-center gap-1.5">
            <ThumbsUp className="h-4 w-4" />
            {post.likeCount}
          </span>
          <span className="flex items-center gap-1.5">
            <MessageCircle className="h-4 w-4" />
            {post.commentCount}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" />
            {post.viewCount}
          </span>
        </div>

        <div id="comments" className="mt-7 border-t border-[#E5E8EB] pt-7">
          <h2 className="text-[17px] font-semibold text-[#323438]">
            댓글 {comments.length}
          </h2>

          <div className="mt-4 divide-y divide-[#F1F3F6]">
            {comments.map((comment) => (
              <CommentItem
                key={comment.commentId}
                comment={comment}
                isAuthor={Boolean(myName && comment.author === myName)}
                onDelete={setPendingDeleteCommentId}
                onUpdate={handleUpdateComment}
              />
            ))}
          </div>

          {comments.length === 0 && (
            <p className="py-10 text-center text-[14px] text-[#94A3B8]">
              아직 댓글이 없어요.
            </p>
          )}

          {errorMessage && (
            <p className="mt-4 text-[13px] font-medium text-[#EF4444]">{errorMessage}</p>
          )}

          <div className="mt-6">
            <textarea
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="댓글을 남겨보세요"
              className="min-h-32 w-full resize-none rounded-lg border border-[#DDE2EA] px-4 py-4 text-[15px] leading-[1.7] text-[#333333] outline-none placeholder:text-[#B8C0CC] focus:border-[#4876EF]"
            />

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={handleCreateComment}
                disabled={!commentText.trim() || isSubmittingComment}
                className="flex h-10 items-center rounded-lg bg-[#4876EF] px-5 text-[14px] font-semibold text-white transition-colors disabled:bg-[#DDE7FF] hover:enabled:bg-[#3F68D8]"
              >
                작성하기
              </button>
            </div>
          </div>
        </div>
      </section>

      <aside className="mt-8 flex justify-center gap-3 lg:absolute lg:right-0 lg:top-14 lg:mt-0 lg:block lg:space-y-3">
        <button
          type="button"
          onClick={handleLike}
          className={`flex h-18 w-18 flex-col items-center justify-center rounded-xl border text-[14px] transition-colors ${
            liked
              ? "border-[#4876EF] bg-[#EEF4FF] text-[#4876EF]"
              : "border-[#E1E6EE] bg-white text-[#7B8798] hover:border-[#C9D7F5]"
          }`}
        >
          <ThumbsUp className="h-5 w-5" />
          <span className="mt-1">{post.likeCount}</span>
        </button>

        <a
          href="#comments"
          className="flex h-18 w-18 flex-col items-center justify-center rounded-xl border border-[#E1E6EE] bg-white text-[14px] text-[#7B8798] transition-colors hover:border-[#C9D7F5]"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="mt-1">{comments.length}</span>
        </a>

        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard?.writeText(window.location.href);
            setShowCopiedToast(true);
            setTimeout(() => setShowCopiedToast(false), 2500);
          }}
          className="flex h-18 w-18 items-center justify-center rounded-xl border border-[#E1E6EE] bg-white text-[#7B8798] transition-colors hover:border-[#C9D7F5]"
          aria-label="공유하기"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </aside>
    </main>
    {showCopiedToast && createPortal(
      <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#323438] px-5 py-3 text-[14px] font-medium text-white shadow-lg">
        URL 링크가 복사 되었습니다
      </div>,
      document.body
    )}
    </>
  );
}
