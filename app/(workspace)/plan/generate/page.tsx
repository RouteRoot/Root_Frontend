"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { generatePlan } from "@/features/plan/api/plan";

export default function PlanGeneratePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const examTaskId = Number(searchParams.get("examTaskId") ?? "0");
  const certificationName = searchParams.get("name") ?? "";
  const daily = Number(searchParams.get("daily") ?? "0");
  const weekly = Number(searchParams.get("weekly") ?? "0");
  const skillLevel = searchParams.get("mylevel") ?? "";

  const [examDate, setExamDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValid = useMemo(() => {
    return (
      examTaskId > 0 &&
      certificationName.trim() !== "" &&
      daily > 0 &&
      weekly > 0 &&
      skillLevel.trim() !== "" &&
      examDate.trim() !== ""
    );
  }, [examTaskId, certificationName, daily, weekly, skillLevel, examDate]);

  const handleGenerate = async () => {
    if (!isValid) {
      setError("Enter exam date.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await generatePlan({
        examTaskId,
        examDate,
        certificationName,
        daily,
        weekly,
        skillLevel,
      });

      router.push("/plan");
    } catch (err) {
      console.error("Failed to generate plan:", err);
      setError("Failed to generate plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <input
        type="date"
        value={examDate}
        onChange={(e) => setExamDate(e.target.value)}
      />
      <button type="button" onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating" : "Generate plan"}
      </button>
      {error && <p>{error}</p>}
      <pre>
        {JSON.stringify(
          {
            examTaskId,
            certificationName,
            daily,
            weekly,
            skillLevel,
            examDate,
            loading,
            error,
            isValid,
          },
          null,
          2
        )}
      </pre>
    </>
  );
}
