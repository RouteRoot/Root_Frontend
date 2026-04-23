"use client";

import { getRoadmapByToken } from "@/features/roadmap/api/roadmap";
import type { RoadmapResponse } from "@/features/roadmap/types";
import { useEffect, useMemo, useState } from "react";

export default function RoadmapKanbanBoard() {
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getRoadmapByToken();
        setRoadmap(data);
      } catch (err) {
        console.error("Failed to load roadmap kanban:", err);
        setError("Failed to load roadmap.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, []);

  const phases = useMemo(() => roadmap?.phases ?? [], [roadmap]);

  if (loading) return <p>Loading roadmap kanban</p>;
  if (error) return <p>{error}</p>;

  return <pre>{JSON.stringify({ phases }, null, 2)}</pre>;
}
