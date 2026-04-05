"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type BubuFloatProps = {
  size?: number;
  className?: string;
};

export default function BubuBounce({
  size = 100,
  className = "",
}: BubuFloatProps) {
  const fullText = "오늘도 한 걸음, 잘하고 있어요~!!!";
  const [text, setText] = useState("");

  useEffect(() => {
    let i = 0;
    let paused = false;

    const interval = setInterval(() => {
      if (paused) return;

      setText(fullText.slice(0, i + 1));
      i++;

      if (i === fullText.length) {
        paused = true;

        setTimeout(() => {
          setText("");
          i = 0;
          paused = false;
        }, 1500);
      }
    }, 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex items-center ${className}`}>
      {/* 왼쪽 텍스트: 폭 고정 */}
      <div className="w-[230px] pr-3 text-[14px] font-medium text-slate-400 ml-6">
        {text}
      </div>

      {/* 오른쪽 캐릭터: 위치 고정 */}
      <div
        className="relative shrink-0 inline-flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <style jsx>{`
          @keyframes bubuFloat {
            0% {
              transform: translateY(0px) rotate(0deg) scale(1);
            }
            25% {
              transform: translateY(-6px) rotate(-1deg) scale(1.01);
            }
            50% {
              transform: translateY(-10px) rotate(0.8deg) scale(1.02);
            }
            75% {
              transform: translateY(-5px) rotate(-0.6deg) scale(1.01);
            }
            100% {
              transform: translateY(0px) rotate(0deg) scale(1);
            }
          }

          .bubu-float {
            animation: bubuFloat 3.2s ease-in-out infinite;
            transform-origin: center center;
          }
        `}</style>

        <div className="bubu-float relative h-full w-full">
          <Image
            src="/bubu.svg"
            alt="bubu"
            fill
            priority
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}