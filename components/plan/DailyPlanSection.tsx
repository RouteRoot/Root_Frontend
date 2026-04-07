"use client";

import { CheckCircle2 } from "lucide-react";

type DailyPlanMock = {
  day: number;
  week: number;
  title: string;
  description: string;
  date: string;
  hours: number;
  examDate: string;
};

const mockDailyPlan: DailyPlanMock = {
  day: 1,
  week: 1,
  title: "소프트웨어 공학",
  description:
    "소프트웨어 개발 생명주기와 모델, 요구사항 분석 기법 학습. 개념 이해 후 간단한 예제 풀어보기.",
  date: "2026.04.07",
  hours: 3,
  examDate: "2026.04.22",
};

function getDday(examDate: string) {
  const [y, m, d] = examDate.split(".").map(Number);
  const target = new Date(y, m - 1, d);

  const today = new Date();
  const base = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const diff = Math.ceil((target.getTime() - base.getTime()) / 86400000);

  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return "D-Day";
  return `D+${Math.abs(diff)}`;
}

export default function DailyPlanSection() {
  const dday = getDday(mockDailyPlan.examDate);

  return (
    <section className="w-full">
      {/* 타이틀 */}
      <div className="mb-4 w-full max-w-[505px]">
        <div className="flex items-center gap-4">
          <h2 className="text-[32px] font-extrabold tracking-[-0.04em] text-[#0B1B3B]">
            DAILY PLAN
          </h2>
          <div className="h-px flex-1 bg-[#E9EDF3]" />
        </div>
      </div>

      {/* 카드 */}
      <div className="w-full max-w-[450px] rounded-[18px] border border-[#E8EDF5] bg-white">
        {/* 헤더 */}
        <div className="border-b border-[#EEF2F7] bg-[#FBFCFE] px-4 py-4">
          <p className="text-[11px] font-semibold text-[#A0AEC0]">
            시험일까지 {dday} 남았어요
          </p>

          <p className="mt-1 text-[14px] font-bold text-[#0B1B3B]">
            Week {mockDailyPlan.week} / Day {mockDailyPlan.day} 상세 계획
          </p>
        </div>

        {/* 본문 */}
        <div className="px-4 py-4">
          <div className="grid grid-cols-[110px_1fr] gap-4">
            
            {/* 왼쪽 */}
            <div className="flex flex-col gap-3 text-[12px]">
              <div className="rounded-[10px] border border-[#EEF2F7] bg-[#FBFCFE] px-3 py-3">
                <p className="text-[11px] text-[#98A2B3]">날짜</p>
                <p className="mt-1 font-semibold text-[#0F172A]">
                  {mockDailyPlan.date}
                </p>
              </div>

              <div className="rounded-[10px] border border-[#EEF2F7] bg-[#FBFCFE] px-3 py-3">
                <p className="text-[11px] text-[#98A2B3]">예상 시간</p>
                <p className="mt-1 font-semibold text-[#0F172A]">
                  {mockDailyPlan.hours}시간
                </p>
              </div>
            </div>

            {/* 오른쪽 */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6D5DF6] opacity-30" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#6D5DF6]" />
                </span>

                <h3 className="text-[14px] font-bold text-[#0F172A]">
                  {mockDailyPlan.title}
                </h3>
              </div>

              <p className="mt-2 text-[13px] leading-6 text-[#7B8798]">
                {mockDailyPlan.description}
              </p>

              {/* 버튼 오른쪽 정렬 */}
              <div className="mt-4 flex">
                <button
                  type="button"
                  className="ml-auto inline-flex h-[32px] items-center gap-1.5 rounded-[10px] bg-[#6D5DF6] px-3 text-[12px] font-semibold text-white transition hover:opacity-90"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  완료
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}