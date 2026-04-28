"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, Sparkles } from "lucide-react";
import { generatePlan } from "@/app/api/plan/plan";

const levelMap: Record<string, string> = {
  하: "하",
  중: "중",
  상: "상",
  BEGINNER: "하",
  INTERMEDIATE: "중",
  ADVANCED: "상",
};

export default function PlanGeneratePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const examTaskId = Number(searchParams.get("examTaskId") ?? "0");
  const certificationName = searchParams.get("name") ?? "";
  const daily = Number(searchParams.get("daily") ?? "0");
  const weekly = Number(searchParams.get("weekly") ?? "0");

  const rawSkillLevel = searchParams.get("mylevel") ?? "";
  const skillLevel = levelMap[rawSkillLevel] ?? rawSkillLevel;

  const [examDate, setExamDate] = useState("");
  const [personalStory, setPersonalStory] = useState("");
  const [loading, setLoading] = useState(false);

  const weeklySchedule = useMemo(() => {
    return {
      MON: daily,
      TUE: daily,
      WED: daily,
      THU: daily,
      FRI: daily,
      SAT: daily,
      SUN: daily,
    };
  }, [daily]);

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
    <main className="mt-13 overflow-hidden bg-white flex items-center justify-center">
      <div className="w-full max-w-[920px] px-6">
        <section className="overflow-hidden rounded-[30px] border border-[#ECEAF3] bg-white shadow-[0_12px_40px_rgba(39,29,79,0.06)]">
          <div className="border-b border-[#F1EFF7] bg-[linear-gradient(180deg,#FAF8FF_0%,#FFFFFF_100%)] px-6 py-7 md:px-8">
            <div className="flex flex-col gap-4">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#E7E0FF] bg-[#F7F3FF] px-3 py-1 text-[12px] font-semibold text-[#7C3AED]">
                <Sparkles className="h-3.5 w-3.5" />
                맞춤형 플래너 생성
              </div>

              <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-[#1F2937] md:text-[28px]">
                {certificationName}
              </h2>

              <p className="text-[14px] leading-6 text-[#6B7280]">
                시험일만 입력하면 남은 기간을 기준으로 학습 플랜을 자동으로 생성해드려요.
              </p>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-8 md:grid-cols-[1.2fr_0.8fr] md:px-8">
            <div>
              <div className="rounded-[24px] border border-[#EFECF6] bg-[#FCFBFE] p-5">
                <div className="mb-5 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-[#7C3AED]" />
                  <h3 className="text-[17px] font-semibold text-[#1F2937]">
                    시험일 입력
                  </h3>
                </div>

                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="
                    h-[54px] w-full rounded-2xl border border-[#E5E7EB] bg-white
                    px-4 text-[15px] text-[#111827] outline-none transition
                    focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/10
                  "
                />

                <p className="mt-3 text-[13px] leading-6 text-[#6B7280]">
                  입력한 날짜를 기준으로 주차별, 일차별 계획이 자동으로 분배됩니다.
                </p>
              </div>

              <div className="mt-4 rounded-[24px] border border-[#EFECF6] bg-white p-5">
                <h3 className="mb-3 text-[17px] font-semibold text-[#1F2937]">
                  나의 학습 상황
                </h3>

                <textarea
                  value={personalStory}
                  onChange={(e) => setPersonalStory(e.target.value)}
                  placeholder="예: 평일에는 시간이 부족하고 주말에 집중해서 공부하고 싶어요."
                  className="
                    min-h-[110px] w-full resize-none rounded-2xl border border-[#E5E7EB]
                    bg-white px-4 py-3 text-[14px] leading-6 text-[#111827]
                    outline-none transition placeholder:text-[#9CA3AF]
                    focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/10
                  "
                />
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading || !isValid}
                className="
                  mt-6 inline-flex h-[56px] w-full items-center justify-center
                  rounded-2xl bg-[#7C3AED] px-6 text-[15px] font-semibold text-white
                  transition hover:bg-[#6D28D9]
                  disabled:cursor-not-allowed disabled:opacity-60
                "
              >
                {loading ? "생성 중..." : "플래너 생성하기"}
              </button>
            </div>

            <div>
              <div className="rounded-[24px] border border-[#EFECF6] bg-white p-5">
                <h3 className="mb-4 text-[17px] font-semibold text-[#1F2937]">
                  플랜 정보
                </h3>

                <div className="space-y-3">
                  <InfoRow label="자격증" value={certificationName || "-"} />
                  <InfoRow label="하루 학습 시간" value={`${daily}시간`} />
                  <InfoRow label="주간 학습 시간" value={`${weekly}시간`} />
                  <InfoRow label="현재 수준" value={rawSkillLevel || "-"} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#F3F1F8] bg-[#FCFCFD] px-4 py-3">
      <span className="text-[14px] text-[#6B7280]">{label}</span>
      <span className="text-[14px] font-semibold text-[#1F2937]">{value}</span>
    </div>
  );
}