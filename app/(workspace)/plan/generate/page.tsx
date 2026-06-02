"use client";

import { generatePlan } from "@/app/api/plan/plan";
import { ArrowLeft, Minus, Plus, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const DAYS = [
  { key: "MON", label: "월" },
  { key: "TUE", label: "화" },
  { key: "WED", label: "수" },
  { key: "THU", label: "목" },
  { key: "FRI", label: "금" },
  { key: "SAT", label: "토" },
  { key: "SUN", label: "일" },
] as const;

type DayKey = (typeof DAYS)[number]["key"];

const LEVEL_MAP: Record<string, string> = {
  BEGINNER: "초급",
  INTERMEDIATE: "중급",
  ADVANCED: "고급",
  초급: "초급",
  중급: "중급",
  고급: "고급",
};

const SKILL_LEVELS = [
  { value: "초급", desc: "처음 시작" },
  { value: "중급", desc: "기본 이해" },
  { value: "고급", desc: "실전 위주" },
] as const;

function getDday(dateStr: string) {
  if (!dateStr) return "";

  const [year, month, day] = dateStr.split("-").map(Number);
  const target = new Date(year, month - 1, day);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.ceil((target.getTime() - today.getTime()) / 86400000);

  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return "D-Day";
  return `D+${Math.abs(diff)}`;
}

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
  const [skillLevel, setSkillLevel] = useState(
    LEVEL_MAP[rawSkillLevel] || "중급"
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

  const totalWeeklyHours = useMemo(
    () => Object.values(weeklySchedule).reduce((sum, hours) => sum + hours, 0),
    [weeklySchedule]
  );
  const dday = useMemo(() => getDday(examDate), [examDate]);
  const isValid =
    examTaskId > 0 &&
    certificationName.trim() !== "" &&
    skillLevel.trim() !== "" &&
    examDate.trim() !== "" &&
    totalWeeklyHours > 0;

  const setDayHours = (key: DayKey, value: number) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      [key]: Math.max(0, Math.min(12, Number.isNaN(value) ? 0 : value)),
    }));
  };

  const handleGenerate = async () => {
    if (!isValid || loading) return;

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
    } catch (error) {
      console.error("플랜 생성 실패:", error);
      router.push("/plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F9FB] pb-8 lg:bg-white lg:pt-8">
      {loading && (
        <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center gap-5 bg-white/92 px-6 text-center backdrop-blur-sm">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((item) => (
              <span
                key={item}
                className="h-2 w-2 animate-bounce rounded-full bg-[#4876EF]"
                style={{ animationDelay: `${item * 120}ms` }}
              />
            ))}
          </div>
          <div>
            <p className="text-[16px] font-semibold text-[#252A32]">
              AI가 맞춤 플랜을 만들고 있어요
            </p>
            <p className="mt-1 text-[13px] leading-[1.6] text-[#8A94A6]">
              시험일과 학습 시간을 기준으로 일정을 정리하는 중이에요.
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-[430px] px-4 pb-8 pt-4 lg:max-w-[1100px] lg:px-6">
        <header className="mb-4 flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="back"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-white text-[#252A32] active:bg-[#EEF2F7]"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-[#4876EF]">
              AI 맞춤 플랜 생성
            </p>
            <h1 className="truncate text-[18px] font-semibold text-[#252A32]">
              {certificationName || "플랜 생성"}
            </h1>
          </div>
        </header>

        <div className="mb-3 hidden items-center gap-1.5 text-[12px] font-semibold text-[#4876EF] lg:inline-flex">
          <Sparkles className="h-3.5 w-3.5" />
          AI 맞춤 플랜 생성
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_360px] lg:gap-12">
          <section className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-4 lg:border-0 lg:px-0 lg:py-0">
            <div className="hidden lg:block">
              <h1 className="text-[24px] font-bold tracking-[-0.04em] text-[#252A32]">
                {certificationName || "플랜 생성"}
              </h1>
              <p className="mt-1.5 text-[14px] leading-6 text-[#8A94A6]">
                시험일과 요일별 학습 시간을 설정하면 AI가 맞춤 플랜을 생성해드려요.
              </p>
            </div>

            <label className="block lg:mt-6">
              <span className="text-[14px] font-semibold text-[#252A32]">
                시험일
              </span>
              <input
                type="date"
                value={examDate}
                onChange={(event) => setExamDate(event.target.value)}
                className="mt-2 h-11 w-full rounded-[8px] border border-[#D8DDE6] bg-white px-3 text-[14px] text-[#252A32] outline-none focus:border-[#4876EF]"
              />
              {dday && (
                <span className="mt-2 inline-flex rounded-full bg-[#EEF4FF] px-2.5 py-1 text-[12px] font-semibold text-[#4876EF]">
                  {dday}
                </span>
              )}
            </label>

            <div className="mt-6">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h2 className="text-[14px] font-semibold text-[#252A32]">
                    요일별 학습 시간
                  </h2>
                  <p className="mt-1 text-[12px] text-[#8A94A6]">
                    0시간은 휴식일로 처리돼요.
                  </p>
                </div>
                <span className="shrink-0 text-[12px] font-medium text-[#667085]">
                  주 {totalWeeklyHours}시간
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                {DAYS.map((day) => {
                  const hours = weeklySchedule[day.key];
                  const isRest = hours === 0;

                  return (
                    <div
                      key={day.key}
                      className={`rounded-[8px] border px-3 py-3 ${
                        isRest
                          ? "border-[#EEF2F7] bg-[#FAFBFC]"
                          : "border-[#C8D9FF] bg-[#F5F8FF]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[12px] font-semibold ${
                            isRest ? "text-[#A0AEC0]" : "text-[#4876EF]"
                          }`}
                        >
                          {day.label}
                        </span>
                        <span className="text-[11px] font-medium text-[#98A2B3]">
                          시간
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setDayHours(day.key, hours - 1)}
                          disabled={hours === 0}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D8DDE6] bg-white text-[#667085] disabled:opacity-30"
                          aria-label={`${day.label} 줄이기`}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <input
                          type="number"
                          min={0}
                          max={12}
                          value={hours}
                          onChange={(event) =>
                            setDayHours(day.key, Math.floor(Number(event.target.value)))
                          }
                          className="w-10 bg-transparent text-center text-[22px] font-semibold leading-none text-[#252A32] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <button
                          type="button"
                          onClick={() => setDayHours(day.key, hours + 1)}
                          disabled={hours >= 12}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D8DDE6] bg-white text-[#667085] disabled:opacity-30"
                          aria-label={`${day.label} 늘리기`}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-4">
            <h2 className="text-[14px] font-semibold text-[#252A32]">
              현재 수준
            </h2>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {SKILL_LEVELS.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setSkillLevel(level.value)}
                  className={`rounded-[8px] border px-2 py-3 text-center ${
                    skillLevel === level.value
                      ? "border-[#4876EF] bg-[#EEF4FF] text-[#4876EF]"
                      : "border-[#E5E8EB] bg-white text-[#667085]"
                  }`}
                >
                  <span className="block text-[14px] font-semibold">
                    {level.value}
                  </span>
                  <span className="mt-1 block text-[11px] font-medium">
                    {level.desc}
                  </span>
                </button>
              ))}
            </div>

            <label className="mt-6 block">
              <span className="text-[14px] font-semibold text-[#252A32]">
                학습 상황 <span className="font-normal text-[#98A2B3]">(선택)</span>
              </span>
              <textarea
                value={personalStory}
                onChange={(event) => setPersonalStory(event.target.value)}
                placeholder="평일에는 시간이 부족하고 주말에 집중해서 공부하고 싶어요."
                className="mt-2 min-h-[110px] w-full resize-none rounded-[8px] border border-[#D8DDE6] bg-white px-3 py-3 text-[14px] leading-6 text-[#252A32] outline-none placeholder:text-[#B3BBC8] focus:border-[#4876EF]"
              />
            </label>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading || !isValid}
              className="mt-5 flex h-12 w-full items-center justify-center rounded-[8px] bg-[#4876EF] text-[14px] font-semibold text-white active:bg-[#3F68D8] disabled:cursor-not-allowed disabled:opacity-40"
            >
              플랜 생성하기
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
