"use client";

import { useEffect, useRef, useState } from "react";
import type { PlanTab } from "@/features/plan/types";

type PlanTabsProps = {
  tabs: PlanTab[];
  selectedExamTaskId: number | null;
  onSelect: (examTaskId: number) => void;
  onDeletePlan?: (examTaskId: number) => void | Promise<void>;
  onRegeneratePlan?: (examTaskId: number) => void | Promise<void>;
  isLoading?: boolean;
};

export default function PlanTabs({
  tabs,
  selectedExamTaskId,
  onSelect,
  onDeletePlan,
  onRegeneratePlan,
  isLoading = false,
}: PlanTabsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current) return;

      if (!dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRegeneratePlan = async () => {
    if (!selectedExamTaskId) return;
    setIsMenuOpen(false);
    await onRegeneratePlan?.(selectedExamTaskId);
  };

  const handleDeletePlan = async () => {
    if (!selectedExamTaskId) return;
    setIsMenuOpen(false);
    await onDeletePlan?.(selectedExamTaskId);
  };

  if (isLoading) {
    return <p>Loading plan tabs</p>;
  }

  if (!tabs.length) {
    return <p>No plans</p>;
  }

  return (
    <>
      {tabs.map((tab) => (
        <button
          key={tab.examTaskId}
          type="button"
          onClick={() => onSelect(tab.examTaskId)}
        >
          {tab.taskName}
          {selectedExamTaskId === tab.examTaskId ? " *" : ""}
        </button>
      ))}
      <span ref={dropdownRef}>
        <button type="button" onClick={() => setIsMenuOpen((prev) => !prev)}>
          Manage plan
        </button>
        {isMenuOpen && (
          <>
            <button type="button" onClick={handleRegeneratePlan}>
              Regenerate
            </button>
            <button type="button" onClick={handleDeletePlan}>
              Delete
            </button>
          </>
        )}
      </span>
      <pre>{JSON.stringify({ tabs, selectedExamTaskId, isMenuOpen }, null, 2)}</pre>
    </>
  );
}
