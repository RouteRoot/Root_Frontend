"use client";

import { useRouter } from "next/navigation";
import useRoadmap from "@/hooks/useRoadmap";

const statusLabelMap = {
  NOT_STARTED: "시작 전",
  IN_PROGRESS: "진행 중",
  COMPLETED: "완료",
} as const;

const statusStyleMap = {
  NOT_STARTED: "bg-gray-100 text-gray-600 border-gray-200",
  IN_PROGRESS: "bg-black text-white border-black",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
} as const;

export default function PlanPage() {
  const router = useRouter();
  const { roadmap, loading, error } = useRoadmap();

 const handleSelectTask = (taskId: number, taskName: string) => {
   router.push(
     `/plan/generate?taskId=${taskId}&name=${encodeURIComponent(taskName)}`,
   );
 };

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-6 py-10">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-4 h-10 w-56 rounded-xl bg-gray-200" />
          <div className="mb-10 h-5 w-80 rounded-lg bg-gray-100" />

          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-gray-200 bg-white p-6"
              >
                <div className="mb-4 h-8 w-48 rounded-lg bg-gray-200" />
                <div className="mb-6 h-4 w-28 rounded-lg bg-gray-100" />
                <div className="space-y-4">
                  {[1, 2].map((card) => (
                    <div
                      key={card}
                      className="rounded-2xl border border-gray-100 bg-gray-50 p-5"
                    >
                      <div className="mb-3 h-5 w-40 rounded bg-gray-200" />
                      <div className="mb-2 h-4 w-full rounded bg-gray-100" />
                      <div className="h-4 w-4/5 rounded bg-gray-100" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
            <h2 className="text-xl font-semibold text-red-600">
              로드맵을 불러오지 못했습니다.
            </h2>
            <p className="mt-2 text-sm text-red-500">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!roadmap) {
    return (
      <main className="min-h-screen bg-white px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => router.push("/plan/generate")}
              className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              로드맵 생성하기
            </button>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 text-gray-600">
            아직 생성된 로드맵이 없습니다.
          </div>
        </div>
      </main>
    );
  }

  const totalTasks = roadmap.phases.reduce(
    (acc, phase) => acc + phase.tasks.length,
    0,
  );

  const completedTasks = roadmap.phases.reduce(
    (acc, phase) =>
      acc + phase.tasks.filter((task) => task.status === "COMPLETED").length,
    0,
  );

  const progressPercent =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <section className="mb-10">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="mb-3 text-sm font-medium text-gray-500">Plan</p>
              <h1 className="text-4xl font-bold tracking-tight text-black">
                나의 자격증 로드맵
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
                목표까지 가는 과정을 단계별로 정리했어요. 각 단계에서 필요한
                자격증과 학습 방향을 한눈에 확인하고 차근차근 진행해보세요.
              </p>
            </div>

            <button
              onClick={() => router.push("/roadmap/generate")}
              className="shrink-0 rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              로드맵 생성하기
            </button>
          </div>
        </section>

        <section className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">전체 단계</p>
            <h2 className="mt-2 text-3xl font-bold text-black">
              {roadmap.phases.length}
            </h2>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">전체 태스크</p>
            <h2 className="mt-2 text-3xl font-bold text-black">{totalTasks}</h2>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">진행률</p>
                <h2 className="mt-2 text-3xl font-bold text-black">
                  {progressPercent}%
                </h2>
              </div>
              <div className="min-w-24 text-right text-sm text-gray-500">
                {completedTasks} / {totalTasks} 완료
              </div>
            </div>

            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-black transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </section>

        <section className="space-y-8">
          {roadmap.phases.map((phase, phaseIndex) => (
            <div
              key={phase.phaseId}
              className="rounded-[28px] border border-gray-200 bg-white p-6 md:p-8"
            >
              <div className="mb-6 flex flex-col gap-4 border-b border-gray-100 pb-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-2 inline-flex rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-500">
                    Phase {phaseIndex + 1}
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-black md:text-3xl">
                    {phase.phaseTitle}
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    예상 학습 기간 {phase.estimatedWeeks}주
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
                  총 {phase.tasks.length}개의 준비 항목
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {phase.tasks.map((task) => (
                  <article
                    key={task.taskId}
                    className="group rounded-3xl border border-gray-100 bg-gray-50 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-200 hover:bg-white"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white">
                          {task.status === "COMPLETED" ? (
                            <div className="h-2.5 w-2.5 rounded-sm bg-black" />
                          ) : (
                            <div className="h-2.5 w-2.5 rounded-sm bg-transparent" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-semibold text-black">
                            {task.taskName}
                          </h3>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${
                          statusStyleMap[task.status]
                        }`}
                      >
                        {statusLabelMap[task.status]}
                      </span>
                    </div>

                    <p className="text-sm leading-7 whitespace-pre-line text-gray-600">
                      {task.description}
                    </p>

                    <div className="mt-5 flex justify-end">
                      <button
                        onClick={() =>
                          handleSelectTask(task.taskId, task.taskName)
                        }
                        className="rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                      >
                        이 시험으로 플랜 만들기
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
