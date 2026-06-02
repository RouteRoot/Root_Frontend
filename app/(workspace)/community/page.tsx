"use client";

import Link from "next/link";
import { Eye, MessageCircle, Plus, Search, ThumbsUp } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { normalizePostImageUrl } from "@/app/api/community/image";
import { getMyPosts, getPopularPosts, getPosts } from "@/app/api/community/post";
import { getMyLikes } from "@/app/api/community/like";
import type { BoardType, Post } from "@/app/api/community/types";
import AuthenticatedImage from "@/components/community/AuthenticatedImage";
import { getPostPreviewContent } from "@/components/community/postContentPreview";
import { isWikiPost } from "@/components/certificate/wikiPost";
import MobileCommunityPage from "@/mobile/pages/community/MobileCommunityPage";

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
const POSTS_PAGE_SIZE = 7;

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

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
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

function stripImagesFromContent(content: string) {
  return getPostPreviewContent(content);
}

function toCommunityPost(post: Post): CommunityPost {
  const postWithImage = post as Post & { imageUrl?: string };
  const isAdminPick = post.category === "뿌리 PICK";
  const category =
    isAdminPick
      ? "정보공유"
      : post.boardType === "STUDY"
      ? "스터디 모집"
      : isCategoryTab(post.category)
        ? post.category
        : "자유";
  const imageUrl = postWithImage.imageUrl
    ? normalizePostImageUrl(postWithImage.imageUrl)
    : getFirstImageUrl(post.content);

  return {
    id: post.postId,
    boardType: post.boardType,
    category,
    isAdminPick,
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

function PostListItem({
  post,
  isPopular,
}: {
  post: CommunityPost;
  isPopular: boolean;
}) {
  return (
    <Link href={`/community/${post.id}`} className="block border-b border-[#E5E8EB] pb-4 pt-7">
      <article className="group flex flex-col gap-3">
        <div className="flex gap-5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex rounded-[4px] bg-[#F5F7FA] px-2 py-1 text-[12px] font-medium text-[#7B8798]">
                {post.category}
              </span>
              {post.isAdminPick && (
                <span className="inline-flex items-center rounded-[4px] bg-[#EEF4FF] px-2 py-1 text-[11px] font-semibold leading-none text-[#4876EF]">
                  <span className="relative -top-px">@</span>뿌리 PICK
                </span>
              )}
              {isPopular && (
                <span className="inline-flex rounded-[4px] bg-[#ECFDF3] px-2 py-1 text-[11px] font-medium leading-none text-[#039855]">
                  인기
                </span>
              )}
            </div>
            <h2 className="mt-3 line-clamp-1 text-[17px] font-medium leading-[1.45] tracking-tight text-[#333333] group-hover:text-[#4876EF]">
              {post.title}
            </h2>
            <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-[15px] leading-[1.6] text-[#575757]">
              {post.content}
            </p>
          </div>

          {post.imageUrl && (
            <div className="relative mt-1 h-[106px] w-[106px] shrink-0 overflow-hidden rounded-[8px] bg-[#F3F6FA]">
              <AuthenticatedImage
                src={post.imageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <StatRow
            likeCount={post.likeCount}
            commentCount={post.commentCount}
            viewCount={post.viewCount}
          />
          <span className="shrink-0 text-[13px] text-[#9AA3B2]">
            {post.createdAgo}
          </span>
        </div>
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
      <span className="inline-flex rounded-[4px] bg-[#ECFDF3] px-2 py-1 text-[11px] font-medium leading-none text-[#039855]">
        인기
      </span>
      <p className="mt-3 line-clamp-2 text-[15px] font-medium leading-[1.55] text-[#333333]">
        {post.title}
      </p>
      <p className="mt-1 line-clamp-2 whitespace-pre-line text-[13px] leading-[1.55] text-[#667085]">
        {post.content}
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

function MyActivityCard({
  myPostCount,
  likedPostCount,
  isLoading,
}: {
  myPostCount: number;
  likedPostCount: number;
  isLoading: boolean;
}) {
  return (
    <section className="px-1 py-1">
      <div className="flex items-center justify-center text-[14px] leading-none">
        <Link
          href="/community/my-posts"
          className="font-medium text-[#575757]"
        >
          내가 쓴 글{" "}
          <span className="font-semibold text-[#4876EF]">
            {isLoading ? "-" : `${myPostCount}개`}
          </span>
        </Link>

        <span className="mx-3 h-3 w-px bg-[#DDE2EA]" />

        <Link
          href="/community/liked"
          className="font-medium text-[#575757]"
        >
          좋아요한 글{" "}
          <span className="font-semibold text-[#4876EF]">
            {isLoading ? "-" : `${likedPostCount}개`}
          </span>
        </Link>
      </div>
    </section>
  );
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<CategoryTab>("전체");
  const [activePostFilter, setActivePostFilter] =
    useState<PostFilter>("모두보기");
  const [query, setQuery] = useState("");
  const [allPosts, setAllPosts] = useState<CommunityPost[]>([]);
  const [popularPosts, setPopularPosts] = useState<CommunityPost[]>([]);
  const [myPostCount, setMyPostCount] = useState(0);
  const [likedPostCount, setLikedPostCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMorePosts, setHasMorePosts] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadPosts() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [postPage, popular, myPosts, myLikes] = await Promise.all([
          getPosts({ sort: "latest", page: 0, size: POSTS_PAGE_SIZE }),
          getPopularPosts(6),
          getMyPosts().catch(() => []),
          getMyLikes().catch(() => []),
        ]);

        if (!mounted) return;

        setAllPosts(
          postPage.content.filter((post) => !isWikiPost(post)).map(toCommunityPost)
        );
        setPage(0);
        setHasMorePosts(!postPage.last);
        setPopularPosts(popular.map(toCommunityPost));
        setMyPostCount(myPosts.length);
        setLikedPostCount(myLikes.length);
      } catch {
        if (!mounted) return;
        setAllPosts([]);
        setPage(0);
        setHasMorePosts(false);
        setPopularPosts([]);
        setMyPostCount(0);
        setLikedPostCount(0);
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

  const loadMorePosts = useCallback(async () => {
    if (isLoading || isLoadingMore || !hasMorePosts) return;

    try {
      setIsLoadingMore(true);

      const nextPage = page + 1;
      const postPage = await getPosts({
        sort: "latest",
        page: nextPage,
        size: POSTS_PAGE_SIZE,
      });

      setAllPosts((prev) => {
        const seen = new Set(prev.map((post) => post.id));
        const nextPosts = postPage.content
          .filter((post) => !isWikiPost(post))
          .map(toCommunityPost)
          .filter((post) => !seen.has(post.id));

        return [...prev, ...nextPosts];
      });
      setPage(nextPage);
      setHasMorePosts(!postPage.last);
    } catch {
      setHasMorePosts(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMorePosts, isLoading, isLoadingMore, page]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || isLoading || isLoadingMore || !hasMorePosts || errorMessage) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void loadMorePosts();
        }
      },
      { rootMargin: "240px 0px" }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [errorMessage, hasMorePosts, isLoading, isLoadingMore, loadMorePosts]);

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

  const popularPostIds = useMemo(
    () => new Set(popularPosts.map((post) => post.id)),
    [popularPosts]
  );

  return (
    <>
      <div className="lg:hidden">
        <MobileCommunityPage />
      </div>

      <main className="hidden mx-auto w-full max-w-[1060px] pb-24 pt-8 lg:block">
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
            posts.map((post) => (
              <PostListItem
                key={post.id}
                post={post}
                isPopular={popularPostIds.has(post.id)}
              />
            ))
          )}

          {!isLoading && hasMorePosts && (
            <div ref={loadMoreRef} className="py-6">
              {isLoadingMore && (
                <div className="space-y-3">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-[#EEF2F7]" />
                  <div className="h-4 w-full animate-pulse rounded bg-[#F3F6FA]" />
                  <div className="h-4 w-44 animate-pulse rounded bg-[#F3F6FA]" />
                </div>
              )}
            </div>
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

        <aside className="space-y-3">
          <div className="-mt-6 mb-5">
            <MyActivityCard
              myPostCount={myPostCount}
              likedPostCount={likedPostCount}
              isLoading={isLoading}
            />
          </div>

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
    </>
  );
}
