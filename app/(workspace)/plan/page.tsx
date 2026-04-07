"use client";

import { useEffect, useMemo, useState } from "react";
import PlanTabs from "@/components/plan/PlanTabs";
import WeeklyProgressSection, {
  PlannerTask,
  TaskStatus,
} from "@/components/plan/WeeklyProgressSection";
import { getPlanTabs, getPlanByExamTaskId } from "@/app/api/plan/plan";
import type { PlanResponse, PlanTab } from "@/app/api/plan/types";

function getTodayInSeoulString(): string {
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(new Date()).replace(/-/g, ".");
}

function formatStudyDate(studyDate: string): string {
  if (!studyDate) return "-";

  if (/^\d{4}-\d{2}-\d{2}$/.test(studyDate)) {
    return studyDate.replace(/-/g, ".");
  }

  const sliced = studyDate.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(sliced)) {
    return sliced.replace(/-/g, ".");
  }

  if (/^\d{4}\.\d{2}\.\d{2}$/.test(studyDate)) {
    return studyDate;
  }

  return studyDate;
}

function mapDailyPlanStatus(
  isCompleted: boolean,
  isRest: boolean,
  formattedDate: string
): TaskStatus {
  if (isRest) return "REST";
  if (isCompleted) return "DONE";

  const todayInSeoul = getTodayInSeoulString();
  if (formattedDate === todayInSeoul) return "IN_PROGRESS";

  return "TODO";
}

function findWeekContainingToday(plan: PlanResponse | null): number {
  if (!plan) return 1;

  const todayInSeoul = getTodayInSeoulString();

  for (const weeklyPlan of plan.weeklyPlans) {
    const hasToday = weeklyPlan.dailyPlans.some(
      (dailyPlan) => formatStudyDate(dailyPlan.studyDate) === todayInSeoul
    );

    if (hasToday) {
      return weeklyPlan.weekNumber;
    }
  }

  return 1;
}

function mapPlanToPlannerTasks(plan: PlanResponse | null): PlannerTask[] {
  if (!plan) return [];

  return plan.weeklyPlans
    .flatMap((weeklyPlan) =>
      weeklyPlan.dailyPlans.map((dailyPlan) => {
        const formattedDate = formatStudyDate(dailyPlan.studyDate);

        return {
          id: dailyPlan.dailyPlanId,
          week: weeklyPlan.weekNumber,
          day: dailyPlan.dayNumber,
          title: dailyPlan.topic || (dailyPlan.isRest ? "휴식일" : plan.taskName),
          description:
            dailyPlan.description ||
            (dailyPlan.isRest
              ? "가볍게 쉬어가며 학습 리듬을 정리하는 날입니다."
              : ""),
          hours: dailyPlan.estimatedHours,
          date: formattedDate,
          status: mapDailyPlanStatus(
            dailyPlan.isCompleted,
            dailyPlan.isRest,
            formattedDate
          ),
        };
      })
    )
    .sort((a, b) => {
      if (a.week !== b.week) return a.week - b.week;
      return a.day - b.day;
    });
}

export default function PlannerPage() {
  const [tabs, setTabs] = useState<PlanTab[]>([]);
  const [selectedExamTaskId, setSelectedExamTaskId] = useState<number | null>(
    null
  );
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);

  const [tabsLoading, setTabsLoading] = useState(true);
  const [planLoading, setPlanLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTabs = async () => {
      try {
        setTabsLoading(true);
        setError("");

        const data = await getPlanTabs();
        setTabs(data);

        if (data.length > 0) {
          setSelectedExamTaskId(data[0].examTaskId);
        } else {
          setSelectedExamTaskId(null);
          setPlan(null);
        }
      } catch (error) {
        console.error("플랜 탭 조회 실패:", error);
        setError("플랜 탭을 불러오지 못했습니다.");
      } finally {
        setTabsLoading(false);
      }
    };

    fetchTabs();
  }, []);

  useEffect(() => {
    if (selectedExamTaskId == null) return;

    const fetchPlan = async () => {
      try {
        setPlanLoading(true);
        setError("");

        const data = await getPlanByExamTaskId(selectedExamTaskId);
        setPlan(data);
        setSelectedWeek(findWeekContainingToday(data));
      } catch (error) {
        console.error("플랜 상세 조회 실패:", error);
        setError("플랜 정보를 불러오지 못했습니다.");
        setPlan(null);
      } finally {
        setPlanLoading(false);
      }
    };

    fetchPlan();
  }, [selectedExamTaskId]);

  const plannerTasks = useMemo(() => mapPlanToPlannerTasks(plan), [plan]);

  const hasTabs = tabs.length > 0;
  const hasPlan = !!plan;

  return (
    <main className="min-h-screen bg-white px-4 pb-14 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <section className="mb-8">
          <PlanTabs
            tabs={tabs}
            selectedExamTaskId={selectedExamTaskId}
            onSelect={setSelectedExamTaskId}
            isLoading={tabsLoading}
          />
        </section>

        {error && (
          <div className="mb-6 rounded-[20px] border border-[#F2D6DA] bg-[#FFF8F8] px-5 py-4 text-[14px] font-medium text-[#B42318]">
            {error}
          </div>
        )}

        {!tabsLoading && !hasTabs && (
          <div className="rounded-[28px] border border-[#E8EDF5] bg-white px-8 py-12 text-center">
            <p className="text-[18px] font-bold text-[#0B1B3B]">
              아직 생성된 플랜이 없습니다.
            </p>
            <p className="mt-2 text-[14px] text-[#94A3B8]">
              로드맵에서 자격증 플랜을 먼저 생성해 주세요.
            </p>
          </div>
        )}

        {(planLoading || (hasTabs && !hasPlan)) && (
          <WeeklyProgressSection
            tasks={[]}
            selectedWeek={selectedWeek}
            onChangeWeek={setSelectedWeek}
            isLoading={true}
          />
        )}

        {!planLoading && hasPlan && (
          <WeeklyProgressSection
            tasks={plannerTasks}
            selectedWeek={selectedWeek}
            onChangeWeek={setSelectedWeek}
            isLoading={false}
          />
        )}
      </div>
    </main>
  );
}