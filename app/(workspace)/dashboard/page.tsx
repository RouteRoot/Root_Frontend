"use client";

import Image from "next/image";
import { FileText, Braces } from "lucide-react";
import { useEffect, useState } from "react";
import { getMe } from "@/app/api/service/user";

const files = [
  {
    name: "1. 안녕하세요, 저는 bubu입니다.md",
    time: "9 seconds ago",
    type: "md",
  },
  {
    name: "로드맵 만들기.md",
    time: "23 seconds ago",
    type: "md",
  },
  {
    name: "학습플래너는 어떻게 만드는가.md",
    time: "21 minutes ago",
    type: "md",
  },
  {
    name: "_meta.json",
    time: "21 minutes ago",
    type: "json",
  },
];

export default function DashboardPage() {
  const [userName, setUserName] = useState("사용자");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const me = await getMe();
        setUserName(me.name);
      } catch (error) {
        console.error("유저 정보 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  return (
    <main className="h-screen overflow-hidden bg-white">
      <div className="mx-auto flex h-full w-full max-w-[760px] flex-col items-center justify-center px-6">
        
        <div className="flex flex-col items-center">
          {/* 애니메이션 */}
          <div className="float">
            <Image
              src="/bubu.svg"
              alt="bubu"
              width={500}
              height={500}
              className="h-[100px] w-[100px] object-contain"
              priority
            />
          </div>

          <h1 className="mt-7 text-[18px] font-semibold tracking-[-0.02em] text-[#111111]">
            {loading ? "Loading..." : `${userName}'s bubu`}
          </h1>

          <p className="mt-4 max-w-[560px] text-center text-[15px] leading-[1.55] text-[#4b5563]">
            It’s time to plant your roots 🌱  
            Start your roadmap and 
            planner now.
          </p>
        </div>

        {/* 파일 리스트 */}
        <div className="mt-10 w-full overflow-hidden rounded-[18px] border border-[#cfcfcf]">
          {files.map((file, index) => {
            const isLast = index === files.length - 1;

            return (
              <div
                key={file.name}
                className={`flex min-h-[56px] items-center justify-between px-4 sm:px-5 ${
                  !isLast ? "border-b border-[#d9d9d9]" : ""
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="shrink-0 text-[#7b8794]">
                    {file.type === "json" ? (
                      <Braces size={14} strokeWidth={1.9} />
                    ) : (
                      <FileText size={14} strokeWidth={1.9} />
                    )}
                  </div>

                  <span className="truncate text-[14px] font-semibold text-[#111111]">
                    {file.name}
                  </span>
                </div>

                <span className="ml-4 shrink-0 text-[14px] text-[#8b93a1]">
                  {file.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .float {
          animation: floatSlow 2s ease-in-out infinite;
        }

        @keyframes floatSlow {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </main>
  );
}