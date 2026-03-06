"use client"

import Image from "next/image";
import AnimatedKeyword from "@/components/shared/animation/AnimationKeywords";
export default function Home() {
  return (
    <main>
      {/* 첫 번째 섹션 */}
      <section className="relative h-[calc(100vh-64px)] overflow-hidden bg-linear-to-b from-white via-[#e7d3c2] to-[#ebc3a4]">
        <div className="absolute bottom-10 left-10 z-10">
          <Image
            src="/rooty-1.svg"
            alt="ROOTY"
            width={620}
            height={450}
            priority
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl h-full flex items-center justify-end px-6 pr-25">
          <div className="max-w-xl text-left">
            <h1 className="text-6xl font-bold leading-tight text-gray-900">
              뿌리에서 <AnimatedKeyword />
              <br />
              자격증 찾고 계신가요?
            </h1>
            <p className="mt-6 text-xl text-gray-700 leading-relaxed">
              시험 일정부터 학습 로드맵까지
              <br />
              우리가 당신의 경로를 설계합니다
            </p>
          </div>
        </div>
      </section>

      {/* 두 번째 섹션 */}
      <section className="min-h-screen bg-[#f8f8f8]">
        <div className="mx-auto max-w-7xl px-6 py-24">두 번째 섹션</div>
      </section>

      {/* 세 번째 섹션 */}
      <section className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-7xl px-6 py-24">세 번째 섹션</div>
      </section>
    </main>
  );
}
