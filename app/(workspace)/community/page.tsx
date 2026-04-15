"use client";

import CommunityPostsSection from "@/components/community/CommunityPostsSection";
import RecommendedPostsSection from "@/components/community/RecommendedPostsSection";
import UserCard from "@/components/community/UserCard";
import Image from "next/image";

export default function Page() {
  return (
    <div className="mx-auto px-40 pb-24">
      {/* 히어로 배너 */}
      <Image
        src="/community-hero.png"
        alt="커뮤니티 이미지"
        width={1600}
        height={500}
        className="h-auto w-full rounded-[24px] object-cover"
      />

      {/* 메인 2컬럼 */}
      <div className="mt-16 grid grid-cols-[minmax(0,1fr)_310px] gap-10">
        {/* 왼쪽 */}
        <div className="min-w-0 space-y-14">
          <RecommendedPostsSection />

          <section>
            <CommunityPostsSection />
          </section>
        </div>

        {/* 오른쪽 */}
        <aside className="space-y-4">
          <div className="mb-20">
            <UserCard />
          </div>
          <Image
            src="/54060310-2f53-4fc4-82df-171bc4130391.png"
            alt="커뮤니티 배너 1"
            width={310}
            height={200}
            className="h-auto w-full rounded-[20px] object-cover"
          />
          <Image
            src="/8292bfbc-fa53-4282-b1d2-9b16bc174564.png"
            alt="커뮤니티 배너 1"
            width={310}
            height={20}
            className="h-auto w-full rounded-[20px] object-cover"
          />
        </aside>
      </div>
    </div>
  );
}
