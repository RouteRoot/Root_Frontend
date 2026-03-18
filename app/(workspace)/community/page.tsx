"use client";
import MyRoadmapPreview from "@/components/dashboard/MyRoadmapPreview";
import Link from "next/link";
import { useMemo, useState } from "react";
import { MessageSquare, Eye, Heart, PenSquare } from "lucide-react";
import { communityPosts } from "../community/data";

const categories = ["전체", "합격후기", "질문", "자유"];

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "전체") return communityPosts;
    return communityPosts.filter((post) => post.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <main className="min-h-screen bg-[#f7f8fc] px-6 py-10 text-[#111827]">
      <MyRoadmapPreview />
      <div className="mx-auto max-w-6xl">
        <section className="mb-8 rounded-4xl border border-[#ececf2] bg-white p-8 shadow-sm">
          <p className="mb-2 text-sm font-semibold text-[#7c3aed]">COMMUNITY</p>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">커뮤니티</h1>
              <p className="mt-2 text-sm leading-6 text-[#6b7280]">
                자격증 준비생들과 공부법, 합격후기, 질문을 나눠보세요.
              </p>
            </div>

            <button className="inline-flex items-center gap-2 rounded-2xl bg-[#7c3aed] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
              <PenSquare className="h-4 w-4" />
              글쓰기
            </button>
          </div>
        </section>

        <section className="mb-6 flex flex-wrap gap-3">
          {categories.map((category) => {
            const active = selectedCategory === category;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-[#7c3aed] text-white"
                    : "bg-white text-[#4b5563] border border-[#e5e7eb] hover:border-[#c4b5fd]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/community/${post.id}`}
                className="block rounded-[28px] border border-[#e5e7eb] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#f3e8ff] px-3 py-1 text-xs font-semibold text-[#7c3aed]">
                    {post.category}
                  </span>
                  <span className="text-xs text-[#9ca3af]">
                    {post.createdAt}
                  </span>
                </div>

                <h2 className="mb-2 text-xl font-bold">{post.title}</h2>
                <p className="mb-4 text-sm leading-6 text-[#6b7280]">
                  {post.preview}
                </p>

                <div className="mb-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#f9fafb] px-3 py-1 text-xs text-[#4b5563]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[#6b7280]">
                  <span className="font-medium">작성자 {post.author}</span>

                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {post.likes}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {post.comments}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {post.views}
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {filteredPosts.length === 0 && (
              <div className="rounded-[28px] border border-dashed border-[#d1d5db] bg-white px-6 py-16 text-center">
                <p className="text-lg font-semibold">게시글이 없어요</p>
                <p className="mt-2 text-sm text-[#6b7280]">
                  다른 카테고리를 선택해보세요.
                </p>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-[28px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold">인기 태그</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "SQLD",
                  "정보처리기사",
                  "ADsP",
                  "컴활1급",
                  "면접",
                  "공부루틴",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#f3f4f6] px-3 py-2 text-sm font-medium text-[#4b5563]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold">커뮤니티 안내</h3>
              <ul className="space-y-3 text-sm leading-6 text-[#6b7280]">
                <li>• 자격증 후기와 공부법을 자유롭게 공유할 수 있어요.</li>
                <li>• 질문 글을 통해 다른 사용자들과 정보를 나눌 수 있어요.</li>
                <li>• 추후 좋아요, 댓글, 북마크 기능도 붙일 수 있어요.</li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
