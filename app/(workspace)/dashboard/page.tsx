"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Goal,
  Search,
  Sparkles,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type RoadmapItem = {
  id: number;
  title: string;
  progress: number;
  status: "시작 전" | "진행 중" | "완료";
  weeks: string;
};

type PlanItem = {
  id: number;
  day: string;
  title: string;
  time: string;
  done: boolean;
};

type ExamItem = {
  id: number;
  name: string;
  dday: string;
  period: string;
  status: "접수 예정" | "학습 중" | "마감 임박";
};

const roadmapData: RoadmapItem[] = [
  { id: 1, title: "정보처리기사 필기 로드맵", progress: 72, status: "진행 중", weeks: "8주 플랜" },
  { id: 2, title: "SQLD 단기 대비 로드맵", progress: 45, status: "진행 중", weeks: "4주 플랜" },
  { id: 3, title: "토익 800+ 목표 로드맵", progress: 100, status: "완료", weeks: "6주 플랜" },
];

const planData: PlanItem[] = [
  { id: 1, day: "오늘", title: "데이터베이스 정규화 복습", time: "19:00 - 20:30", done: false },
  { id: 2, day: "오늘", title: "운영체제 페이지 교체 알고리즘 문제풀이", time: "21:00 - 22:00", done: false },
  { id: 3, day: "내일", title: "정보처리기사 기출 1회", time: "10:00 - 11:30", done: true },
  { id: 4, day: "내일", title: "자기소개서 키워드 정리", time: "14:00 - 15:00", done: false },
];

const examData: ExamItem[] = [
  { id: 1, name: "정보처리기사", dday: "D-18", period: "2026.04.11 접수 마감", status: "학습 중" },
  { id: 2, name: "SQLD", dday: "D-32", period: "2026.04.25 시험", status: "접수 예정" },
  { id: 3, name: "토익", dday: "D-5", period: "2026.03.29 시험", status: "마감 임박" },
];

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "완료":
      return "default";
    case "진행 중":
      return "secondary";
    case "마감 임박":
      return "destructive";
    default:
      return "outline";
  }
}

export default function DashboardPage() {
  const [query, setQuery] = useState("");

  const filteredPlans = useMemo(() => {
    if (!query.trim()) return planData;
    return planData.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const completedCount = planData.filter((item) => item.done).length;
  const totalProgress =
    Math.round(
      roadmapData.reduce((acc, cur) => acc + cur.progress, 0) / roadmapData.length
    ) || 0;

  return (
    <main className="min-h-screen bg-[#fafaf8] text-black">
      <div className="mx-auto flex max-w-[1440px] gap-6 px-4 py-6 md:px-6">
        {/* 좌측 사이드 */}
        <aside className="hidden w-[240px] shrink-0 rounded-3xl border bg-white p-4 shadow-sm lg:block">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">AI 커리어 플래너</p>
              <h1 className="text-lg font-semibold">뿌리 Dashboard</h1>
            </div>
          </div>

          <nav className="space-y-2">
            <Button variant="secondary" className="w-full justify-start rounded-2xl">
              <Goal className="mr-2 h-4 w-4" />
              대시보드
            </Button>
            <Button variant="ghost" className="w-full justify-start rounded-2xl">
              <BookOpen className="mr-2 h-4 w-4" />
              로드맵
            </Button>
            <Button variant="ghost" className="w-full justify-start rounded-2xl">
              <CalendarDays className="mr-2 h-4 w-4" />
              학습 플랜
            </Button>
            <Button variant="ghost" className="w-full justify-start rounded-2xl">
              <Trophy className="mr-2 h-4 w-4" />
              자격증 일정
            </Button>
            <Button variant="ghost" className="w-full justify-start rounded-2xl">
              <FileText className="mr-2 h-4 w-4" />
              커리어 기록
            </Button>
          </nav>

          <Separator className="my-6" />

          <Card className="rounded-3xl border-0 bg-black text-white shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">오늘의 집중 목표</CardTitle>
              <CardDescription className="text-zinc-300">
                2개 완료하면 루트가 한 단계 성장해요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={68} className="mb-3" />
              <p className="text-sm text-zinc-300">진행률 68%</p>
            </CardContent>
          </Card>
        </aside>

        {/* 메인 */}
        <section className="min-w-0 flex-1 space-y-6">
          {/* 상단 헤더 */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">화요일, 3월 24일</p>
              <h2 className="text-3xl font-bold tracking-tight">민서님, 오늘도 뿌리를 내려볼까요?</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full md:w-[320px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="오늘 할 일, 자격증, 로드맵 검색"
                  className="rounded-2xl bg-white pl-9"
                />
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-2xl bg-white">
                    <Bell className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[360px] sm:w-[420px]">
                  <SheetHeader>
                    <SheetTitle>알림</SheetTitle>
                  </SheetHeader>

                  <div className="mt-6 space-y-4">
                    <Card className="rounded-2xl">
                      <CardContent className="p-4">
                        <p className="font-medium">정보처리기사 접수 마감 임박</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          3일 안에 접수해야 해요.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl">
                      <CardContent className="p-4">
                        <p className="font-medium">오늘 학습 플랜 2개 남음</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          DB 복습과 운영체제 문제풀이가 남아 있어요.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* 요약 카드 */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card className="rounded-3xl border bg-white shadow-sm">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">전체 로드맵 진행률</p>
                  <h3 className="mt-2 text-3xl font-bold">{totalProgress}%</h3>
                </div>
                <div className="rounded-2xl bg-zinc-100 p-3">
                  <Goal className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border bg-white shadow-sm">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">완료한 계획</p>
                  <h3 className="mt-2 text-3xl font-bold">
                    {completedCount}/{planData.length}
                  </h3>
                </div>
                <div className="rounded-2xl bg-zinc-100 p-3">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border bg-white shadow-sm">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">다가오는 시험</p>
                  <h3 className="mt-2 text-3xl font-bold">{examData.length}개</h3>
                </div>
                <div className="rounded-2xl bg-zinc-100 p-3">
                  <CalendarDays className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border bg-white shadow-sm">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">이번 주 집중 시간</p>
                  <h3 className="mt-2 text-3xl font-bold">12.5h</h3>
                </div>
                <div className="rounded-2xl bg-zinc-100 p-3">
                  <Clock3 className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            {/* 왼쪽 */}
            <div className="space-y-6">
              <Card className="rounded-3xl border bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>학습 현황</CardTitle>
                  <CardDescription>
                    로드맵, 플랜, 시험 일정을 한 번에 확인해요.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Tabs defaultValue="roadmap" className="w-full">
                    <TabsList className="mb-4 grid w-full grid-cols-3 rounded-2xl">
                      <TabsTrigger value="roadmap" className="rounded-2xl">로드맵</TabsTrigger>
                      <TabsTrigger value="plan" className="rounded-2xl">플랜</TabsTrigger>
                      <TabsTrigger value="exam" className="rounded-2xl">시험 일정</TabsTrigger>
                    </TabsList>

                    <TabsContent value="roadmap" className="space-y-4">
                      {roadmapData.map((item) => (
                        <Card key={item.id} className="rounded-2xl border bg-[#fcfcfb] shadow-none">
                          <CardContent className="p-5">
                            <div className="mb-3 flex items-start justify-between gap-3">
                              <div>
                                <h4 className="font-semibold">{item.title}</h4>
                                <p className="mt-1 text-sm text-muted-foreground">{item.weeks}</p>
                              </div>
                              <Badge variant={getStatusBadgeVariant(item.status)}>
                                {item.status}
                              </Badge>
                            </div>
                            <Progress value={item.progress} className="mb-2" />
                            <p className="text-sm text-muted-foreground">{item.progress}% 완료</p>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>

                    <TabsContent value="plan" className="space-y-4">
                      {filteredPlans.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-2xl border bg-[#fcfcfb] p-4"
                        >
                          <div className="min-w-0">
                            <div className="mb-1 flex items-center gap-2">
                              <Badge variant="outline">{item.day}</Badge>
                              {item.done && <Badge>완료</Badge>}
                            </div>
                            <p className="truncate font-medium">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.time}</p>
                          </div>

                          <Button
                            variant={item.done ? "secondary" : "outline"}
                            className="rounded-2xl"
                          >
                            {item.done ? "완료됨" : "확인"}
                          </Button>
                        </div>
                      ))}

                      {filteredPlans.length === 0 && (
                        <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                          검색 결과가 없어요.
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="exam" className="space-y-4">
                      {examData.map((item) => (
                        <Card key={item.id} className="rounded-2xl border bg-[#fcfcfb] shadow-none">
                          <CardContent className="flex items-center justify-between gap-4 p-5">
                            <div>
                              <div className="mb-2 flex items-center gap-2">
                                <h4 className="font-semibold">{item.name}</h4>
                                <Badge variant={getStatusBadgeVariant(item.status)}>
                                  {item.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{item.period}</p>
                            </div>

                            <div className="rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white">
                              {item.dday}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* 오른쪽 */}
            <div className="space-y-6">
              <Card className="rounded-3xl border bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>오늘의 목표</CardTitle>
                  <CardDescription>가볍게 3개만 끝내도 충분해요.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-2xl border bg-[#fcfcfb] p-4">
                    <p className="font-medium">정보처리기사 기출 20문제 풀기</p>
                    <p className="mt-1 text-sm text-muted-foreground">예상 소요 40분</p>
                  </div>
                  <div className="rounded-2xl border bg-[#fcfcfb] p-4">
                    <p className="font-medium">운영체제 교체 알고리즘 정리</p>
                    <p className="mt-1 text-sm text-muted-foreground">예상 소요 50분</p>
                  </div>
                  <div className="rounded-2xl border bg-[#fcfcfb] p-4">
                    <p className="font-medium">SQLD 요약노트 2페이지 작성</p>
                    <p className="mt-1 text-sm text-muted-foreground">예상 소요 30분</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>AI 추천</CardTitle>
                  <CardDescription>지금 민서님에게 가장 필요한 액션</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl bg-black p-5 text-white">
                    <p className="text-sm text-zinc-300">추천 우선순위 1</p>
                    <h4 className="mt-1 text-lg font-semibold">토익 시험 전 모의고사 1회 진행</h4>
                    <p className="mt-2 text-sm text-zinc-300">
                      시험이 D-5라서 새로운 개념보다 실전 감각 유지가 더 중요해요.
                    </p>
                  </div>

                  <Button className="w-full rounded-2xl">추천 플랜 생성하기</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}