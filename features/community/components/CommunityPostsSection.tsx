"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type CommunityCategory =
  | "All"
  | "Free"
  | "Study"
  | "Certificate"
  | "Question"
  | "Info";

type SortType = "Latest" | "Popular";

type CommunityPost = {
  id: number;
  category: Exclude<CommunityCategory, "All">;
  title: string;
  content: string;
  author: string;
  profileImage: string;
  badge?: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
};

const CATEGORY_TABS: CommunityCategory[] = [
  "All",
  "Free",
  "Study",
  "Certificate",
  "Question",
  "Info",
];

const SORT_OPTIONS: SortType[] = ["Latest", "Popular"];

const MOCK_POSTS: CommunityPost[] = [
  {
    id: 1,
    category: "Question",
    title: "SQLD or computer literacy first?",
    content: "Question content.",
    author: "Root",
    profileImage: "/bubu11.png",
    badge: "Certificate",
    createdAt: "2026-07-08",
    likeCount: 4,
    commentCount: 7,
    viewCount: 128,
  },
  {
    id: 2,
    category: "Study",
    title: "SQLD study group",
    content: "Study group content.",
    author: "Data",
    profileImage: "/bubu11.png",
    badge: "Study",
    createdAt: "2026-07-08",
    likeCount: 9,
    commentCount: 12,
    viewCount: 244,
  },
  {
    id: 3,
    category: "Certificate",
    title: "Information processing written exam",
    content: "Review content.",
    author: "Passer",
    profileImage: "/bubu11.png",
    badge: "Review",
    createdAt: "2026-07-07",
    likeCount: 21,
    commentCount: 15,
    viewCount: 603,
  },
  {
    id: 4,
    category: "Free",
    title: "Study routine",
    content: "Free talk content.",
    author: "Mint",
    profileImage: "/bubu11.png",
    createdAt: "2026-07-07",
    likeCount: 6,
    commentCount: 11,
    viewCount: 187,
  },
  {
    id: 5,
    category: "Info",
    title: "Recruit schedule",
    content: "Information content.",
    author: "Calendar",
    profileImage: "/bubu11.png",
    badge: "Schedule",
    createdAt: "2026-07-06",
    likeCount: 18,
    commentCount: 5,
    viewCount: 421,
  },
];

function getPopularScore(post: CommunityPost) {
  return post.likeCount * 3 + post.commentCount * 5 + post.viewCount;
}

export default function CommunityPostsSection() {
  const [selectedCategory, setSelectedCategory] =
    useState<CommunityCategory>("All");
  const [selectedSort, setSelectedSort] = useState<SortType>("Latest");
  const [visibleCount, setVisibleCount] = useState(6);
  const [sortOpen, setSortOpen] = useState(false);

  const dropdownRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredPosts = useMemo(() => {
    const categoryFiltered =
      selectedCategory === "All"
        ? MOCK_POSTS
        : MOCK_POSTS.filter((post) => post.category === selectedCategory);

    const sorted = [...categoryFiltered].sort((a, b) => {
      if (selectedSort === "Popular") {
        return getPopularScore(b) - getPopularScore(a);
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return sorted;
  }, [selectedCategory, selectedSort]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  return (
    <>
      {CATEGORY_TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => {
            setSelectedCategory(tab);
            setVisibleCount(6);
          }}
        >
          {tab}
          {selectedCategory === tab ? " *" : ""}
        </button>
      ))}
      <span ref={dropdownRef}>
        <button type="button" onClick={() => setSortOpen((prev) => !prev)}>
          {selectedSort}
        </button>
        {sortOpen &&
          SORT_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setSelectedSort(option);
                setSortOpen(false);
                setVisibleCount(6);
              }}
            >
              {option}
            </button>
          ))}
      </span>
      {visiblePosts.map((post) => (
        <Link key={post.id} href={`/community/${post.id}`}>
          {post.title}
        </Link>
      ))}
      {filteredPosts.length === 0 && <p>No posts</p>}
      {hasMore && (
        <button type="button" onClick={() => setVisibleCount((prev) => prev + 6)}>
          More
        </button>
      )}
      <pre>
        {JSON.stringify(
          {
            selectedCategory,
            selectedSort,
            visibleCount,
            sortOpen,
            filteredPosts,
            visiblePosts,
            hasMore,
          },
          null,
          2
        )}
      </pre>
    </>
  );
}
