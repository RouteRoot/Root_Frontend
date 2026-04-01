"use client";

import { Noto_Serif_KR } from "next/font/google";
import PhaseSection from "@/components/roadmap/PhaseSection";

const serif = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function WelcomePage() {
  return (
    <main className={`min-h-screen bg-white`}>
      <div className="mx-auto w-full max-w-[930px] px-8 py-14">
        
        {/* 타이틀 */}
        <h1 className={`text-[48px] font-bold leading-[1.1] text-[#1C1E22] ${serif.className}`}>
          <span className="text-[#38c26d]">Bburi-AI-RoadMap</span>에
          <br />
          오신것을 환영합니다
        </h1>

        {/* 초록 라인 */}
        <div className="mt-5 h-[4px] w-[64px] bg-[#35c26b]" />

        {/* 본문 */}
        <div className="mt-6 text-[14px] leading-[2] text-[#515a66]">
          <p>민서님, 이제 뿌리를 내려보세요.</p>
          <p>
            이 로드맵은 당신의 목표까지 도달하기 위한 흐름을 정리한
            학습 가이드입니다. 각 단계를 따라가며 차근차근 학습을
            이어나가세요.
          </p>
          <p className="font-semibold text-[#1C1E22]">
            당신의 성장은 이미 시작되었습니다.
          </p>
        </div>

        {/* 하단 라인 */}
        <div className="mt-6 h-px w-full bg-[#e5e7eb]" />
        <div>
          <PhaseSection />
        </div>
      </div>
    </main>
  );
}