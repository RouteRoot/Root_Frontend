"use client";

import { getRoadmapByToken } from "@/features/roadmap/api/roadmap";
import type { RoadmapResponse } from "@/features/roadmap/types";
import RoadmapKanbanBoard from "@/features/roadmap/components/RoadmapKanbanboard";
import RoadmapTimelineSection from "@/features/roadmap/components/RoadmapTimelineSection";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [hasRoadmap, setHasRoadmap] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const data: RoadmapResponse = await getRoadmapByToken();
        setRoadmap(data);

        if (data?.phases && data.phases.length > 0) {
          setHasRoadmap(true);
        } else {
          setHasRoadmap(false);
        }
      } catch (e) {
        console.error("Failed to load roadmap", e);
        setRoadmap(null);
        setHasRoadmap(false);
      }
    };

    fetchRoadmap();
  }, []);

  if (hasRoadmap === null) return <p>Loading roadmap</p>;

  if (!hasRoadmap) {
    return (
      <>
        <p>No roadmap</p>
        <Link href="/roadmap/generate">Generate roadmap</Link>
        <pre>{JSON.stringify({ roadmap, hasRoadmap }, null, 2)}</pre>
      </>
    );
  }

  return (
    <>
      <RoadmapTimelineSection />
      <RoadmapKanbanBoard />
      <pre>{JSON.stringify({ roadmap, hasRoadmap }, null, 2)}</pre>
    </>
  );
}
