"use client";

import {
  checkDailyPlan,
  deletePlan,
  getPlanByExamTaskId,
  getPlanTabs,
} from "@/app/api/plan/plan";
import type { DailyPlan, PlanResponse, PlanTab, WeeklyPlan } from "@/app/api/plan/types";
import { completeTask } from "@/app/api/roadmap/roadmap";
import { ToastContainer, useToast } from "@/components/common/Toast";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type LoadState = "loading" | "success" | "error";

function formatStudyDate(studyDate: string) {
  if (!studyDate) return "-";
  return studyDate.slice(0, 10).replace(/-/g, ".");
}

function getTodayInSeoul() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function getWeekContainingToday(plan: PlanResponse | null) {
  if (!plan) return 1;

  const today = getTodayInSeoul();
  const matchedWeek = plan.weeklyPlans.find((week) =>
    week.dailyPlans.some((day) => day.studyDate.slice(0, 10) === today)
  );

  return matchedWeek?.weekNumber ?? plan.weeklyPlans[0]?.weekNumber ?? 1;
}

function getProgress(plan: PlanResponse | null) {
  const studyDays =
    plan?.weeklyPlans.flatMap((week) => week.dailyPlans).filter((day) => !day.isRest) ??
    [];

  if (!studyDays.length) {
    return { total: 0, done: 0, percent: 0 };
  }

  const done = studyDays.filter((day) => day.isCompleted).length;
  return {
    total: studyDays.length,
    done,
    percent: Math.round((done / studyDays.length) * 100),
  };
}

function getExamDateFromPlan(plan: PlanResponse | null) {
  const dates =
    plan?.weeklyPlans
      .flatMap((week) => week.dailyPlans)
      .map((day) => formatStudyDate(day.studyDate))
      .filter((date) => date !== "-")
      .sort() ?? [];

  return dates[dates.length - 1] ?? "";
}

function getDday(date: string) {
  if (!date) return "";

  const [year, month, day] = date.split(".").map(Number);
  const target = new Date(year, month - 1, day);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.ceil((target.getTime() - today.getTime()) / 86400000);

  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return "D-Day";
  return `D+${Math.abs(diff)}`;
}

function getTodayPlan(plan: PlanResponse | null) {
  if (!plan) return null;

  const today = getTodayInSeoul();

  for (const week of plan.weeklyPlans) {
    const todayPlan = week.dailyPlans.find(
      (day) => day.studyDate.slice(0, 10) === today && !day.isRest
    );

    if (todayPlan) return { week, day: todayPlan };
  }

  for (const week of plan.weeklyPlans) {
    const nextPlan = week.dailyPlans.find((day) => !day.isCompleted && !day.isRest);
    if (nextPlan) return { week, day: nextPlan };
  }

  return null;
}

function PlanSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[430px] space-y-3 pb-7">
      <div className="flex gap-2 overflow-hidden">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-9 w-28 shrink-0 animate-pulse rounded-[8px] bg-[#EEF2F7]" />
        ))}
      </div>
      <div className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-4">
        <div className="h-4 w-28 animate-pulse rounded bg-[#EEF2F7]" />
        <div className="mt-3 h-6 w-44 animate-pulse rounded bg-[#F3F6FA]" />
        <div className="mt-4 h-2 w-full animate-pulse rounded-full bg-[#EEF2F7]" />
      </div>
      {[1, 2, 3].map((item) => (
        <div key={item} className="h-24 animate-pulse rounded-[8px] bg-white" />
      ))}
    </div>
  );
}

function EmptyPlan() {
  return (
    <section className="mx-auto flex min-h-[52vh] w-full max-w-[430px] flex-col items-center justify-center rounded-[8px] border border-[#E5E8EB] bg-white px-5 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#EEF4FF] text-[#4876EF]">
        <CalendarCheck className="h-6 w-6" />
      </div>
      <h1 className="mt-5 text-[18px] font-semibold text-[#252A32]">
        아직 생성된 플랜이 없어요
      </h1>
      <p className="mt-2 max-w-[280px] text-[13px] leading-[1.6] text-[#8A94A6]">
        로드맵에서 자격증 항목을 선택하면 오늘부터 따라갈 학습 플랜을 만들 수 있어요.
      </p>
      <Link
        href="/roadmap"
        className="mt-6 flex min-h-11 w-full max-w-[260px] items-center justify-center gap-1 rounded-[8px] bg-[#4876EF] px-5 text-[13px] font-medium text-white"
      >
        로드맵에서 만들기
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}

function PlanTabsMobile({
  tabs,
  selectedExamTaskId,
  onSelect,
}: {
  tabs: PlanTab[];
  selectedExamTaskId: number | null;
  onSelect: (examTaskId: number) => void;
}) {
  return (
    <div className="flex snap-x gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {tabs.map((tab) => {
        const active = selectedExamTaskId === tab.examTaskId;

        return (
          <button
            key={tab.examTaskId}
            type="button"
            onClick={() => onSelect(tab.examTaskId)}
            className={`min-h-9 max-w-[180px] shrink-0 snap-start truncate rounded-[8px] px-3 text-[12px] font-semibold ${
              active
                ? "bg-[#4876EF] text-white"
                : "border border-[#E5E8EB] bg-white text-[#667085]"
            }`}
          >
            {tab.taskName}
          </button>
        );
      })}
    </div>
  );
}

function SummaryCard({
  plan,
  onDelete,
  onComplete,
}: {
  plan: PlanResponse;
  onDelete: () => void;
  onComplete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const progress = getProgress(plan);
  const examDate = getExamDateFromPlan(plan);
  const dday = getDday(examDate);

  return (
    <section className="overflow-hidden rounded-[8px] border border-[#E5E8EB] bg-white">
      <div className="px-4 py-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[12px] font-semibold text-[#4876EF]">나의 플랜</p>
              {dday && (
                <span className="rounded-full bg-[#EEF4FF] px-2 py-0.5 text-[11px] font-semibold text-[#4876EF]">
                  {dday}
                </span>
              )}
            </div>
            <h1 className="mt-1.5 line-clamp-2 text-[17px] font-semibold leading-snug tracking-tight text-[#252A32]">
              {plan.taskName}
            </h1>
            {examDate && (
              <p className="mt-1 text-[12px] font-medium text-[#667085]">
                시험일 {examDate}
              </p>
            )}
          </div>

          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="plan menu"
              aria-expanded={menuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-[8px] text-[#252A32] active:bg-[#EEF2F7]"
            >
              <MoreHorizontal className="h-4.5 w-4.5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-10 z-20 w-32 overflow-hidden rounded-[8px] border border-[#E5E8EB] bg-white p-1 shadow-[0_12px_28px_rgba(15,23,42,0.12)]">
                <Link
                  href="/plan/generate"
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-9 items-center rounded-[6px] px-3 text-[12px] font-medium text-[#344054] active:bg-[#F7F9FB]"
                >
                  재설정하기
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onComplete();
                  }}
                  className="flex min-h-9 w-full items-center rounded-[6px] px-3 text-left text-[12px] font-medium text-[#344054] active:bg-[#F7F9FB]"
                >
                  완료하기
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete();
                  }}
                  className="flex min-h-9 w-full items-center gap-1 rounded-[6px] px-3 text-left text-[12px] font-medium text-[#B42318] active:bg-[#FFF8F8]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  삭제하기
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3">
          <div className="mb-2 flex items-center justify-between text-[12px]">
            <span className="font-medium text-[#667085]">완료율</span>
            <span className="font-semibold text-[#252A32]">{progress.percent}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#E8EEF9]">
            <div
              className="h-full rounded-full bg-[#4876EF] transition-all"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-[#EEF2F7] bg-[#FBFCFE]">
        <div className="px-4 py-2.5">
          <p className="text-[11px] text-[#8A94A6]">전체</p>
          <p className="mt-0.5 text-[15px] font-semibold text-[#252A32]">
            {progress.total}
          </p>
        </div>
        <div className="border-l border-[#EEF2F7] px-4 py-2.5">
          <p className="text-[11px] text-[#8A94A6]">완료</p>
          <p className="mt-0.5 text-[15px] font-semibold text-[#4876EF]">
            {progress.done}
          </p>
        </div>
        <div className="border-l border-[#EEF2F7] px-4 py-2.5">
          <p className="text-[11px] text-[#8A94A6]">주차</p>
          <p className="mt-0.5 text-[15px] font-semibold text-[#64748B]">
            {plan.totalWeeks}
          </p>
        </div>
      </div>
    </section>
  );
}

function TodayCard({
  plan,
  onToggleComplete,
}: {
  plan: PlanResponse;
  onToggleComplete: (dailyPlanId: number) => void;
}) {
  const today = getTodayPlan(plan);

  if (!today) return null;

  return (
    <section className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-4 shadow-[0_4px_14px_rgba(15,23,42,0.04)]">
      <p className="text-[12px] font-semibold text-[#8A94A6]">오늘의 플랜</p>
      <div className="mt-2 flex items-center gap-2">
        <span className="rounded-full bg-[#EEF4FF] px-2.5 py-1 text-[11px] font-medium text-[#4876EF]">
          W{today.week.weekNumber} / D{today.day.dayNumber}
        </span>
        <span className="text-[12px] font-medium text-[#8A94A6]">
          {today.day.estimatedHours}시간
        </span>
      </div>
      <h2 className="mt-3 line-clamp-2 text-[16px] font-semibold leading-snug text-[#252A32]">
        {today.day.topic || plan.taskName}
      </h2>
      <p className="mt-2 line-clamp-3 text-[13px] leading-[1.6] text-[#667085]">
        {today.day.description || "오늘 학습 계획을 확인해보세요."}
      </p>
      <button
        type="button"
        onClick={() => onToggleComplete(today.day.dailyPlanId)}
        className={`mt-4 flex min-h-10 w-full items-center justify-center gap-1 rounded-[8px] text-[12px] font-medium ${
          today.day.isCompleted
            ? "border border-[#DDE2EA] bg-white text-[#8A94A6]"
            : "bg-[#4876EF] text-white"
        }`}
      >
        <CheckCircle2 className="h-4 w-4" />
        {today.day.isCompleted ? "완료 해제" : "완료하기"}
      </button>
    </section>
  );
}

function WeekSelector({
  weeks,
  selectedWeek,
  onSelect,
}: {
  weeks: WeeklyPlan[];
  selectedWeek: number;
  onSelect: (week: number) => void;
}) {
  return (
    <div className="flex snap-x gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {weeks.map((week) => {
        const active = selectedWeek === week.weekNumber;

        return (
          <button
            key={week.weeklyPlanId}
            type="button"
            onClick={() => onSelect(week.weekNumber)}
            className={`min-h-9 shrink-0 snap-start rounded-[8px] px-3 text-[12px] font-medium ${
              active ? "bg-[#252A32] text-white" : "bg-white text-[#667085]"
            }`}
          >
            Week {week.weekNumber}
          </button>
        );
      })}
    </div>
  );
}

function DailyCard({
  day,
  weekNumber,
  onToggleComplete,
}: {
  day: DailyPlan;
  weekNumber: number;
  onToggleComplete: (dailyPlanId: number) => void;
}) {
  const isRest = day.isRest;

  return (
    <article className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-4 shadow-[0_3px_12px_rgba(15,23,42,0.035)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                isRest
                  ? "bg-[#E8DCC6]"
                  : day.isCompleted
                    ? "bg-[#C9D2E3]"
                    : "bg-[#4876EF]"
              }`}
            />
            <p className="text-[12px] font-medium text-[#8A94A6]">
              W{weekNumber} / D{day.dayNumber} · {formatStudyDate(day.studyDate)}
            </p>
          </div>
          <h3 className="mt-2 line-clamp-2 text-[14px] font-semibold leading-[1.45] text-[#252A32]">
            {day.topic || (isRest ? "휴식일" : "학습 계획")}
          </h3>
          <p className="mt-2 line-clamp-3 text-[12px] leading-[1.6] text-[#667085]">
            {day.description ||
              (isRest ? "가볍게 쉬어가며 학습 리듬을 정리하는 날이에요." : "상세 설명이 없어요.")}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-[#F7F9FB] px-2.5 py-1 text-[11px] font-medium text-[#8A94A6]">
          {isRest ? "-" : `${day.estimatedHours}h`}
        </span>
      </div>

      {!isRest && (
        <button
          type="button"
          onClick={() => onToggleComplete(day.dailyPlanId)}
          className={`mt-3 flex min-h-9 w-full items-center justify-center gap-1 rounded-[8px] text-[12px] font-medium ${
            day.isCompleted
              ? "border border-[#DDE2EA] bg-white text-[#8A94A6]"
              : "bg-[#EEF4FF] text-[#4876EF]"
          }`}
        >
          {day.isCompleted ? "완료 해제" : "완료하기"}
        </button>
      )}
    </article>
  );
}

export default function MobilePlanPage() {
  const router = useRouter();
  const [tabs, setTabs] = useState<PlanTab[]>([]);
  const [selectedExamTaskId, setSelectedExamTaskId] = useState<number | null>(null);
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [planLoading, setPlanLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { show: showToast } = useToast();

  useEffect(() => {
    let mounted = true;

    async function loadTabs() {
      try {
        setLoadState("loading");
        const data = await getPlanTabs();
        if (!mounted) return;

        setTabs(data);
        setSelectedExamTaskId(data[0]?.examTaskId ?? null);
        setLoadState("success");
      } catch {
        if (!mounted) return;
        setLoadState("error");
        setErrorMessage("플랜을 불러오지 못했어요.");
      }
    }

    void loadTabs();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (selectedExamTaskId == null) {
      setPlan(null);
      return;
    }

    let mounted = true;

    async function loadPlan() {
      try {
        setPlanLoading(true);
        const data = await getPlanByExamTaskId(selectedExamTaskId as number);
        if (!mounted) return;

        setPlan(data);
        setSelectedWeek(getWeekContainingToday(data));
      } catch {
        if (!mounted) return;
        setPlan(null);
        setErrorMessage("플랜 상세 정보를 불러오지 못했어요.");
      } finally {
        if (mounted) setPlanLoading(false);
      }
    }

    void loadPlan();

    return () => {
      mounted = false;
    };
  }, [selectedExamTaskId]);

  const selectedWeeklyPlan = useMemo(() => {
    return plan?.weeklyPlans.find((week) => week.weekNumber === selectedWeek) ?? null;
  }, [plan, selectedWeek]);

  const refreshPlan = async () => {
    if (selectedExamTaskId == null) return;
    const data = await getPlanByExamTaskId(selectedExamTaskId);
    setPlan(data);
  };

  const handleToggleComplete = async (dailyPlanId: number) => {
    try {
      await checkDailyPlan(dailyPlanId);
      await refreshPlan();
      showToast("플랜 상태를 변경했어요.");
    } catch {
      showToast("플랜 상태 변경 중 오류가 발생했어요.", "error");
    }
  };

  const handleDelete = async () => {
    if (selectedExamTaskId == null) return;
    if (!window.confirm("이 플랜을 삭제할까요?")) return;

    try {
      await deletePlan(selectedExamTaskId);
      const nextTabs = await getPlanTabs();
      setTabs(nextTabs);
      setSelectedExamTaskId(nextTabs[0]?.examTaskId ?? null);
      showToast("플랜을 삭제했어요.");
    } catch {
      showToast("플랜 삭제 중 오류가 발생했어요.", "error");
    }
  };

  const handleCompletePlan = async () => {
    if (selectedExamTaskId == null) return;

    try {
      await completeTask(selectedExamTaskId);
      const nextTabs = await getPlanTabs();
      setTabs(nextTabs);
      setSelectedExamTaskId(nextTabs[0]?.examTaskId ?? null);
      showToast("자격증 취득 완료 처리했어요.");
    } catch {
      showToast("완료 처리 중 오류가 발생했어요.", "error");
    }
  };

  if (loadState === "loading") return <PlanSkeleton />;

  if (loadState === "error") {
    return (
      <div className="mx-auto w-full max-w-[430px] rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-8 text-center">
        <p className="text-[15px] font-medium text-[#252A32]">{errorMessage}</p>
        <button
          type="button"
          onClick={() => router.refresh()}
          className="mt-4 min-h-10 rounded-[8px] bg-[#4876EF] px-4 text-[13px] font-medium text-white"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!tabs.length) return <EmptyPlan />;

  return (
    <div className="mx-auto flex w-full max-w-[430px] flex-col gap-4 pb-7">
      <PlanTabsMobile
        tabs={tabs}
        selectedExamTaskId={selectedExamTaskId}
        onSelect={setSelectedExamTaskId}
      />

      {planLoading || !plan ? (
        <PlanSkeleton />
      ) : (
        <>
          <SummaryCard
            plan={plan}
            onDelete={handleDelete}
            onComplete={handleCompletePlan}
          />
          <TodayCard plan={plan} onToggleComplete={handleToggleComplete} />

          <section className="space-y-3">
            <div>
              <h2 className="mb-2 text-[16px] font-semibold text-[#252A32]">
                주간 플랜
              </h2>
              <WeekSelector
                weeks={plan.weeklyPlans}
                selectedWeek={selectedWeek}
                onSelect={setSelectedWeek}
              />
            </div>

            <div className="space-y-2">
              {selectedWeeklyPlan?.dailyPlans.map((day) => (
                <DailyCard
                  key={day.dailyPlanId}
                  day={day}
                  weekNumber={selectedWeeklyPlan.weekNumber}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </div>
          </section>
        </>
      )}

      <ToastContainer />
    </div>
  );
}
