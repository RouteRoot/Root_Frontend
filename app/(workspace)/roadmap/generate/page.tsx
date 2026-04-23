"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { generateRoadmap } from "@/features/roadmap/api/roadmap";
import type { RoadmapFormData } from "@/features/roadmap/types";

const educationOptions = [
  "High school graduate",
  "College student",
  "College graduate",
  "Graduate student",
];

const gradeOptions = [1, 2, 3, 4];
const levelOptions = ["Beginner", "Intermediate", "Advanced"];
const targetOptions = ["Private company", "Public company", "Internship", "Startup"];

export default function GeneratePage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<RoadmapFormData>({
    educationStatus: "",
    grade: 0,
    major: "",
    hope: "",
    isMajorRelated: true,
    career: 0,
    daily: 0,
    weekly: 0,
    mylevel: "",
    target: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const progress = useMemo(() => {
    return (currentStep / 3) * 100;
  }, [currentStep]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "grade" ||
        name === "career" ||
        name === "daily" ||
        name === "weekly"
          ? Number(value) || 0
          : name === "isMajorRelated"
          ? value === "true"
          : value,
    }));
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!form.educationStatus.trim()) return "Select education status.";
      if (!form.grade || form.grade < 1) return "Select grade.";
      if (!form.major.trim()) return "Enter major.";
      if (!form.mylevel) return "Select current level.";
      if (form.career < 0) return "Career must be 0 or more.";
      return "";
    }

    if (step === 2) {
      if (!form.hope.trim()) return "Enter desired role.";
      if (!form.target.trim()) return "Select target.";
      return "";
    }

    if (step === 3) {
      if (!form.daily || form.daily < 1) return "Enter daily study hours.";
      if (!form.weekly || form.weekly < 1) return "Enter weekly study hours.";
      return "";
    }

    return "";
  };

  const handleNext = () => {
    const validationError = validateStep(currentStep);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3);
    }
  };

  const handlePrev = () => {
    setError("");
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateStep(3);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await generateRoadmap(form);

      if (result?.roadmapId) {
        localStorage.setItem("roadmapId", String(result.roadmapId));
      }

      router.push("/roadmap");
    } catch (err) {
      console.error("Failed to generate roadmap:", err);
      setError("Failed to generate roadmap.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleGenerate}>
        {currentStep === 1 && (
          <>
            <select
              name="educationStatus"
              value={form.educationStatus}
              onChange={handleChange}
            >
              <option value="">Education status</option>
              {educationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select name="grade" value={form.grade || ""} onChange={handleChange}>
              <option value="">Grade</option>
              {gradeOptions.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
            <input
              name="major"
              value={form.major}
              onChange={handleChange}
              placeholder="Major"
            />
            <select
              name="isMajorRelated"
              value={String(form.isMajorRelated)}
              onChange={handleChange}
            >
              <option value="true">Major related</option>
              <option value="false">Not major related</option>
            </select>
            {levelOptions.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, mylevel: level }))}
              >
                {level}
              </button>
            ))}
            <input
              type="number"
              min={0}
              name="career"
              value={form.career || ""}
              onChange={handleChange}
              placeholder="Career months"
            />
          </>
        )}
        {currentStep === 2 && (
          <>
            <input
              name="hope"
              value={form.hope}
              onChange={handleChange}
              placeholder="Desired role"
            />
            <select name="target" value={form.target} onChange={handleChange}>
              <option value="">Target</option>
              {targetOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </>
        )}
        {currentStep === 3 && (
          <>
            <input
              type="number"
              min={1}
              name="daily"
              value={form.daily || ""}
              onChange={handleChange}
              placeholder="Daily hours"
            />
            <input
              type="number"
              min={1}
              name="weekly"
              value={form.weekly || ""}
              onChange={handleChange}
              placeholder="Weekly hours"
            />
          </>
        )}
        <button
          type="button"
          onClick={currentStep === 1 ? () => router.push("/roadmap") : handlePrev}
        >
          {currentStep === 1 ? "Cancel" : "Previous"}
        </button>
        {currentStep < 3 ? (
          <button type="button" onClick={handleNext}>
            Next
          </button>
        ) : (
          <button type="submit" disabled={loading}>
            {loading ? "Generating" : "Generate roadmap"}
          </button>
        )}
      </form>
      {error && <p>{error}</p>}
      <pre>{JSON.stringify({ currentStep, progress, form, loading, error }, null, 2)}</pre>
    </>
  );
}
