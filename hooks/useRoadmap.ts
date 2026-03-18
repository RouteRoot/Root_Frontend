"use client";

import { useEffect, useState } from "react";
import { getRoadmapById } from "@/app/api/service/roadmap";
import type { RoadmapResponse } from "@/types/roadmap";

export default function useRoadmap(roadmapId: number) {
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getRoadmapById(roadmapId);
        setRoadmap(data);
      } catch (err) {
        console.error("로드맵 조회 실패:", err);
        setError("로드맵을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [roadmapId]);

  return { roadmap, loading, error };
}
