"use client";

import { useState } from "react";
import LeftSidebar from "@/components/shared/bar/LeftSidebar";
import RightSidebar from "@/components/shared/bar/RightSideBar";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isRightOpen, setIsRightOpen] = useState(true);

  return (
    <div className="flex h-screen bg-[#ffffff]">
      
      {/* 왼쪽 사이드바 (고정) */}
      <LeftSidebar />

      {/* 🔥 메인 (스크롤은 되지만 스크롤바는 안 보임) */}
      <main className="min-w-0 flex-1 overflow-y-auto no-scrollbar bg-[#ffffff]">
        <div className="mx-auto w-full max-w-[1350px] px-12 pt-7 ">
          {children}
        </div>
      </main>

      {/* 오른쪽 사이드바 (고정) */}
      <RightSidebar
        isOpen={isRightOpen}
        onToggle={() => setIsRightOpen((prev) => !prev)}
        hasData={false}
      />
    </div>
  );
}