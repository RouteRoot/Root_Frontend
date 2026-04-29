"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getPopularPosts, getPosts } from "@/app/api/community/post";
import type { Post } from "@/app/api/community/types";

type TabType = "pick" | "popular";

type RecommendPost = {
  id: number;
  type: TabType;
  title: string;
  content: string;
  commentCount: number;
  viewCount: number;
};

const CARD_WIDTH = 276;
const CARD_HEIGHT = 189;
const CARD_GAP = 12;
const PEEK = 46;
const MAX_VISIBLE_COUNT = 5;
const DRAG_THRESHOLD = 8;

function stripImages(content: string) {
  return content
    .replace(/<img[^>]*>/gi, "")
    .replace(/!\[[^\]]*]\([^)]+\)/g, "")
    .trim();
}

function toRecommendPost(post: Post, type: TabType): RecommendPost {
  return {
    id: post.postId,
    type,
    title: post.title,
    content: stripImages(post.content),
    commentCount: post.commentCount,
    viewCount: post.viewCount,
  };
}

function formatNumber(value: number) {
  return value.toLocaleString("ko-KR");
}

function RecommendCard({
  post,
  activeTab,
  wasDraggedRef,
}: {
  post: RecommendPost;
  activeTab: TabType;
  wasDraggedRef: React.MutableRefObject<boolean>;
}) {
  const isPick = activeTab === "pick";

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (wasDraggedRef.current) {
      e.preventDefault();
      wasDraggedRef.current = false;
    }
  };

  return (
    <Link
      href={`/community/${post.id}`}
      draggable={false}
      onClick={handleClick}
      className="
        flex h-[189px] w-[276px] flex-col
        rounded-[22px] border border-[#dee5f5] bg-white
        px-[24px] pt-[22px] pb-[22px]
        transition-transform duration-300 ease-out
      "
    >
      <span
        className={`inline-flex h-[28px] w-fit items-center rounded-full px-[10px] text-[11px] leading-none text-white ${
          isPick ? "bg-[#00D3AB]" : "bg-[#12B76A]"
        } ${isPick ? "font-bold" : "font-medium"}`}
      >
        {isPick ? "PICK" : "인기글"}
      </span>

      <h3 className="mt-[18px] overflow-hidden whitespace-nowrap text-ellipsis text-[16px] font-bold leading-[1.35] tracking-[-0.02em] text-[#2A2F45]">
        {post.title}
      </h3>

      <p className="mt-[12px] min-h-[42px] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] text-[14px] leading-[1.5] tracking-[-0.02em] text-[#5A6178]">
        {post.content}
      </p>

      <div className="mt-auto pt-[18px] text-[14px] leading-none text-[#8B93A8]">
        <span>댓글 </span>
        <span className="font-semibold text-[#707991]">
          {formatNumber(post.commentCount)}
        </span>
        <span className="mx-[8px] text-[#CDD3DE]">|</span>
        <span>조회 </span>
        <span className="font-semibold text-[#707991]">
          {formatNumber(post.viewCount)}
        </span>
      </div>
    </Link>
  );
}

export default function RecommendedPostsSection() {
  const [activeTab, setActiveTab] = useState<TabType>("pick");
  const [showLeftPeek, setShowLeftPeek] = useState(false);
  const [showRightPeek, setShowRightPeek] = useState(true);
  const [pickPosts, setPickPosts] = useState<RecommendPost[]>([]);
  const [popularPosts, setPopularPosts] = useState<RecommendPost[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const isDraggingRef = useRef(false);
  const wasDraggedRef = useRef(false);

  useEffect(() => {
    async function loadPosts() {
      const [allPosts, popular] = await Promise.all([
        getPosts({ sort: "latest", size: 50 }).catch(() => ({ content: [] as Post[] })),
        getPopularPosts(MAX_VISIBLE_COUNT).catch(() => [] as Post[]),
      ]);

      const picks = allPosts.content
        .filter((p) => p.category === "뿌리 PICK")
        .slice(0, MAX_VISIBLE_COUNT)
        .map((p) => toRecommendPost(p, "pick"));

      setPickPosts(picks);
      setPopularPosts(popular.map((p) => toRecommendPost(p, "popular")));
    }

    loadPosts();
  }, []);

  const posts = activeTab === "pick" ? pickPosts : popularPosts;

  const updatePeekState = () => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, clientWidth, scrollWidth } = container;
    const maxScrollLeft = scrollWidth - clientWidth;
    const threshold = 8;

    setShowLeftPeek(scrollLeft > threshold);
    setShowRightPeek(scrollLeft < maxScrollLeft - threshold);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    updatePeekState();

    const handleScroll = () => updatePeekState();
    container.addEventListener("scroll", handleScroll, { passive: true });

    const handleResize = () => updatePeekState();
    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [activeTab, posts.length]);

  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      const container = scrollRef.current;
      if (!container || !isMouseDownRef.current) return;

      const diff = e.clientX - startXRef.current;

      if (!isDraggingRef.current && Math.abs(diff) >= DRAG_THRESHOLD) {
        isDraggingRef.current = true;
        wasDraggedRef.current = true;
      }

      if (isDraggingRef.current) {
        container.scrollLeft = startScrollLeftRef.current - diff;
      }
    };

    const handleWindowMouseUp = () => {
      isMouseDownRef.current = false;

      if (isDraggingRef.current) {
        requestAnimationFrame(() => {
          isDraggingRef.current = false;
        });
      }
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("mouseup", handleWindowMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container) return;

    isMouseDownRef.current = true;
    isDraggingRef.current = false;
    wasDraggedRef.current = false;
    startXRef.current = e.clientX;
    startScrollLeftRef.current = container.scrollLeft;
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    });
  };

  return (
    <section className="w-full">
      <div className="flex items-center justify-between">
        <h2 className="pl-2 text-[22px] font-bold leading-[1.4] tracking-[-0.03em] text-[#1F2D4A]">
          이런 글은 어때요?
        </h2>

        <div className="flex items-center rounded-full bg-[#F5F7FB] p-[4px]">
          <button
            type="button"
            onClick={() => handleTabChange("pick")}
            className={`rounded-full px-[18px] py-[4px] text-[12px] font-bold leading-[24px] transition-all duration-300 ${
              activeTab === "pick"
                ? "bg-[#4B5675] text-white"
                : "bg-transparent text-[#4B5675]"
            }`}
          >
            PICK
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("popular")}
            className={`rounded-full px-[18px] py-[4px] text-[12px] font-bold leading-[24px] transition-all duration-300 ${
              activeTab === "popular"
                ? "bg-[#4B5675] text-white"
                : "bg-transparent text-[#4B5675]"
            }`}
          >
            인기글
          </button>
        </div>
      </div>

      <div className="relative mt-[22px]">
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          className="scrollbar-hide ml-[1px] overflow-x-auto overflow-y-hidden pl-1 cursor-grab active:cursor-grabbing"
          style={{
            WebkitOverflowScrolling: "touch",
            userSelect: "none",
            overscrollBehaviorX: "contain",
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            paddingLeft: `${PEEK}px`,
            paddingRight: `${PEEK}px`,
          }}
        >
          <div
            className="ml-[4px] flex w-max"
            style={{
              gap: `${CARD_GAP}px`,
            }}
          >
            {posts.map((post) => (
              <div
                key={post.id}
                className="shrink-0 transition-transform duration-300 ease-out"
                style={{
                  width: `${CARD_WIDTH + 1}px`,
                  height: `${CARD_HEIGHT + 3}px`,
                  scrollSnapAlign: "start",
                }}
              >
                <RecommendCard
                  post={post}
                  activeTab={activeTab}
                  wasDraggedRef={wasDraggedRef}
                />
              </div>
            ))}
          </div>
        </div>

        <div
          className={`pointer-events-none absolute left-0 top-0 h-full w-[64px] transition-opacity duration-300 ${
            showLeftPeek ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`pointer-events-none absolute right-0 top-0 h-full w-[64px] transition-opacity duration-300 ${
            showRightPeek ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </section>
  );
}
