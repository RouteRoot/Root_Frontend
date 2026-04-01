"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type RightStatusSidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
  hasData?: boolean;
};

export default function RightSidebar({
  isOpen,
  onToggle,
  hasData = false,
}: RightStatusSidebarProps) {
  return (
    <aside
      className={`sticky top-0 h-screen shrink-0 bg-white transition-all duration-300 ${
        isOpen
          ? "w-[360px] border-l border-[#d3d3d3]"
          : "w-[56px]"
      }`}
    >
      {isOpen ? (
        <div className="flex h-full flex-col bg-white">
          {/* 상단 헤더 */}
          <div className="flex items-center justify-between px-4 pb-3 pt-4">
            
            {/* 로고 + 구분선 + 텍스트 */}
            <div className="flex items-center">
              
              {/* 로고 */}
              <div className="flex items-center justify-center">
                <Image
                  src="/bubu.svg"
                  alt="bubu"
                  width={30}
                  height={30}
                  className="h-[30px] w-[30px] object-contain"
                  priority
                />
              </div>

              {/* 구분선 */}
              <div className="mx-3 h-[18px] w-[1px] bg-[#e9e7e3]" />

              {/* 텍스트 */}
              <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-[#111111] leading-none">
                My Status
              </h2>
            </div>

            {/* 토글 버튼 */}
            <button
              type="button"
              onClick={onToggle}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[#111111] transition hover:bg-[#f5f5f5]"
              aria-label="오른쪽 사이드바 닫기"
            >
              <ChevronRight size={18} strokeWidth={2.1} />
              <ChevronRight
                size={18}
                strokeWidth={2.1}
                className="-ml-3"
              />
            </button>
          </div>

          {/* 내용 */}
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            {hasData ? (
              <div className="w-full">{/* 나중에 데이터 렌더링 */}</div>
            ) : (
              <>
                <div className="float-slow">
                  <Image
                    src="/bubu.svg"
                    alt="bubu"
                    width={82}
                    height={82}
                    className="h-[82px] w-[82px] object-contain"
                    priority
                  />
                </div>

                <p className="mt-6 text-[14px] leading-[1.6] text-[#5f6475]">
                  Tip: Start by creating your roadmap. And build your study plan and begin your journey.
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex h-full items-start justify-center bg-white pt-4">
          <button
            type="button"
            onClick={onToggle}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#111111] transition hover:bg-[#f5f5f5]"
            aria-label="오른쪽 사이드바 열기"
          >
            <ChevronLeft size={18} strokeWidth={2.1} />
            <ChevronLeft
              size={18}
              strokeWidth={2.1}
              className="-ml-3"
            />
          </button>
        </div>
      )}

      <style jsx>{`
        .float-slow {
          animation: floatSlow 2.2s ease-in-out infinite;
        }

        @keyframes floatSlow {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </aside>
  );
}