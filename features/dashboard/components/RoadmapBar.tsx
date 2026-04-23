"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type RoadmapBarItem = {
  id: number;
  title: string;
  status: "IN_PROGRESS" | "PLANNED" | "DONE";
  phase: 1 | 2 | 3;
};

type RoadmapBarProps = {
  items?: RoadmapBarItem[];
};

const mockRoadmapItems: RoadmapBarItem[] = [
  { id: 1, title: "Computer literacy", status: "IN_PROGRESS", phase: 1 },
  { id: 2, title: "SQLD", status: "IN_PROGRESS", phase: 2 },
  { id: 3, title: "React", status: "DONE", phase: 3 },
  { id: 4, title: "Information processing", status: "PLANNED", phase: 2 },
];

export default function RoadmapBar({
  items = mockRoadmapItems,
}: RoadmapBarProps) {
  const [isPaused, setIsPaused] = useState(false);

  const loopItems = useMemo(() => {
    if (items.length === 0) return [];
    return [...items, ...items];
  }, [items]);

  if (items.length === 0) return null;

  return (
    <Link
      href="/roadmap"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <pre>{JSON.stringify({ isPaused, loopItems }, null, 2)}</pre>
    </Link>
  );
}
