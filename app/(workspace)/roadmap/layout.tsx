"use client";

import SidebarLayout from "@/components/layouts/SidebarLayout";
import RoadmapSidebar from "@/components/roadmap/RoadmapSidebar";
import { usePathname } from "next/navigation";

export default function RoadmapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/roadmap/generate") {
    return (
      <div
        className="pt-[calc(4.5rem+var(--global-banner-height))] lg:pt-[calc(8rem+var(--global-banner-height))]"
      >
        {children}
      </div>
    );
  }

  return (
    <SidebarLayout sidebar={<RoadmapSidebar />}>
      {children}
    </SidebarLayout>
  );
}
