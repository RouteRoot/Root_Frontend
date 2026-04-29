"use client";

import Link from "next/link";
import { Heart, MessageCircle, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getPopularPosts } from "@/app/api/community/post";
import type { Post } from "@/app/api/community/types";
import { getPostPreviewContent } from "@/components/community/postContentPreview";

type CommunityPost = {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
};

function stripImagesFromContent(content: string) {
  return getPostPreviewContent(content);
}

function toCommunityPost(post: Post): CommunityPost {
  return {
    id: post.postId,
    title: post.title,
    content: stripImagesFromContent(post.content),
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    viewCount: post.viewCount,
  };
}

function PostCard({ post }: { post: CommunityPost }) {
  return (
    <Link href={`/community/${post.id}`} className="group block h-full">
      <article className="flex h-full flex-col rounded-[9px] border border-[#EBEBEB] bg-white px-5 py-5 transition-colors duration-150 hover:border-[#D0D7E3]">
        <div className="flex-1">
          <p className="line-clamp-2 text-[16px] font-semibold leading-[1.55] tracking-tight text-[#575757]">
            {post.title}
          </p>
          <p className="mt-2 line-clamp-3 whitespace-pre-line text-[16px] leading-[1.65] text-[#777777]">
            {post.content}
          </p>
        </div>

        <div className="mt-5 flex items-center text-[12px] text-[#999999]">
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            {post.likeCount}
          </span>
          <span className="mx-2 text-[#DDDDDD]">|</span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5" />
            {post.commentCount}
          </span>
          <span className="ml-auto">
            조회 {post.viewCount.toLocaleString()}
          </span>
        </div>
      </article>
    </Link>
  );
}

function PostCardSkeleton() {
  return (
    <div className="h-full rounded-[9px] border border-[#EBEBEB] bg-white px-5 py-5">
      <div className="h-5 w-4/5 animate-pulse rounded bg-[#EEF2F7]" />
      <div className="mt-3 h-4 w-full animate-pulse rounded bg-[#F3F6FA]" />
      <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-[#F3F6FA]" />
      <div className="mt-8 h-4 w-32 animate-pulse rounded bg-[#EEF2F7]" />
    </div>
  );
}

export default function DashboardCommunitySection() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadPopularPosts() {
      try {
        setIsLoading(true);
        const data = await getPopularPosts(4);
        if (!mounted) return;
        setPosts(data.map(toCommunityPost));
      } catch {
        if (mounted) setPosts([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadPopularPosts();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="mt-8">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-[22px] font-semibold font-black tracking-tight text-[#333333]">
          커뮤니티 인기글
        </p>
        <Link
          href="/community"
          className="flex items-center gap-0.5 text-[14px] font-normal text-[#94A3B8] transition-colors hover:text-[#4876EF]"
        >
          더보기
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {isLoading
          ? [1, 2, 3, 4].map((item) => <PostCardSkeleton key={item} />)
          : posts.map((post) => <PostCard key={post.id} post={post} />)}
      </div>

      {!isLoading && posts.length === 0 && (
        <div className="rounded-[9px] border border-[#EBEBEB] bg-white px-5 py-8 text-center text-[14px] text-[#94A3B8]">
          아직 인기글이 없어요.
        </div>
      )}
    </section>
  );
}
