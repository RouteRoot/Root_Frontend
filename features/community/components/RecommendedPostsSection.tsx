"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type TabType = "pick" | "popular";

type RecommendPost = {
  id: number;
  type: TabType;
  title: string;
  content: string;
  commentCount: number;
  viewCount: number | string;
};

const MAX_VISIBLE_COUNT = 5;

const mockPosts: RecommendPost[] = [
  {
    id: 1,
    type: "pick",
    title: "SQLD or computer literacy",
    content: "Recommended post content.",
    commentCount: 18,
    viewCount: 782,
  },
  {
    id: 2,
    type: "pick",
    title: "SQLD study group",
    content: "Recommended post content.",
    commentCount: 12,
    viewCount: 431,
  },
  {
    id: 3,
    type: "popular",
    title: "Study anxiety",
    content: "Popular post content.",
    commentCount: 43,
    viewCount: "9,999+",
  },
  {
    id: 4,
    type: "popular",
    title: "Backend preparation",
    content: "Popular post content.",
    commentCount: 37,
    viewCount: 2841,
  },
];

function getPopularScore(post: RecommendPost) {
  const numericViewCount =
    typeof post.viewCount === "number" ? post.viewCount : 10000;
  return numericViewCount + post.commentCount * 3;
}

export default function RecommendedPostsSection() {
  const [activeTab, setActiveTab] = useState<TabType>("pick");

  const posts = useMemo(() => {
    const filtered = mockPosts.filter((post) => post.type === activeTab);

    if (activeTab === "popular") {
      return [...filtered]
        .sort((a, b) => getPopularScore(b) - getPopularScore(a))
        .slice(0, MAX_VISIBLE_COUNT);
    }

    return filtered.slice(0, MAX_VISIBLE_COUNT);
  }, [activeTab]);

  return (
    <>
      <button type="button" onClick={() => setActiveTab("pick")}>
        Pick
      </button>
      <button type="button" onClick={() => setActiveTab("popular")}>
        Popular
      </button>
      {posts.map((post) => (
        <Link key={post.id} href={`/community/${post.id}`}>
          {post.title}
        </Link>
      ))}
      <pre>{JSON.stringify({ activeTab, posts }, null, 2)}</pre>
    </>
  );
}
