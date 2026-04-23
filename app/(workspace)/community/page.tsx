"use client";

import CommunityPostsSection from "@/features/community/components/CommunityPostsSection";
import RecommendedPostsSection from "@/features/community/components/RecommendedPostsSection";
import UserCard from "@/features/community/components/UserCard";

export default function Page() {
  return (
    <>
      <RecommendedPostsSection />
      <CommunityPostsSection />
      <UserCard />
    </>
  );
}
