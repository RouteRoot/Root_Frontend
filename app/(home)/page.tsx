"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import AnimatedKeyword from "@/components/shared/animation/AnimationKeywords";
import SearchBar from "@/components/shared/search/searchBar";
import ScrollDownButton from "@/components/buttons/ScrollDownButton";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <main className="bg-white">
      {/* 첫 번째 섹션 */}
      <section className="relative h-162.5 overflow-hidden bg-white">
        {/* 이미지 */}
        <div className="absolute bottom-[7%] left-[4%] w-[45%] max-w-250">
          <Image
            src="/main-page-image.svg"
            alt="ROOTY"
            width={1200}
            height={900}
            priority
            className="h-auto w-full"
          />
        </div>

        {/* 텍스트 */}
        <div className="absolute top-[29%] right-[13%] w-[40%] max-w-xl">
          <h1 className="text-6xl font-bold leading-tight text-gray-900">
            뿌리에서 <AnimatedKeyword />
            <br />
            자격증 찾고 계신가요?
          </h1>

          <p className="mt-6 text-[16px] leading-relaxed text-gray-700">
            시험 일정부터 학습 로드맵까지
            <br />
            우리가 당신의 경로를 설계합니다
          </p>

          <div className="mt-6">
            <SearchBar />
          </div>
        </div>

        <ScrollDownButton targetId="second-section" />
      </section>

      {/* 두 번째 섹션 */}
      <section id="second-section" className="bg-[#f8f8f8]">
        <div className="mx-auto max-w-7xl px-6 py-24">두 번째 섹션</div>
      </section>

      {/* 세 번째 섹션 */}
      <section className="bg-white text-black">
        <div className="mx-auto max-w-7xl px-6 py-24">세 번째 섹션</div>
      </section>
    </main>
  );
}
