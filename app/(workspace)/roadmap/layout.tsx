import SidebarLayout from "@/components/layouts/SidebarLayout";
import RoadmapSidebar from "@/components/roadmap/RoadmapSidebar";

export default function RoadmapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarLayout sidebar={<RoadmapSidebar />}>
      {children}
    </SidebarLayout>
  );
}
