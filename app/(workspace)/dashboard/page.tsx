"use client";

import { useEffect, useMemo, useState } from "react";
import QuickTabs from "@/components/ui/quckTabs";

import { useRouter } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Target,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

import { getDashboard } from "@/app/api/service/dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type DashboardData = {
  currentStudyPlan: {
    completed: boolean;
    dailyPlanId: number;
    date: string;
    topic: string;
    weekNumber: number;
    weeklyGoal: string;
    weeklyPlanId: number;
  };
  planProgress: {
    completedPlanDays: number;
    totalPlanDays: number;
  };
  roadmapProgress: {
    completedTasks: number;
    totalTasks: number;
  };
};

function getPercent(done: number, total: number) {
  if (!total) return 0;
  return Math.round((done / total) * 100);
}

export default function DashboardPage() {
  const router = useRouter();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const [completed, setCompleted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isGoalOpen, setIsGoalOpen] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const result = await getDashboard();

        const hasValidData =
          result &&
          result.currentStudyPlan &&
          typeof result.currentStudyPlan.topic === "string" &&
          result.currentStudyPlan.topic.trim() !== "" &&
          result.planProgress &&
          result.roadmapProgress;

        if (!hasValidData) {
          setData(null);
          return;
        }

        setData(result);
        setCompleted(result.currentStudyPlan.completed);
        setSelectedDate(new Date(result.currentStudyPlan.date));
      } catch (error) {
        console.error("대시보드 불러오기 실패:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleGoToPlanner = () => {
    if (!data) return;
    router.push(`/planner?planId=${data.currentStudyPlan.dailyPlanId}`);
  };

  const handleGoToRoadmap = () => {
    router.push("/roadmap");
  };

  const handleGoToGenerate = () => {
    router.push("/roadmap/generate");
  };

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCompleted((prev) => !prev);

    // 나중에 PATCH 연결
  };

  const handleToggleGoal = () => {
    setIsGoalOpen((prev) => !prev);
  };

  const planPercent = useMemo(() => {
    if (!data) return 0;
    return getPercent(
      data.planProgress.completedPlanDays,
      data.planProgress.totalPlanDays,
    );
  }, [data]);

  const roadmapPercent = useMemo(() => {
    if (!data) return 0;
    return getPercent(
      data.roadmapProgress.completedTasks,
      data.roadmapProgress.totalTasks,
    );
  }, [data]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fafaf8] p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="h-10 w-40 animate-pulse rounded-xl bg-neutral-200" />
          <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
            <div className="h-[340px] animate-pulse rounded-3xl bg-neutral-200" />
            <div className="h-[340px] animate-pulse rounded-3xl bg-neutral-200" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-44 animate-pulse rounded-3xl bg-neutral-200" />
            <div className="h-44 animate-pulse rounded-3xl bg-neutral-200" />
          </div>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#fafaf8] p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="space-y-10">
            <p className="text-sm text-neutral-500">Dashboard</p>
            <QuickTabs />

            <h1 className="text-3xl font-bold tracking-tight text-black">
              오늘의 학습 현황
            </h1>
          </div>

          <Card className="rounded-3xl border-0 bg-white shadow-sm">
            <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 rounded-2xl bg-[#f5f5f2] p-4">
                <BookOpen className="h-7 w-7 text-black" />
              </div>

              <h2 className="text-2xl font-semibold text-black">
                아직 생성된 로드맵과 학습 플랜이 없어요
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-neutral-500">
                먼저 로드맵을 생성하면 자격증 일정과 학습 플랜이 연결된
                대시보드를 확인할 수 있어요.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={handleGoToGenerate}
                  className="rounded-2xl px-6"
                >
                  로드맵 생성하기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const { currentStudyPlan, planProgress, roadmapProgress } = data;

  return (
    <main className="min-h-screen bg-[#fafaf8] p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-10">
          <p className="text-sm text-neutral-500">Dashboard</p>
          <QuickTabs />

          <h1 className="text-3xl font-bold tracking-tight text-black">
            오늘의 학습 현황
          </h1>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <Card
            onClick={handleGoToPlanner}
            className="cursor-pointer rounded-3xl border-0 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <CardDescription className="text-sm text-neutral-500">
                    Today&apos;s Study Plan
                  </CardDescription>
                  <CardTitle className="text-3xl font-semibold tracking-tight text-black">
                    {currentStudyPlan.topic}
                  </CardTitle>
                  <p className="text-sm text-neutral-500">
                    {currentStudyPlan.weekNumber}주차 학습
                  </p>
                </div>

                <Badge
                  onClick={handleToggleComplete}
                  variant={completed ? "default" : "secondary"}
                  className="cursor-pointer rounded-full px-4 py-1 text-xs hover:opacity-80"
                >
                  {completed ? "완료" : "진행 중"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleGoal();
                }}
                className="flex w-full items-center justify-between rounded-2xl bg-[#f5f5f2] p-5 text-left transition hover:bg-[#efefea]"
              >
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm text-neutral-500">
                    <Target className="h-4 w-4" />
                    이번 주 목표
                  </div>
                  <p className="text-lg font-medium text-black">
                    {currentStudyPlan.weeklyGoal}
                  </p>
                </div>

                <div className="ml-4 shrink-0 text-neutral-500">
                  {isGoalOpen ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </div>
              </button>

              {isGoalOpen && (
                <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm leading-6 text-neutral-600">
                  현재 학습 주제를 중심으로 이번 주 목표를 진행 중이에요. 이
                  카드를 클릭하면 플래너 페이지로 이동해서 세부 계획을 볼 수
                  있어요. **나중에 세부계획도 넣기**
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm text-neutral-500">
                    <CheckCircle2 className="h-4 w-4" />
                    학습 상태
                  </div>
                  <p className="text-base font-semibold text-black">
                    {completed ? "오늘 학습 완료" : "오늘 학습 진행 중"}
                  </p>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm text-neutral-500">
                    <BookOpen className="h-4 w-4" />
                    이동
                  </div>
                  <p className="text-base font-semibold text-black">
                    클릭해서 플래너 상세 보기
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 bg-white shadow-sm">
            <CardHeader>
              <CardDescription className="text-neutral-500">
                Study Calendar
              </CardDescription>
              <CardTitle className="text-2xl font-semibold text-black">
                학습 날짜
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start rounded-2xl border-neutral-200 bg-white text-left font-normal",
                      !selectedDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {selectedDate
                      ? format(selectedDate, "yyyy년 M월 d일", { locale: ko })
                      : "날짜를 선택하세요"}
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  className="w-auto rounded-2xl p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <div className="rounded-2xl bg-[#f5f5f2] p-4">
                <p className="mb-1 text-sm text-neutral-500">
                  현재 학습 기준일
                </p>
                <p className="font-semibold text-black">
                  {selectedDate
                    ? format(selectedDate, "M월 d일 EEEE", { locale: ko })
                    : "-"}
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-200 p-4">
                <p className="mb-1 text-sm text-neutral-500">연결된 주차</p>
                <p className="font-semibold text-black">
                  {currentStudyPlan.weekNumber}주차 학습 플랜
                </p>
              </div>

              <p className="text-xs leading-5 text-neutral-500"></p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card
            onClick={handleGoToPlanner}
            className="cursor-pointer rounded-3xl border-0 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription>Plan Progress</CardDescription>
                  <CardTitle className="text-xl">플랜 진행률</CardTitle>
                </div>
                <div className="rounded-2xl bg-[#f5f5f2] p-3">
                  <TrendingUp className="h-5 w-5 text-black" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-end justify-between gap-4">
                <p className="text-4xl font-bold text-black">{planPercent}%</p>
                <p className="text-sm text-neutral-500">
                  {planProgress.completedPlanDays} /{" "}
                  {planProgress.totalPlanDays}일
                </p>
              </div>

              <Progress value={planPercent} className="h-3 rounded-full" />

              <p className="text-sm text-neutral-500">
                클릭하면 플래너 페이지로 이동해요.
              </p>
            </CardContent>
          </Card>

          <Card
            onClick={handleGoToRoadmap}
            className="cursor-pointer rounded-3xl border-0 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription>Roadmap Progress</CardDescription>
                  <CardTitle className="text-xl">로드맵 진행률</CardTitle>
                </div>
                <div className="rounded-2xl bg-[#f5f5f2] p-3">
                  <BookOpen className="h-5 w-5 text-black" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-end justify-between gap-4">
                <p className="text-4xl font-bold text-black">
                  {roadmapPercent}%
                </p>
                <p className="text-sm text-neutral-500">
                  {roadmapProgress.completedTasks} /{" "}
                  {roadmapProgress.totalTasks}개
                </p>
              </div>

              <Progress value={roadmapPercent} className="h-3 rounded-full" />

              <p className="text-sm text-neutral-500">
                클릭하면 로드맵 페이지로 이동해요.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
