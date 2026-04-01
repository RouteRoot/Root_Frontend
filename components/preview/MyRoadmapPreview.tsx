"use client";

type Certification = {
  name: string;
  status: "시작 전" | "진행중" | "완료";
};

type Phase = {
  id: number;
  title: string;
  subtitle: string;
  duration: string;
  totalTasks: number;
  certifications: Certification[];
};

const phases: Phase[] = [
  {
    id: 1,
    title: "기본 경쟁력 확보",
    subtitle: "백엔드 기본기를 다지는 시작 단계",
    duration: "8주",
    totalTasks: 3,
    certifications: [
      { name: "정보처리산업기사", status: "시작 전" },
      { name: "SQLD", status: "시작 전" },
      { name: "정보처리기사", status: "시작 전" },
    ],
  },
  {
    id: 2,
    title: "직무 경쟁력 강화",
    subtitle: "실무 역량과 외부 경쟁력을 키우는 단계",
    duration: "10주",
    totalTasks: 3,
    certifications: [
      { name: "AWS SAA", status: "시작 전" },
      { name: "정보보안기사", status: "시작 전" },
      { name: "토익 850+", status: "시작 전" },
    ],
  },
  {
    id: 3,
    title: "상위 기업 안정권 진입",
    subtitle: "차별화 포인트를 만드는 심화 단계",
    duration: "12주",
    totalTasks: 3,
    certifications: [
      { name: "KOSMIS", status: "시작 전" },
      { name: "ITIL Foundation", status: "시작 전" },
      { name: "오픽 IH", status: "시작 전" },
    ],
  },
];

function getStatusStyle(status: Certification["status"]) {
  switch (status) {
    case "완료":
      return "bg-black text-white";
    case "진행중":
      return "bg-[#FFF36A] text-black";
    case "시작 전":
    default:
      return "bg-neutral-100 text-neutral-500";
  }
}

export default function MyRoadmapPreview() {
  const totalPhaseCount = phases.length;
  const totalTaskCount = phases.reduce(
    (acc, phase) => acc + phase.totalTasks,
    0,
  );
  const completedTaskCount = 0;
  const progress = Math.round((completedTaskCount / totalTaskCount) * 100);

  return (
    <section className="w-full rounded-[24px] border border-neutral-200 bg-white p-5">
      {/* 헤더 */}
      <div className="flex flex-col gap-4 border-b border-neutral-100 pb-4">
        <div>
          <p className="text-[13px] font-medium text-neutral-500">
            나만의 로드맵
          </p>
          <h2 className="mt-1 text-[22px] font-semibold tracking-tight text-black">
            나의 자격증 로드맵
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-500">
            목표까지 가는 과정을 단계별로 정리했어요. 각 단계에서 필요한
            자격증과 학습 방향을 한눈에 확인하고 차근차근 진행해보세요.
          </p>
        </div>

        {/* 상단 요약 */}
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <div className="rounded-[18px] bg-neutral-50 px-4 py-3">
            <p className="text-xs text-neutral-400">전체 단계</p>
            <p className="mt-1 text-xl font-semibold text-black">
              {totalPhaseCount}
            </p>
          </div>

          <div className="rounded-[18px] bg-neutral-50 px-4 py-3">
            <p className="text-xs text-neutral-400">전체 태스크</p>
            <p className="mt-1 text-xl font-semibold text-black">
              {totalTaskCount}
            </p>
          </div>

          <div className="rounded-[18px] bg-neutral-50 px-4 py-3">
            <p className="text-xs text-neutral-400">진행률</p>
            <p className="mt-1 text-xl font-semibold text-black">{progress}%</p>
          </div>

          <div className="rounded-[18px] bg-neutral-50 px-4 py-3">
            <p className="text-xs text-neutral-400">완료한 태스크</p>
            <p className="mt-1 text-xl font-semibold text-black">
              {completedTaskCount} / {totalTaskCount}
            </p>
          </div>
        </div>

        {/* 진행률 바 */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-neutral-500">로드맵 진행 현황</span>
            <span className="text-sm font-medium text-black">{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full rounded-full bg-black transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Phase 카드 */}
      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-3">
        {phases.map((phase) => (
          <article
            key={phase.id}
            className="rounded-[22px] border border-neutral-200 bg-[#fcfcfb] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  Phase {phase.id}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-black">
                  {phase.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  {phase.subtitle}
                </p>
              </div>

              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-500">
                {phase.duration}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-[16px] bg-white px-3 py-3">
              <div>
                <p className="text-xs text-neutral-400">준비 항목</p>
                <p className="mt-1 text-sm font-semibold text-black">
                  총 {phase.totalTasks}개
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-neutral-400">상태</p>
                <p className="mt-1 text-sm font-semibold text-black">시작 전</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {phase.certifications.map((cert) => (
                <div
                  key={cert.name}
                  className="flex items-center justify-between rounded-[14px] bg-white px-3 py-3"
                >
                  <span className="text-sm font-medium text-black">
                    {cert.name}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                      cert.status,
                    )}`}
                  >
                    {cert.status}
                  </span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
