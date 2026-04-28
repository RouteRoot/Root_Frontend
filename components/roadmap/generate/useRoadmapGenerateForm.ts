"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  generateRoadmap,
  getRoadmapByToken,
} from "@/app/api/roadmap/roadmap";
import type { RoadmapFormData } from "@/app/api/roadmap/types";

const initialForm: RoadmapFormData = {
  educationStatus: "",
  grade: 0,
  major: "",
  hope: "",
  isMajorRelated: true,
  career: 0,
  acquired: [],
  mylevel: "중",
  target: "",
  personalStory: "",
};

export default function useRoadmapGenerateForm() {
  const router = useRouter();
  const [form, setForm] = useState<RoadmapFormData>(initialForm);
  const [acquiredInput, setAcquiredInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadAcquiredCertificates = async () => {
      try {
        const roadmap = await getRoadmapByToken();
        const completed = roadmap.phases
          .flatMap((phase) => phase.tasks)
          .filter((task) => task.status === "COMPLETED")
          .map((task) => task.taskName.trim())
          .filter(Boolean);

        if (!mounted || completed.length === 0) return;

        setForm((prev) => ({
          ...prev,
          acquired: Array.from(new Set([...prev.acquired, ...completed])),
        }));
      } catch (err) {
        console.warn("취득 자격증 불러오기 실패:", err);
      }
    };

    loadAcquiredCertificates();

    return () => {
      mounted = false;
    };
  }, []);

  const isValid = useMemo(
    () =>
      form.educationStatus.trim() !== "" &&
      form.major.trim() !== "" &&
      form.hope.trim() !== "" &&
      form.mylevel.trim() !== "" &&
      form.target.trim() !== "" &&
      form.career >= 0,
    [form]
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "grade" || name === "career" ? Number(value) || 0 : value,
    }));
  };

  const updateField = <K extends keyof RoadmapFormData>(
    name: K,
    value: RoadmapFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addAcquired = () => {
    const next = acquiredInput.trim();
    if (!next) return;

    setForm((prev) => ({
      ...prev,
      acquired: prev.acquired.includes(next)
        ? prev.acquired
        : [...prev.acquired, next],
    }));
    setAcquiredInput("");
  };

  const removeAcquired = (name: string) => {
    setForm((prev) => ({
      ...prev,
      acquired: prev.acquired.filter((item) => item !== name),
    }));
  };

  const handleGenerate = async () => {
    if (!isValid) {
      setError("필수 정보를 모두 입력해주세요.");
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
      console.error("로드맵 생성 실패:", err);
      setError("로드맵 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    acquiredInput,
    loading,
    error,
    isValid,
    setAcquiredInput,
    handleChange,
    updateField,
    addAcquired,
    removeAcquired,
    handleGenerate,
  };
}
