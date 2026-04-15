"use client";
import Image from "next/image";

export default function Page() {
  return (
    <div className="max-w-310 mx-auto px-4">
      <Image
        src="/community-hero.png"
        alt="커뮤니티 이미지"
        width={800}
        height={400}
        className="w-full h-auto object-cover rounded-lg"
      />
      <h1 className="text-[24px] font-bold mt-20">이런글은 어때요?</h1>
      <p className="text-gray-600 mt-4">
        커뮤니티 페이지입니다. 다양한 게시글과 소통을 즐겨보세요!
      </p>
    </div>
  );
}
