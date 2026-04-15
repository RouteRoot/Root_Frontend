"use client";

import Image from "next/image";
import Link from "next/link";

type UserCardProps = {
  user?: {
    name: string;
    description: string;
    profileImage: string;
    postCount: number;
    commentCount: number;
  };
};

const mockUser = {
  name: "권민서",
  description: "프론트엔드 취업 준비",
  profileImage: "/bubu11.png",
  postCount: 2,
  commentCount: 2,
};

function UserActionCard() {
  return (
    <div className="mt-3 overflow-hidden rounded-[10px] border border-[#E3E8F2] bg-[#F5F7FB]">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-3 py-3">
        <Link
          href="/community/write"
          className="flex items-center justify-center text-[13px] font-semibold text-[#6B768B] transition-colors hover:text-[#1F2D4A]"
        >
          글 작성하기
        </Link>

        <div className="h-[14px] w-px bg-[#D7DEEA]" />

        <Link
          href="/community/likes"
          className="flex items-center justify-center text-[13px] font-semibold text-[#6B768B] transition-colors hover:text-[#1F2D4A]"
        >
          내 좋아요 목록
        </Link>
      </div>
    </div>
  );
}

export default function UserCard({ user = mockUser }: UserCardProps) {
  return (
    <section className="w-full max-w-[380px]">
      {/* 카드 1: 프로필 + 통계 */}
      <div className="overflow-hidden rounded-[10px] border border-[#E3E8F2] bg-white px-5 py-5">
        {/* 프로필 */}
        <Link href="/mypage" className="flex items-start gap-4">
          <div className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-full bg-[#EEF2F8]">
            <Image
              src={user.profileImage}
              alt="프로필 이미지"
              fill
              className="object-cover"
            />
          </div>

          <div className="pt-[4px]">
            <h3 className="text-[16px] font-bold text-[#1F2D4A]">
              {user.name}
            </h3>
            <p className="mt-[10px] text-[14px] text-[#3E4A63]">
              {user.description}
            </p>
          </div>
        </Link>

        {/* 구분선 */}
        <div className="mt-4 -mx-6 h-px bg-[#E8EDF5]" />

        {/* 통계 */}
        <div className="pt-4 flex flex-col gap-2 -mb-1">
          <Link
            href="/community/my-posts"
            className="flex items-center justify-between px-1 rounded-[8px] transition-colors hover:bg-[#F8FAFD]"
          >
            <span className="text-[13px] text-[#6B768B]">내가 쓴 글</span>
            <span className="ml-14 text-[13px] font-bold text-[#1F2D4A]">
              {user.postCount}
            </span>
          </Link>

          <Link
            href="/community/my-comments"
            className="flex items-center justify-between px-1 py-[4px] rounded-[8px] transition-colors hover:bg-[#F8FAFD]"
          >
            <span className="text-[13px] text-[#6B768B]">내가 쓴 댓글</span>
            <span className="ml-14 text-[13px] font-bold text-[#1F2D4A]">
              {user.commentCount}
            </span>
          </Link>
        </div>
      </div>

      {/* 카드 2 */}
      <UserActionCard />
    </section>
  );
}
