"use client";

import Link from "next/link";
import Image from "next/image";
import { Eye, MessageCircle, Plus, Search, ThumbsUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getPopularPosts, getPosts } from "@/app/api/community/post";
import type { BoardType, Post } from "@/app/api/community/types";

type CategoryTab =
  | "전체"
  | "자유"
  | "스터디 모집"
  | "자격증 후기"
  | "질문/고민"
  | "정보공유";
type PostFilter = "모두보기" | "뿌리 PICK" | "일반 게시글";

type CommunityPost = {
  id: number;
  boardType: BoardType;
  category: Exclude<CategoryTab, "전체">;
  isAdminPick: boolean;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAgo: string;
  imageUrl?: string;
};

const CATEGORY_TABS: CategoryTab[] = [
  "전체",
  "자유",
  "스터디 모집",
  "자격증 후기",
  "질문/고민",
  "정보공유",
];

const POST_FILTERS: PostFilter[] = ["모두보기", "뿌리 PICK", "일반 게시글"];

function isCategoryTab(category: string): category is Exclude<CategoryTab, "전체"> {
  return CATEGORY_TABS.includes(category as CategoryTab) && category !== "전체";
}

function getCreatedAgo(createdAt: string) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMinutes < 1) return "방금 전";
  if (diffMinutes < 60) return `${diffMinutes}분 전`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}일 전`;

  return createdAt.slice(0, 10).replace(/-/g, ".");
}

function getFirstImageUrl(content: string) {
  const imageTagMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imageTagMatch?.[1]) return imageTagMatch[1];

  const markdownMatch = content.match(/!\[[^\]]*]\(([^)]+)\)/);
  if (markdownMatch?.[1]) return markdownMatch[1];

  const urlMatch = content.match(/https?:\/\/\S+\.(?:png|jpe?g|gif|webp)/i);
  return urlMatch?.[0];
}

function stripImagesFromContent(content: string) {
  return content
    .replace(/<img[^>]*>/gi, "")
    .replace(/!\[[^\]]*]\([^)]+\)/g, "")
    .trim();
}

function toCommunityPost(post: Post): CommunityPost {
  const postWithImage = post as Post & { imageUrl?: string };
  const category =
    post.boardType === "STUDY"
      ? "스터디 모집"
      : isCategoryTab(post.category)
        ? post.category
        : "자유";
  const imageUrl = postWithImage.imageUrl ?? getFirstImageUrl(post.content);

  return {
    id: post.postId,
    boardType: post.boardType,
    category,
    isAdminPick: false,
    title: post.title,
    content: stripImagesFromContent(post.content),
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    viewCount: post.viewCount,
    createdAgo: getCreatedAgo(post.createdAt),
    imageUrl,
  };
}

function StatRow({
  likeCount,
  commentCount,
  viewCount,
}: {
  likeCount: number;
  commentCount: number;
  viewCount: number;
}) {
  return (
    <div className="flex items-center gap-4 text-[13px] text-[#8A94A6]">
      <span className="flex items-center gap-1">
        <ThumbsUp className="h-3.5 w-3.5" />
        {likeCount}
      </span>
      <span className="flex items-center gap-1">
        <MessageCircle className="h-3.5 w-3.5" />
        {commentCount}
      </span>
      <span className="flex items-center gap-1">
        <Eye className="h-3.5 w-3.5" />
        {viewCount}
      </span>
    </div>
  );
}

function PostListItem({ post }: { post: CommunityPost }) {
  return (
    <Link href={`/community/${post.id}`} className="block border-b border-[#E5E8EB] py-7">
      <article className="group flex gap-5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex rounded-[4px] bg-[#F5F7FA] px-2 py-1 text-[12px] font-medium text-[#7B8798]">
              {post.category}
            </span>
            {post.isAdminPick && (
              <span className="inline-flex rounded-[4px] bg-[#EEF4FF] px-2 py-1 text-[12px] font-medium text-[#4876EF]">
                뿌리 PICK
              </span>
            )}
          </div>
          <h2 className="mt-3 line-clamp-1 text-[17px] font-medium leading-[1.45] tracking-tight text-[#333333] group-hover:text-[#4876EF]">
            {post.title}
          </h2>
          <p className="mt-1 line-clamp-2 text-[15px] leading-[1.6] text-[#575757]">
            {post.content}
          </p>
          <div className="mt-5 flex items-center justify-between gap-4">
            <StatRow
              likeCount={post.likeCount}
              commentCount={post.commentCount}
              viewCount={post.viewCount}
            />
            <span className="shrink-0 text-[13px] text-[#9AA3B2]">
              {post.createdAgo}
            </span>
          </div>
        </div>

        {post.imageUrl && (
          <div className="relative mt-1 h-[106px] w-[106px] shrink-0 overflow-hidden rounded-[8px] bg-[#F3F6FA]">
            <Image
              src={post.imageUrl}
              alt=""
              fill
              sizes="106px"
              className="object-cover"
            />
          </div>
        )}
      </article>
    </Link>
  );
}

function PopularCard({
  post,
}: {
  post: CommunityPost;
}) {
  return (
    <Link
      href={`/community/${post.id}`}
      className="block rounded-[8px] bg-[#F8F9FA] px-5 py-5 transition-colors hover:bg-[#F3F6FA]"
    >
      <span className="text-[12px] font-semibold text-[#4876EF]">인기</span>
      <p className="mt-3 line-clamp-2 min-h-12 text-[15px] font-normal leading-[1.55] text-[#333333]">
        {post.title}
      </p>
      <div className="mt-5 flex items-center justify-between gap-4">
        <StatRow
          likeCount={post.likeCount}
          commentCount={post.commentCount}
          viewCount={post.viewCount}
        />
      </div>
    </Link>
  );
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<CategoryTab>("전체");
  const [activePostFilter, setActivePostFilter] =
    useState<PostFilter>("모두보기");
  const [query, setQuery] = useState("");
  const [allPosts, setAllPosts] = useState<CommunityPost[]>([]);
  const [popularPosts, setPopularPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadPosts() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [postPage, popular] = await Promise.all([
          getPosts({ sort: "latest", page: 0, size: 20 }),
          getPopularPosts(6),
        ]);

        if (!mounted) return;

        setAllPosts(postPage.content.map(toCommunityPost));
        setPopularPosts(popular.map(toCommunityPost));
      } catch {
        if (!mounted) return;
        setAllPosts([]);
        setPopularPosts([]);
        setErrorMessage("커뮤니티 게시글을 불러오지 못했어요.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadPosts();

    return () => {
      mounted = false;
    };
  }, []);

  const posts = useMemo(() => {
    return allPosts.filter((post) => {
      const tabMatched = activeTab === "전체" || post.category === activeTab;
      const filterMatched =
        activePostFilter === "모두보기" ||
        (activePostFilter === "뿌리 PICK"
          ? post.isAdminPick
          : !post.isAdminPick);
      const queryMatched =
        query.trim().length === 0 ||
        post.title.includes(query.trim()) ||
        post.content.includes(query.trim());

      return tabMatched && filterMatched && queryMatched;
    });
  }, [activeTab, activePostFilter, allPosts, query]);

  return (
    <main className="mx-auto w-full max-w-[1060px] pb-24 pt-8">
      <h1 className="text-[31px] font-semibold tracking-[-0.04em] text-[#333333]">
        커뮤니티
      </h1>

      <nav className="mt-14 border-b border-[#E5E8EB]">
        <div className="flex items-center gap-6">
          {CATEGORY_TABS.map((tab) => {
            const active = activeTab === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab);
                }}
                className={`relative pb-5 text-[15px] transition-colors ${
                  active
                    ? "font-semibold text-[#333333]"
                    : "font-medium text-[#B3BBC8] hover:text-[#667085]"
                }`}
              >
                {tab}
                {active && (
                  <span className="absolute bottom-[-1px] left-0 h-[2px] w-full bg-[#333333]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {POST_FILTERS.map((filter) => {
            const active = activePostFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActivePostFilter(filter)}
                className={`h-10 rounded-full border px-4 text-[14px] transition-colors ${
                  active
                    ? "border-[#4876EF] bg-white font-semibold text-[#4876EF]"
                    : "border-[#E1E6EE] bg-white font-medium text-[#475569] hover:border-[#C9D7F5]"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div className="flex w-full gap-3 lg:w-auto">
          <label className="flex h-12 w-full items-center rounded-[8px] border border-[#E1E6EE] bg-white px-4 lg:w-60">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="커뮤니티 검색"
              className="min-w-0 flex-1 bg-transparent text-[15px] text-[#333333] outline-none placeholder:text-[#B3BBC8]"
            />
            <Search className="h-4.5 w-4.5 text-[#B3BBC8]" />
          </label>

          <Link
            href="/community/write"
            className="flex h-12 min-w-70 items-center justify-center gap-2 rounded-[8px] bg-[#4876EF] px-8 text-[15px] font-bold text-white transition-colors hover:bg-[#3F68D8]"
          >
            <Plus className="h-4 w-4" />
            글쓰기
          </Link>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <section className="min-w-0">
          {isLoading ? (
            <div className="space-y-0">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="border-b border-[#E5E8EB] py-7">
                  <div className="h-6 w-20 animate-pulse rounded bg-[#F3F6FA]" />
                  <div className="mt-4 h-5 w-2/3 animate-pulse rounded bg-[#EEF2F7]" />
                  <div className="mt-3 h-4 w-full animate-pulse rounded bg-[#F3F6FA]" />
                  <div className="mt-6 h-4 w-44 animate-pulse rounded bg-[#F3F6FA]" />
                </div>
              ))}
            </div>
          ) : (
            posts.map((post) => <PostListItem key={post.id} post={post} />)
          )}

          {!isLoading && errorMessage && (
            <div className="border-b border-[#E5E8EB] py-20 text-center text-[15px] text-[#94A3B8]">
              {errorMessage}
            </div>
          )}

          {!isLoading && !errorMessage && posts.length === 0 && (
            <div className="border-b border-[#E5E8EB] py-20 text-center text-[15px] text-[#94A3B8]">
              검색 결과가 없어요.
            </div>
          )}
        </section>

        <aside className="space-y-3 lg:pt-5">
          {isLoading
            ? [1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="rounded-[8px] bg-[#F8F9FA] px-5 py-5"
                >
                  <div className="h-4 w-8 animate-pulse rounded bg-[#E9EEF5]" />
                  <div className="mt-4 h-4 w-full animate-pulse rounded bg-[#EEF2F7]" />
                  <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-[#EEF2F7]" />
                </div>
              ))
            : popularPosts.map((post) => (
                <PopularCard key={post.id} post={post} />
              ))}
        </aside>
      </div>
    </main>
  );
}
