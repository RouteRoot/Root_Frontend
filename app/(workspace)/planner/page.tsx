"use client";

const mockRoadmap = {
  roadmapId: 1,
  phases: [
    {
      phaseId: 1,
      phaseNumber: 1,
      phaseTitle: "기초 경쟁력 확보",
      estimatedWeeks: 10,
      tasks: [
        {
          taskId: 1,
          taskName: "정보처리기사",
          description:
            "프론트엔드 개발자로 진출하기 위한 첫 걸음으로 정보처리기사 자격증을 준비합니다. 필기 과목을 중심으로 개념을 익히고 기출문제를 반복 풀이합니다.",
          status: "NOT_STARTED",
        },
        {
          taskId: 2,
          taskName: "영어 토익 850 이상",
          description:
            "IT 기업에서 우대하는 영어 능력을 확보하기 위해 토익 점수를 향상시킵니다. 듣기와 독해를 균형 있게 학습합니다.",
          status: "IN_PROGRESS",
        },
      ],
    },
    {
      phaseId: 2,
      phaseNumber: 2,
      phaseTitle: "직무 직접 경쟁력 강화",
      estimatedWeeks: 8,
      tasks: [
        {
          taskId: 3,
          taskName: "React 프로젝트 완성",
          description:
            "실제 서비스 형태의 프론트엔드 프로젝트를 완성하여 포트폴리오에 담을 수 있는 결과물을 만듭니다.",
          status: "IN_PROGRESS",
        },
        {
          taskId: 4,
          taskName: "Next.js 학습",
          description:
            "라우팅, 서버 컴포넌트, API 연결 구조를 익혀 실무형 프론트엔드 역량을 강화합니다.",
          status: "NOT_STARTED",
        },
      ],
    },
  ],
};

const mockPlan = {
  targetExam: "정보처리기사",
  totalWeeks: 11,
  weeklyPlans: [
    {
      weekNumber: 1,
      weeklyGoal: "소프트웨어 생명주기와 요구사항 분석 이해",
      dailyPlans: [
        {
          dailyPlanId: 1,
          studyDate: "2026-03-17",
          completed: false,
          dayNumber: 1,
          topic: "소프트웨어 생명주기",
          description:
            "요구사항 분석, 설계, 구현, 테스트, 유지보수 개념을 정리합니다.",
          estimatedHours: 2,
          rest: false,
        },
        {
          dailyPlanId: 2,
          studyDate: "2026-03-18",
          completed: true,
          dayNumber: 2,
          topic: "요구사항 도출 기법",
          description:
            "인터뷰, 설문조사, 워크숍 등 요구사항 도출 방법을 학습합니다.",
          estimatedHours: 2,
          rest: false,
        },
        {
          dailyPlanId: 3,
          studyDate: "2026-03-19",
          completed: false,
          dayNumber: 3,
          topic: "복습",
          description: "전날 학습한 개념을 다시 정리하고 기출 5문제를 풉니다.",
          estimatedHours: 1,
          rest: false,
        },
      ],
    },
    {
      weekNumber: 2,
      weeklyGoal: "UI 설계와 화면 흐름 이해",
      dailyPlans: [
        {
          dailyPlanId: 4,
          studyDate: "2026-03-24",
          completed: false,
          dayNumber: 1,
          topic: "UI 설계 원칙",
          description: "좋은 사용자 인터페이스 설계 원칙을 정리합니다.",
          estimatedHours: 2,
          rest: false,
        },
        {
          dailyPlanId: 5,
          studyDate: "2026-03-25",
          completed: false,
          dayNumber: 2,
          topic: "화면 설계서 읽기",
          description: "화면 흐름도와 와이어프레임 해석 연습을 합니다.",
          estimatedHours: 2,
          rest: false,
        },
        {
          dailyPlanId: 6,
          studyDate: "2026-03-26",
          completed: false,
          dayNumber: 3,
          topic: "휴식일",
          description: "휴식 및 가벼운 복습",
          estimatedHours: 0,
          rest: true,
        },
      ],
    },
  ],
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-700";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function PlannerPage() {
  const totalTasks = mockRoadmap.phases.flatMap((phase) => phase.tasks).length;
  const completedTasks = mockRoadmap.phases
    .flatMap((phase) => phase.tasks)
    .filter((task) => task.status === "COMPLETED").length;

  const totalDailyPlans = mockPlan.weeklyPlans.flatMap(
    (week) => week.dailyPlans,
  ).length;
  const completedDailyPlans = mockPlan.weeklyPlans
    .flatMap((week) => week.dailyPlans)
    .filter((plan) => plan.completed).length;

  const progressPercent =
    totalDailyPlans === 0
      ? 0
      : Math.round((completedDailyPlans / totalDailyPlans) * 100);

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-[#111]">
      {/* 헤더 */}
      <section className="mb-10">
        <p className="mb-2 text-[14px] text-[#9a948c]">Planner</p>
        <h1 className="text-[36px] font-bold tracking-[-0.02em] text-[#191919]">
          학습 플래너
        </h1>
      </section>

      {/* 상단 요약 카드 */}
      <section className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[#e7e5e4] bg-white p-5">
          <p className="text-[14px] text-[#9a948c]">목표 직무</p>
          <h2 className="mt-2 text-[22px] font-semibold text-[#191919]">
            프론트엔드 개발자
          </h2>
        </div>

        <div className="rounded-2xl border border-[#e7e5e4] bg-white p-5">
          <p className="text-[14px] text-[#9a948c]">목표 시험</p>
          <h2 className="mt-2 text-[22px] font-semibold text-[#191919]">
            {mockPlan.targetExam}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#e7e5e4] bg-white p-5">
          <p className="text-[14px] text-[#9a948c]">학습 진행률</p>
          <h2 className="mt-2 text-[22px] font-semibold text-[#191919]">
            {completedDailyPlans} / {totalDailyPlans} 완료
          </h2>
          <div className="mt-3 h-2 w-full rounded-full bg-[#ecebe7]">
            <div
              className="h-2 rounded-full bg-[#191919]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="mt-2 text-[13px] text-[#8b8680]">
            {progressPercent}% 진행 중
          </p>
        </div>
      </section>

      {/* 로드맵 */}
      <section className="mb-12">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[14px] text-[#9a948c]">Roadmap</p>
            <h2 className="text-[24px] font-semibold text-[#191919]">로드맵</h2>
          </div>
          <p className="text-[14px] text-[#8b8680]">
            전체 Task {totalTasks}개 / 완료 {completedTasks}개
          </p>
        </div>

        <div className="space-y-6">
          {mockRoadmap.phases.map((phase) => (
            <div
              key={phase.phaseId}
              className="rounded-2xl border border-[#e7e5e4] bg-white p-6"
            >
              <div className="mb-5">
                <p className="text-[14px] text-[#9a948c]">
                  Phase {phase.phaseNumber}
                </p>
                <h3 className="mt-1 text-[22px] font-semibold text-[#191919]">
                  {phase.phaseTitle}
                </h3>
                <p className="mt-1 text-[14px] text-[#6b7280]">
                  예상 기간: {phase.estimatedWeeks}주
                </p>
              </div>

              <div className="space-y-4">
                {phase.tasks.map((task) => (
                  <div
                    key={task.taskId}
                    className="rounded-xl border border-[#f0eeeb] bg-[#fcfcfb] p-4"
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-[16px] font-semibold text-[#191919]">
                          {task.taskName}
                        </h4>
                        <p className="mt-2 text-[14px] leading-6 text-[#666]">
                          {task.description}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-medium ${getStatusStyle(
                          task.status,
                        )}`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 학습 플랜 */}
      <section>
        <div className="mb-4">
          <p className="text-[14px] text-[#9a948c]">Study Plan</p>
          <h2 className="text-[24px] font-semibold text-[#191919]">
            학습 계획
          </h2>
        </div>

        <div className="space-y-6">
          {mockPlan.weeklyPlans.map((week) => (
            <div
              key={week.weekNumber}
              className="rounded-2xl border border-[#e7e5e4] bg-white p-6"
            >
              <div className="mb-5">
                <p className="text-[14px] text-[#9a948c]">
                  Week {week.weekNumber}
                </p>
                <h3 className="mt-1 text-[20px] font-semibold text-[#191919]">
                  {week.weeklyGoal}
                </h3>
              </div>

              <div className="space-y-3">
                {week.dailyPlans.map((plan) => (
                  <div
                    key={plan.dailyPlanId}
                    className="flex items-start justify-between rounded-xl border border-[#f0eeeb] bg-[#fcfcfb] px-4 py-4"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={plan.completed}
                        readOnly
                        className="mt-1 h-4 w-4 accent-[#191919]"
                      />

                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-[15px] font-medium text-[#191919]">
                            Day {plan.dayNumber}. {plan.topic}
                          </p>

                          {plan.rest && (
                            <span className="rounded-full bg-[#f3f4f6] px-2 py-0.5 text-[12px] text-[#6b7280]">
                              휴식
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-[14px] text-[#6b7280]">
                          {plan.description}
                        </p>

                        <div className="mt-2 flex items-center gap-3 text-[13px] text-[#9a948c]">
                          <span>{plan.studyDate}</span>
                          {!plan.rest && (
                            <span>{plan.estimatedHours}시간 예정</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button className="rounded-lg border border-[#e7e5e4] bg-white px-3 py-2 text-[14px] text-[#44403c] transition hover:bg-[#f7f7f5]">
                      상세
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
