"use client";

import { normalizePostImageUrl } from "@/app/api/community/image";
import { getPopularPosts, getPosts } from "@/app/api/community/post";
import type { BoardType, Post } from "@/app/api/community/types";
import { getPostPreviewContent } from "@/components/community/postContentPreview";
import { isWikiPost } from "@/components/certificate/wikiPost";
import AuthenticatedImage from "@/components/community/AuthenticatedImage";
import {
  Eye,
  Flame,
  MessageCircle,
  Plus,
  Search,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type MobileCategory = "전체" | "자유" | "스터디" | "합격후기" | "질문" | "정보";
type MobileFilter = "latest" | "popular";

type MobileCommunityPost = {
  id: number;
  boardType: BoardType;
  category: Exclude<MobileCategory, "전체">;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAgo: string;
  imageUrl?: string;
};

const categories: MobileCategory[] = [
  "전체",
  "자유",
  "스터디",
  "합격후기",
  "질문",
  "정보",
];

const filters: { label: string; value: MobileFilter }[] = [
  { label: "최신", value: "latest" },
  { label: "인기", value: "popular" },
];

function getCreatedAgo(createdAt: string) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "";

  const diffMinutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));

  if (diffMinutes < 1) return "방금";
  if (diffMinutes < 60) return `${diffMinutes}분 전`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function getFirstImageUrl(content: string) {
  const imageTagMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imageTagMatch?.[1]) return normalizePostImageUrl(imageTagMatch[1]);

  const markdownMatch = content.match(/!\[[^\]]*]\(([^)]+)\)/);
  if (markdownMatch?.[1]) return normalizePostImageUrl(markdownMatch[1]);

  const urlMatch = content.match(/https?:\/\/\S+\.(?:png|jpe?g|gif|webp)/i);
  return urlMatch?.[0] ? normalizePostImageUrl(urlMatch[0]) : undefined;
}

function getMobileCategory(post: Post): Exclude<MobileCategory, "전체"> {
  const category = post.category ?? "";

  if (post.boardType === "STUDY" || category.includes("스터디")) return "스터디";
  if (category.includes("후기")) return "합격후기";
  if (category.includes("질문") || category.includes("고민")) return "질문";
  if (category.includes("정보") || category.includes("PICK")) return "정보";

  return "자유";
}

function toMobilePost(post: Post): MobileCommunityPost {
  const postWithImage = post as Post & { imageUrl?: string };

  return {
    id: post.postId,
    boardType: post.boardType,
    category: getMobileCategory(post),
    title: post.title,
    content: getPostPreviewContent(post.content),
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    viewCount: post.viewCount,
    createdAgo: getCreatedAgo(post.createdAt),
    imageUrl: postWithImage.imageUrl
      ? normalizePostImageUrl(postWithImage.imageUrl)
      : getFirstImageUrl(post.content),
  };
}

function CommunitySkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-4"
        >
          <div className="h-4 w-20 animate-pulse rounded bg-[#EEF2F7]" />
          <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-[#F3F6FA]" />
          <div className="mt-3 h-4 w-full animate-pulse rounded bg-[#F3F6FA]" />
          <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-[#F3F6FA]" />
        </div>
      ))}
    </div>
  );
}

function StatRow({ post }: { post: MobileCommunityPost }) {
  return (
    <div className="flex items-center gap-3 text-[11px] font-medium text-[#98A2B3]">
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
  );
}

function PopularStrip({ posts }: { posts: MobileCommunityPost[] }) {
  if (!posts.length) return null;

  return (
    <section>
      <div className="mb-2 flex items-center gap-1.5 px-1">
        <Flame className="h-4 w-4 text-[#F97316]" />
        <h2 className="text-[15px] font-semibold text-[#252A32]">지금 인기글</h2>
      </div>

      <div className="flex snap-x gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {posts.slice(0, 5).map((post) => (
          <Link
            key={post.id}
            href={`/community/${post.id}`}
            className="w-[82%] shrink-0 snap-start rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-4"
          >
            <span className="rounded-full bg-[#FFF7ED] px-2.5 py-1 text-[11px] font-semibold text-[#F97316]">
              인기
            </span>
            <h3 className="mt-3 line-clamp-2 text-[14px] font-semibold leading-[1.45] text-[#252A32]">
              {post.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-[12px] leading-[1.55] text-[#667085]">
              {post.content}
            </p>
            <div className="mt-3">
              <StatRow post={post} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function PostCard({ post }: { post: MobileCommunityPost }) {
  return (
    <Link
      href={`/community/${post.id}`}
      className="block rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-4 active:bg-[#F7F9FB]"
    >
      <div className="flex gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#F7F9FB] px-2.5 py-1 text-[11px] font-medium text-[#667085]">
              {post.category}
            </span>
            <span className="text-[11px] font-medium text-[#A0AEC0]">
              {post.createdAgo}
            </span>
          </div>

          <h3 className="mt-3 line-clamp-2 text-[14px] font-semibold leading-[1.45] text-[#252A32]">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-[13px] leading-[1.55] text-[#667085]">
            {post.content}
          </p>
        </div>

        {post.imageUrl && (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[8px] bg-[#F3F6FA]">
            <AuthenticatedImage
              src={post.imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="mt-3">
        <StatRow post={post} />
      </div>
    </Link>
  );
}

export default function MobileCommunityPage() {
  const [activeCategory, setActiveCategory] = useState<MobileCategory>("전체");
  const [activeFilter, setActiveFilter] = useState<MobileFilter>("latest");
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<MobileCommunityPost[]>([]);
  const [popularPosts, setPopularPosts] = useState<MobileCommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadCommunity() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [postPage, popular] = await Promise.all([
          getPosts({ sort: "latest", page: 0, size: 20 }),
          getPopularPosts(8),
        ]);

        if (!mounted) return;

        setPosts(
          postPage.content
            .filter((post) => !isWikiPost(post))
            .map(toMobilePost)
        );
        setPopularPosts(popular.filter((post) => !isWikiPost(post)).map(toMobilePost));
      } catch {
        if (!mounted) return;
        setPosts([]);
        setPopularPosts([]);
        setErrorMessage("커뮤니티 글을 불러오지 못했어요.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    void loadCommunity();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredPosts = useMemo(() => {
    const keyword = query.trim();
    const source = activeFilter === "popular" ? popularPosts : posts;

    return source.filter((post) => {
      const categoryMatched =
        activeCategory === "전체" || post.category === activeCategory;
      const queryMatched =
        !keyword || post.title.includes(keyword) || post.content.includes(keyword);

      return categoryMatched && queryMatched;
    });
  }, [activeCategory, activeFilter, popularPosts, posts, query]);

  return (
    <div className="mx-auto flex w-full max-w-[430px] flex-col gap-4 pb-7">
      <section className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[12px] font-semibold text-[#4876EF]">커뮤니티</p>
            <h1 className="mt-1 text-[20px] font-semibold tracking-tight text-[#252A32]">
              함께 배우는 이야기
            </h1>
          </div>
          <Link
            href="/community/write"
            className="flex min-h-10 shrink-0 items-center gap-1 rounded-[8px] bg-[#4876EF] px-3 text-[12px] font-medium text-white"
          >
            <Plus className="h-4 w-4" />
            글쓰기
          </Link>
        </div>

        <label className="mt-4 flex h-11 items-center gap-2 rounded-[8px] border border-[#E5E8EB] bg-[#F7F9FB] px-3">
          <Search className="h-4 w-4 shrink-0 text-[#98A2B3]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="제목, 내용 검색"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-[#252A32] outline-none placeholder:text-[#A0AEC0]"
          />
        </label>
      </section>

      <div className="flex snap-x gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((category) => {
          const active = activeCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`min-h-9 shrink-0 snap-start rounded-[8px] px-3 text-[12px] font-medium ${
                active
                  ? "bg-[#252A32] text-white"
                  : "border border-[#E5E8EB] bg-white text-[#667085]"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <PopularStrip posts={popularPosts} />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#252A32]">
            게시글
          </h2>
          <div className="grid grid-cols-2 rounded-[8px] bg-[#F7F9FB] p-1">
            {filters.map((filter) => {
              const active = activeFilter === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  className={`min-h-8 rounded-[6px] px-3 text-[12px] font-medium ${
                    active ? "bg-white text-[#252A32] shadow-sm" : "text-[#8A94A6]"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {isLoading ? (
          <CommunitySkeleton />
        ) : errorMessage ? (
          <div className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-8 text-center text-[13px] text-[#8A94A6]">
            {errorMessage}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="space-y-2">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-8 text-center text-[13px] text-[#8A94A6]">
            조건에 맞는 게시글이 없어요.
          </div>
        )}
      </section>
    </div>
  );
}
