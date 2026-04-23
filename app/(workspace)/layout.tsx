"use client";

import { usePathname } from "next/navigation";
import Gnb from "@/shared/components/layout/Gnb";
import CommunityGnb from "@/shared/components/layout/CommunityGnb";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isCommunity = pathname.startsWith("/community");

  return (
    <>
      {isCommunity ? <CommunityGnb /> : <Gnb />}
      {children}
    </>
  );
}
