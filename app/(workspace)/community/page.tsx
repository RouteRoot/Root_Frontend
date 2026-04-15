"use client";

import CommunityPostsSection from "@/components/community/CommunityPostsSection";
import RecommendedPostsSection from "@/components/community/RecommendedPostsSection";
import UserCard from "@/components/community/UserCard";
import Image from "next/image";

export default function Page() {
  return (
    <div className="mx-auto pb-24">
      <Image
        src="/com-1.png"
        alt="커뮤니티 이미지"
        width={1600}
        height={500}
        className="h-auto w-full rounded-[24px] object-cover"
      />

      <div className="mt-16 grid grid-cols-[minmax(0,1fr)_310px] gap-10">
        <div className="min-w-0 space-y-14">
          <RecommendedPostsSection />

          <section>
            <CommunityPostsSection />
          </section>
        </div>

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
