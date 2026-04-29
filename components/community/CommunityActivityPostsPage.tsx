"use client";

import Link from "next/link";
import { Eye, MessageCircle, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { getMyPosts, getPostDetail } from "@/app/api/community/post";
import { getMyLikes } from "@/app/api/community/like";
import type { Post } from "@/app/api/community/types";
import { getPostPreviewContent } from "@/components/community/postContentPreview";

type ActivityMode = "my-posts" | "liked";

function formatDate(createdAt: string) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return createdAt;

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function stripImages(content: string) {
  return getPostPreviewContent(content);
}

function ActivityPostItem({ post }: { post: Post }) {
  return (
    <Link
      href={`/community/${post.postId}`}
      className="block border-b border-[#E5E8EB] py-7"
    >
      <article className="group">
        <span className="inline-flex rounded-[4px] bg-[#F5F7FA] px-2 py-1 text-[12px] font-medium text-[#7B8798]">
          {post.boardType === "STUDY" ? "스터디 모집" : post.category || "자유"}
        </span>

        <h2 className="mt-3 line-clamp-1 text-[17px] font-medium leading-[1.45] tracking-tight text-[#333333] group-hover:text-[#4876EF]">
          {post.title}
        </h2>

        <p className="mt-1 line-clamp-2 whitespace-pre-line text-[15px] leading-[1.6] text-[#575757]">
          {stripImages(post.content)}
        </p>

        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[13px] text-[#8A94A6]">
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3.5 w-3.5" />
              {post.likeCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              {post.commentCount}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {post.viewCount}
            </span>
          </div>

          <span className="shrink-0 text-[13px] text-[#9AA3B2]">
            {formatDate(post.createdAt)}
          </span>
        </div>
      </article>
    </Link>
  );
}

export default function CommunityActivityPostsPage({
  mode,
}: {
  mode: ActivityMode;
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const title = mode === "my-posts" ? "내가 쓴 글" : "좋아요한 글";
  const emptyText =
    mode === "my-posts"
      ? "아직 작성한 글이 없어요."
      : "아직 좋아요한 글이 없어요.";

  useEffect(() => {
    let mounted = true;

    async function loadPosts() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const nextPosts =
          mode === "my-posts"
            ? await getMyPosts()
            : await Promise.all(
                (await getMyLikes()).map((postId) => getPostDetail(postId))
              );

        if (!mounted) return;
        setPosts(nextPosts);
      } catch {
        if (!mounted) return;
        setPosts([]);
        setErrorMessage("게시글을 불러오지 못했어요.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadPosts();

    return () => {
      mounted = false;
    };
  }, [mode]);

  return (
    <main className="mx-auto w-full max-w-[760px] pb-24 pt-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-[31px] font-semibold tracking-[-0.04em] text-[#333333]">
            {title}
          </h1>
          <p className="mt-2 text-[14px] font-medium text-[#94A3B8]">
            {isLoading ? "불러오는 중" : `총 ${posts.length}개`}
          </p>
        </div>

        <Link
          href="/community"
          className="text-[14px] font-medium text-[#667085] transition-colors hover:text-[#4876EF]"
        >
          커뮤니티로 돌아가기
        </Link>
      </div>

      <section className="mt-10">
        {isLoading &&
          [1, 2, 3].map((item) => (
            <div key={item} className="border-b border-[#E5E8EB] py-7">
              <div className="h-6 w-20 animate-pulse rounded bg-[#F3F6FA]" />
              <div className="mt-4 h-5 w-2/3 animate-pulse rounded bg-[#EEF2F7]" />
              <div className="mt-3 h-4 w-full animate-pulse rounded bg-[#F3F6FA]" />
            </div>
          ))}

        {!isLoading && errorMessage && (
          <div className="border-b border-[#E5E8EB] py-20 text-center text-[15px] text-[#94A3B8]">
            {errorMessage}
          </div>
        )}

        {!isLoading &&
          !errorMessage &&
          posts.map((post) => <ActivityPostItem key={post.postId} post={post} />)}

        {!isLoading && !errorMessage && posts.length === 0 && (
          <div className="border-b border-[#E5E8EB] py-20 text-center text-[15px] text-[#94A3B8]">
            {emptyText}
          </div>
        )}
      </section>
    </main>
  );
}
