"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPosts, getStudyPosts } from "@/app/api/community/post";
import type { Post } from "@/app/api/community/types";

export default function CommunityPage() {
  const router = useRouter();

  const [tab, setTab] = useState<"FREE" | "STUDY">("FREE");
  const [posts, setPosts] = useState<Post[]>([]);

  // 게시글 불러오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (tab === "FREE") {
          const data = await getPosts("FREE");
          setPosts(data);
        } else {
          const data = await getStudyPosts("RECRUITING");
          setPosts(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, [tab]);

  return (
    <main className="p-6">
      {/* 탭 */}
      <div className="flex gap-4 mb-6">
        <button onClick={() => setTab("FREE")}>자유게시판</button>
        <button onClick={() => setTab("STUDY")}>스터디 모집</button>
      </div>

      {/* 글쓰기 버튼 */}
      <div className="mb-4">
        <button onClick={() => router.push("/workspace/community/write")}>
          글쓰기
        </button>
      </div>

      {/* 게시글 리스트 */}
      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <div
            key={post.postId}
            className="border p-4 cursor-pointer"
            onClick={() =>
              router.push(`/workspace/community/${post.postId}`)
            }
          >
            <h2 className="font-bold">{post.title}</h2>
            <p>{post.category}</p>
            <p className="text-sm text-gray-500">{post.author}</p>
          </div>
        ))}
      </div>
    </main>
  );
}