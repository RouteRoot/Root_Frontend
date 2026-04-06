"use client";

type CertificateStatus = "IN_PROGRESS" | "ACQUIRED" | "PLANNED";

type CertificateCard = {
  id: number;
  name: string;
  status: CertificateStatus;
};

type PhaseRow = {
  id: number;
  phase: string;
  title: string;
  description: string;
  certificates: CertificateCard[];
};

const phaseRows: PhaseRow[] = [
  {
    id: 1,
    phase: "Phase 1",
    title: "기본기 다지기",
    description: "기초 역량을 탄탄하게 다지는 단계입니다",
    certificates: [
      { id: 101, name: "컴퓨터활용능력 2급", status: "IN_PROGRESS" },
      { id: 102, name: "SQLD", status: "IN_PROGRESS" },
    ],
  },
  {
    id: 2,
    phase: "Phase 2",
    title: "핵심 역량 강화",
    description: "실무에 필요한 자격증을 익히는 단계입니다",
    certificates: [
      { id: 201, name: "정보처리기사", status: "IN_PROGRESS" },
      { id: 202, name: "리눅스마스터 2급", status: "IN_PROGRESS" },
      { id: 203, name: "토익", status: "IN_PROGRESS" },
    ],
  },
  {
    id: 3,
    phase: "Phase 3",
    title: "실전 완성",
    description: "이것까지 취득하면 당신은 고수의 단계입니다",
    certificates: [
      { id: 301, name: "ADsP", status: "IN_PROGRESS" },
      { id: 302, name: "포트폴리오 완성", status: "IN_PROGRESS" },
    ],
  },
];

function getCardStyle(status: CertificateStatus) {
  switch (status) {
    case "IN_PROGRESS":
      return {
        wrapper:
          "border border-[#6D5DF6] bg-[#6d61da] text-white shadow-[0_8px_20px_rgba(109,93,246,0.18)] hover:shadow-[0_12px_28px_rgba(109,93,246,0.24)]",
        badge: "bg-white/18 text-white",
      };
    case "ACQUIRED":
      return {
        wrapper:
          "border border-[#A8B1C0] bg-[#A8B1C0] text-white shadow-[0_8px_18px_rgba(148,163,184,0.16)] hover:shadow-[0_10px_24px_rgba(148,163,184,0.2)]",
        badge: "bg-white/18 text-white",
      };
    case "PLANNED":
      return {
        wrapper:
          "border border-[#D8DEE8] bg-white text-[#475569] shadow-none hover:border-[#C8D0DB] hover:bg-[#FAFBFC]",
        badge: "bg-[#F3F4F6] text-[#6B7280]",
      };
    default:
      return {
        wrapper:
          "border border-[#6D5DF6] bg-[#6d61da] text-white shadow-[0_8px_20px_rgba(109,93,246,0.18)] hover:shadow-[0_12px_28px_rgba(109,93,246,0.24)]",
        badge: "bg-white/18 text-white",
      };
  }
}

function getStatusLabel(status: CertificateStatus) {
  switch (status) {
    case "IN_PROGRESS":
      return "진행 중";
    case "ACQUIRED":
      return "취득 완료";
    case "PLANNED":
      return "진행 예정";
    default:
      return "";
  }
}

export default function RoadmapTimelineSection() {
  return (
    <section className="w-full">
      {/* 상단 헤더 */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-5">
          <h2 className="shrink-0 text-[28px] font-extrabold leading-none tracking-[-0.04em] text-[#0B1B3B]">
            BIBLIOGRAPHIC ROADMAP
          </h2>
          <div className="hidden h-px min-w-[280px] flex-1 bg-[#E9EDF3] md:block" />
        </div>

        <button
          type="button"
          className="inline-flex h-9 items-center justify-center rounded-full border border-[#E5E7EB] bg-white px-4 text-[13px] font-semibold text-[#111827] transition hover:bg-[#F8FAFC]"
        >
          수정하기
        </button>
      </div>

      {/* 범례 */}
      <div className="mb-4 flex flex-wrap items-center gap-5 text-[11px] font-medium text-[#94A3B8]">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#6D5DF6]" />
          <span>진행 중</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#8FA3BF]" />
          <span>취득 완료</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full border border-[#A9B7CA] bg-white" />
          <span>진행 예정</span>
        </div>
      </div>

      {/* 본문 */}
      <div className="overflow-hidden rounded-[28px] border border-[#E8EDF5] bg-white">
        <div
          className="grid min-w-[1100px]"
          style={{ gridTemplateColumns: "280px 1fr" }}
        >
          {/* 왼쪽 */}
          <div className="border-r border-[#EEF2F7] bg-[#FBFCFE]">
            <div className="flex h-[50px] items-center px-6 text-[11px] font-semibold text-[#A0AEC0]">
              페이즈
            </div>

            {phaseRows.map((row, index) => (
              <div
                key={row.id}
                className={`flex min-h-[65px] items-center px-6 py-4 ${
                  index !== phaseRows.length - 1 ? "border-t border-[#EEF2F7]" : ""
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[13px] font-bold leading-none tracking-[-0.03em] text-[#0F172A]">
                      {row.title}
                    </h3>
                    <span className="rounded-full bg-[#F1EEFF] px-2 py-[3px] text-[10px] font-semibold leading-none text-[#6D5DF6]">
                      {row.phase}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-[11px] leading-none text-[#94A3B8]">
                    {row.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 오른쪽 */}
          <div>
            <div className="flex h-[50px] items-center bg-[#FBFCFE] px-6 text-[11px] font-semibold text-[#A0AEC0]">
              단계별 자격증 로드맵
            </div>

            {phaseRows.map((row, index) => (
              <div
                key={row.id}
                className={`flex min-h-[65px] items-center px-6 py-3 ${
                  index !== phaseRows.length - 1 ? "border-t border-[#EEF2F7]" : ""
                }`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  {row.certificates.map((certificate) => {
                    const style = getCardStyle(certificate.status);

                    return (
                      <button
                        key={certificate.id}
                        type="button"
                        className={`group inline-flex h-[40px] w-auto max-w-[320px] items-center rounded-[12px] px-3 transition-all duration-200 hover:-translate-y-[1px] ${style.wrapper}`}
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <p className="whitespace-nowrap text-[13px] font-bold leading-none">
                            {certificate.name}
                          </p>

                          <span
                            className={`shrink-0 rounded-full px-1.5 py-[3px] text-[9px] font-semibold leading-none ${style.badge}`}
                          >
                            {getStatusLabel(certificate.status)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}