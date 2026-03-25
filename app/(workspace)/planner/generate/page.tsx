"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { generatePlan } from "@/app/api/service/plan";
import { getRoadmapByToken } from "@/app/api/service/roadmap";

export default function PlannerGeneratePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [examTaskId, setExamTaskId] = useState("");
  const [certificationName, setCertificationName] = useState("");
  const [daily, setDaily] = useState("");
  const [weekly, setWeekly] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [examDate, setExamDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [roadmapLoading, setRoadmapLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const initialize = async () => {
      try {
        setRoadmapLoading(true);
        setError("");

        const taskId = searchParams.get("taskId");
        const name = searchParams.get("name");

        if (taskId) setExamTaskId(taskId);
        if (name) setCertificationName(name);

        const roadmap = await getRoadmapByToken();

        console.log("로드맵 전체:", roadmap);

        if (roadmap) {
          setDaily(String(roadmap.daily ?? ""));
          setWeekly(String(roadmap.weekly ?? ""));
          setSkillLevel(roadmap.mylevel ?? "");
        }
      } catch (err) {
        console.error("로드맵 조회 실패:", err);
        setError("로드맵 정보를 불러오지 못했습니다.");
      } finally {
        setRoadmapLoading(false);
      }
    };

    initialize();
  }, [searchParams]);

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

      // ✅ 생성 성공 후 조회용 examTaskId 저장
      localStorage.setItem("examTaskId", String(result.examTaskId));

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
        <section className="rounded-[28px] border border-gray-200 p-6 md:p-8">
          <div className="mb-8">
            <p className="mb-2 text-sm font-medium text-gray-500">Planner</p>
            <h1 className="text-3xl font-bold tracking-tight text-black">
              학습 플랜 만들기
            </h1>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              선택한 시험에 맞춰 학습 플랜을 생성합니다. 필요한 값은 수정할 수
              있고, 선택한 시험은 변경할 수 없습니다.
            </p>
          </div>

          {roadmapLoading ? (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-600">
              로드맵 정보를 불러오는 중...
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  선택한 시험
                </label>
                <div className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-black">
                  {certificationName || "-"}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-black">
                    하루 공부 시간
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={daily}
                    onChange={(e) => setDaily(e.target.value)}
                    placeholder="예: 2"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-black outline-none transition focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-black">
                    주간 공부 시간
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={weekly}
                    onChange={(e) => setWeekly(e.target.value)}
                    placeholder="예: 16"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-black outline-none transition focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  실력 수준
                </label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-black outline-none transition focus:border-black"
                >
                  <option value="">선택하세요</option>
                  <option value="하">하</option>
                  <option value="중">중</option>
                  <option value="상">상</option>
                </select>
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
          )}

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
              disabled={loading || roadmapLoading}
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
