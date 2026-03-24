"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { generatePlan } from "@/app/api/service/plan";

export default function PlannerGeneratePage() {
  const router = useRouter();

  const [examTaskId, setExamTaskId] = useState("");
  const [certificationName, setCertificationName] = useState("");
  const [daily, setDaily] = useState("");
  const [weekly, setWeekly] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [examDate, setExamDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedTaskId = localStorage.getItem("selectedExamTaskId");
    const savedTaskName = localStorage.getItem("selectedCertificationName");
    const savedDaily = localStorage.getItem("plan_daily");
    const savedWeekly = localStorage.getItem("plan_weekly");
    const savedSkillLevel = localStorage.getItem("plan_skillLevel");

    if (savedTaskId) setExamTaskId(savedTaskId);
    if (savedTaskName) setCertificationName(savedTaskName);
    if (savedDaily) setDaily(savedDaily);
    if (savedWeekly) setWeekly(savedWeekly);
    if (savedSkillLevel) setSkillLevel(savedSkillLevel);
  }, []);

  const handleGeneratePlan = async () => {
    if (!examTaskId || !certificationName || !daily || !weekly || !skillLevel) {
      setError(
        "플랜 생성에 필요한 정보가 없습니다. 로드맵에서 다시 선택해주세요.",
      );
      return;
    }

    if (!examDate) {
      setError("시험 날짜를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        examTaskId: Number(examTaskId),
        examDate,
        certificationName,
        daily: Number(daily),
        weekly: Number(weekly),
        skillLevel,
      };

      const result = await generatePlan(payload);
      console.log("플랜 생성 응답:", result);

      localStorage.setItem("examTaskId", examTaskId);
      router.push("/planner");
    } catch (err) {
      console.error("학습 플랜 생성 실패:", err);
      setError("학습 플랜 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <section className="rounded-[28px] border border-gray-20 p-6 md:p-8">
          <div className="mb-8">
            <p className="mb-2 text-sm font-medium text-gray-500">Planner</p>
            <h1 className="text-3xl font-bold tracking-tight text-black">
              학습 플랜 만들기
            </h1>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              선택한 시험에 맞춰 학습 플랜을 생성합니다. 시험 날짜만 입력하면
              바로 플랜이 만들어져요.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
              <p className="text-sm text-gray-500">선택한 시험</p>
              <p className="mt-1 text-base font-semibold text-black">
                {certificationName || "-"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
                <p className="text-sm text-gray-500">하루 공부 시간</p>
                <p className="mt-1 text-base font-semibold text-black">
                  {daily || "-"}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
                <p className="text-sm text-gray-500">주간 공부 시간</p>
                <p className="mt-1 text-base font-semibold text-black">
                  {weekly || "-"}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
                <p className="text-sm text-gray-500">실력 수준</p>
                <p className="mt-1 text-base font-semibold text-black">
                  {skillLevel || "-"}
                </p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                시험 날짜
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-black outline-none transition focus:border-black"
              />
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-2xl border border-gray-200 px-5 py-3 text-sm font-medium text-black transition hover:bg-gray-50"
            >
              뒤로가기
            </button>

            <button
              type="button"
              onClick={handleGeneratePlan}
              disabled={loading}
              className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "플랜 생성 중..." : "플랜 생성하기"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
