"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Minus, Plus, Sparkles } from "lucide-react";
import { generatePlan } from "@/app/api/plan/plan";
import {
  DAYS,
  LEVEL_MAP,
  SKILL_LEVELS,
  getDday,
  type DayKey,
} from "@/components/plan/generate/planGenerateConfig";

export default function PlanGeneratePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const examTaskId = Number(searchParams.get("examTaskId") ?? "0");
  const certificationName = searchParams.get("name") ?? "";
  const daily = Number(searchParams.get("daily") ?? "2");
  const rawSkillLevel = searchParams.get("mylevel") ?? "";

  const [examDate, setExamDate] = useState("");
  const [personalStory, setPersonalStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [skillLevel, setSkillLevel] = useState<string>(
    LEVEL_MAP[rawSkillLevel] || "중"
  );
  const [weeklySchedule, setWeeklySchedule] = useState<Record<DayKey, number>>(
    () => ({
      MON: daily,
      TUE: daily,
      WED: daily,
      THU: daily,
      FRI: daily,
      SAT: daily,
      SUN: daily,
    })
  );

  const setDayHours = (key: DayKey, value: number) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      [key]: Math.max(0, Math.min(12, isNaN(value) ? 0 : value)),
    }));
  };

  const totalWeeklyHours = useMemo(
    () => Object.values(weeklySchedule).reduce((sum, h) => sum + h, 0),
    [weeklySchedule]
  );

  const dday = useMemo(() => getDday(examDate), [examDate]);

  const isValid = useMemo(
    () =>
      examTaskId > 0 &&
      certificationName.trim() !== "" &&
      skillLevel.trim() !== "" &&
      examDate.trim() !== "" &&
      totalWeeklyHours > 0,
    [examTaskId, certificationName, skillLevel, examDate, totalWeeklyHours]
  );

  const handleGenerate = async () => {
    try {
      setLoading(true);
      await generatePlan({
        examTaskId,
        examDate,
        certificationName,
        weeklySchedule,
        skillLevel,
        personalStory,
      });
      router.push("/plan");
    } catch (err) {
      console.error("플래너 생성 실패:", err);
      router.push("/plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white mt-8">
      {/* 로딩 오버레이 */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-white/90 backdrop-blur-sm">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-2 w-2 rounded-full bg-[#0075c3] opacity-80"
                style={{ animation: `bounce 1s ${i * 0.18}s infinite` }}
              />
            ))}
          </div>
          <div className="text-center">
            <p className="text-[16px] font-semibold text-[#0B1B3B]">
              AI가 맞춤 플랜을 만들고 있어요
            </p>
            <p className="mt-1 text-[13px] text-[#94A3B8]">
              학습 패턴을 분석 중입니다. 잠시만 기다려 주세요.
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1100px] px-6 pb-10">
        {/* 배지 */}
        <div className="mb-2.5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#0075c3]">
          <Sparkles className="h-3 w-3" />
          AI 맞춤 플래너 생성
        </div>

        {/* 2컬럼 — 타이틀부터 시작 */}
        <div className="grid grid-cols-[1fr_360px] items-start gap-16">
          {/* 왼쪽: 타이틀 + 요일별 학습 시간 */}
          <section>
            <div className="mb-6">
              <h1 className="text-[24px] font-bold tracking-[-0.04em] text-[#0B1B3B]">
                {certificationName || "플랜 생성"}
              </h1>
              <p className="mt-1.5 text-[14px] leading-6 text-[#94A3B8]">
                시험일과 요일별 학습 시간을 설정하면 AI가 맞춤 플랜을 생성해
                드려요.
              </p>
            </div>

            {/* 시험일 */}
            <section className="mb-7">
              <h2 className="mb-3 text-[15px] font-semibold tracking-[-0.02em] text-[#0B1B3B]">
                시험일
              </h2>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="h-[46px] w-full rounded-[10px] border border-[#E8EDF5] bg-white px-4 text-[14px] text-[#0B1B3B] outline-none transition focus:border-[#0075c3]"
              />
              {dday && (
                <p
                  className={`mt-2 text-[13px] font-medium ${
                    dday.includes("지났") ? "text-[#F43F5E]" : "text-[#0075c3]"
                  }`}
                >
                  {dday}
                </p>
              )}
            </section>

            <div className="mb-1 flex items-baseline justify-between">
              <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-[#0B1B3B]">
                요일별 학습 시간
              </h2>
              <span className="text-[13px] text-[#7B8798]">
                주 총{" "}
                <strong className="font-semibold text-[#0B1B3B]">
                  {totalWeeklyHours}시간
                </strong>
              </span>
            </div>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-[13px] text-[#94A3B8]">
                0시간으로 설정한 요일은 휴식일로 처리됩니다.
              </p>
              <span className="text-[12px] text-[#94A3B8]">단위: 시간</span>
            </div>

            <div className="grid grid-cols-7 gap-2.5">
              {DAYS.map(({ key, label }) => {
                const hours = weeklySchedule[key];
                const isRest = hours === 0;
                return (
                  <div
                    key={key}
                    className={`flex flex-col items-center gap-3 rounded-[14px] border py-4 transition-colors ${
                      isRest
                        ? "border-[#EEF2F7] bg-[#FAFBFC]"
                        : "border-[#C8DFF5] bg-[#EFF7FF]"
                    }`}
                  >
                    <span
                      className={`text-[12px] font-semibold ${
                        isRest ? "text-[#C5CFDA]" : "text-[#0075c3]"
                      }`}
                    >
                      {label}
                    </span>

                    <input
                      type="number"
                      min={0}
                      max={12}
                      value={hours}
                      onChange={(e) =>
                        setDayHours(key, Math.floor(Number(e.target.value)))
                      }
                      className={`w-10 bg-transparent text-center text-[22px] font-bold leading-none outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                        isRest ? "text-[#D6DDE6]" : "text-[#0B1B3B]"
                      }`}
                    />

                    {/* 가로 +/- */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setDayHours(key, hours - 1)}
                        disabled={hours === 0}
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-[#E8EDF5] bg-white text-[#94A3B8] transition hover:border-[#0075c3] hover:text-[#0075c3] disabled:opacity-25"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDayHours(key, hours + 1)}
                        disabled={hours >= 12}
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-[#E8EDF5] bg-white text-[#94A3B8] transition hover:border-[#0075c3] hover:text-[#0075c3] disabled:opacity-25"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 오른쪽: 폼 */}
          <div className="flex flex-col gap-6">
            {/* 현재 수준 */}
            <section>
              <h2 className="mb-3 text-[15px] font-semibold tracking-[-0.02em] text-[#0B1B3B]">
                현재 수준
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {SKILL_LEVELS.map(({ value, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSkillLevel(value)}
                    className={`flex flex-col items-center justify-center gap-1 rounded-[10px] border py-3 transition ${
                      skillLevel === value
                        ? "border-[#0075c3] bg-[#EFF7FF]"
                        : "border-[#E8EDF5] bg-white hover:border-[#C8DFF5]"
                    }`}
                  >
                    <span
                      className={`text-[15px] font-bold ${
                        skillLevel === value
                          ? "text-[#0075c3]"
                          : "text-[#7B8798]"
                      }`}
                    >
                      {value}
                    </span>
                    <span className="text-[11px] text-[#94A3B8]">{desc}</span>
                  </button>
                ))}
              </div>
            </section>

            <div className="h-px bg-[#F3F6FA]" />

            {/* 학습 상황 */}
            <section>
              <h2 className="mb-1 text-[15px] font-semibold tracking-[-0.02em] text-[#0B1B3B]">
                학습 상황{" "}
                <span className="text-[13px] font-normal text-[#94A3B8]">
                  (선택)
                </span>
              </h2>
              <p className="mb-3 text-[13px] text-[#94A3B8]">
                현재 상황을 알려주시면 더 정확한 플랜을 만들어 드려요.
              </p>
              <textarea
                value={personalStory}
                onChange={(e) => setPersonalStory(e.target.value)}
                placeholder="예: 평일에는 시간이 부족하고 주말에 집중해서 공부하고 싶어요."
                className="min-h-[100px] w-full resize-none rounded-[10px] border border-[#E8EDF5] bg-white px-4 py-3 text-[14px] leading-6 text-[#0B1B3B] outline-none transition placeholder:text-[#C5CFDA] focus:border-[#0075c3]"
              />
            </section>

            {/* 생성 버튼 */}
            <div>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading || !isValid}
                className="inline-flex h-[50px] w-full items-center justify-center rounded-[12px] bg-[#0075c3]/80 text-[15px] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                플랜 생성하기
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.8; }
          40% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </main>
  );
}
