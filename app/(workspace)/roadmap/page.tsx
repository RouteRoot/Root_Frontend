import RoadmapKanbanBoard from "@/components/roadmap/RoadmapKanbanboard";
import RoadmapTimelineSection from "@/components/roadmap/RoadmapTimelineSection.tsx";

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <RoadmapTimelineSection />
      <RoadmapKanbanBoard />
    </div>
  );
}