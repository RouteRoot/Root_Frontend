"use client";

const mockCertificate = {
  name: "정보처리기사",
  category: "국가기술자격",
  organizer: "한국산업인력공단",
  difficulty: "중",
  dday: "D-48",
  summary:
    "정보시스템의 생명주기 전반에 대한 이해와 소프트웨어 개발, 데이터베이스, 운영체제, 네트워크 등 IT 전반의 기초 지식을 검증하는 대표적인 자격증입니다.",
  qualification:
    "관련 학과 졸업(예정)자 또는 실무 경력 기준을 충족하는 경우 응시 가능합니다.",
  examMethod: "필기 + 실기",
  subjects: [
    "소프트웨어 설계",
    "소프트웨어 개발",
    "데이터베이스 구축",
    "프로그래밍 언어 활용",
    "정보시스템 구축 관리",
  ],
  recommendFor: [
    "IT 직무 취업을 준비하는 학생",
    "기초 CS 지식을 체계적으로 정리하고 싶은 학습자",
    "포트폴리오와 함께 자격증도 갖추고 싶은 취업 준비생",
  ],
  studyPoints: [
    "기출문제 중심 학습이 매우 중요합니다.",
    "과목별 개념 암기보다 문제 유형과 출제 포인트를 익히는 것이 효과적입니다.",
    "실기 대비를 위해 서술형 답안 작성 연습이 필요합니다.",
  ],
};

export default function CertificatePage() {
  return (
    <div className="min-h-screen bg-[#fbfbfa] text-[#111]">
      {/* 헤더 */}
      <section className="mb-10">
        <p className="mb-2 text-[14px] text-[#9a948c]">Certificate</p>
        <h1 className="text-[36px] font-bold tracking-[-0.02em] text-[#191919]">
          자격증 정보
        </h1>
        <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#6b7280]">
          자격증의 핵심 정보와 학습 포인트를 확인하고 학습할 수 있습니다.
        </p>
      </section>

      {/* 상단 핵심 카드 */}
      <section className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[#e7e5e4] bg-white p-5 md:col-span-2">
          <p className="text-[14px] text-[#9a948c]">
            {mockCertificate.category}
          </p>
          <h2 className="mt-2 text-[28px] font-semibold text-[#191919]">
            {mockCertificate.name}
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-[#6b7280]">
            {mockCertificate.summary}
          </p>
        </div>

        <div className="rounded-2xl border border-[#e7e5e4] bg-white p-5">
          <p className="text-[14px] text-[#9a948c]">시험 일정</p>
          <h3 className="mt-2 text-[26px] font-semibold text-[#191919]">
            {mockCertificate.dday}
          </h3>
          <p className="mt-2 text-[14px] text-[#6b7280]">
            다음 시험일까지 남은 기간 기준
          </p>

          <div className="mt-5 space-y-2 text-[14px] text-[#44403c]">
            <div className="flex justify-between">
              <span className="text-[#9a948c]">주관</span>
              <span>{mockCertificate.organizer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9a948c]">난이도</span>
              <span>{mockCertificate.difficulty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9a948c]">시험 방식</span>
              <span>{mockCertificate.examMethod}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 상세 정보 */}
      <section className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#e7e5e4] bg-white p-6">
          <p className="mb-3 text-[14px] text-[#9a948c]">응시 자격</p>
          <p className="text-[15px] leading-7 text-[#44403c]">
            {mockCertificate.qualification}
          </p>
        </div>

        <div className="rounded-2xl border border-[#e7e5e4] bg-white p-6">
          <p className="mb-3 text-[14px] text-[#9a948c]">추천 대상</p>
          <ul className="space-y-2">
            {mockCertificate.recommendFor.map((item, idx) => (
              <li key={idx} className="text-[15px] leading-7 text-[#44403c]">
                • {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 출제 과목 */}
      <section className="mb-10 rounded-2xl border border-[#e7e5e4] bg-white p-6">
        <div className="mb-4">
          <p className="text-[14px] text-[#9a948c]">출제 과목</p>
          <h3 className="mt-1 text-[22px] font-semibold text-[#191919]">
            시험 과목 구성
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {mockCertificate.subjects.map((subject, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-[#f0eeeb] bg-[#fcfcfb] px-4 py-4"
            >
              <p className="text-[15px] font-medium text-[#191919]">
                {idx + 1}. {subject}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 학습 포인트 */}
      <section className="mb-10 rounded-2xl border border-[#e7e5e4] bg-white p-6">
        <div className="mb-4">
          <p className="text-[14px] text-[#9a948c]">학습 포인트</p>
          <h3 className="mt-1 text-[22px] font-semibold text-[#191919]">
            효과적인 준비 방법
          </h3>
        </div>

        <div className="space-y-3">
          {mockCertificate.studyPoints.map((point, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-[#f0eeeb] bg-[#fcfcfb] px-4 py-4"
            >
              <p className="text-[15px] leading-7 text-[#44403c]">{point}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 액션 영역 */}
      <section className="rounded-2xl border border-[#e7e5e4] bg-white p-6">
        <p className="mb-2 text-[14px] text-[#9a948c]">Next Step</p>
        <h3 className="text-[22px] font-semibold text-[#191919]">
          이 자격증을 목표에 연결해볼까요?
        </h3>
        <p className="mt-2 max-w-2xl text-[15px] leading-7 text-[#6b7280]">
          자격증 정보를 확인한 뒤, 뿌리의 AI 로드맵과 학습 플래너를 통해 실제
          학습 흐름으로 연결할 수 있어요.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button className="rounded-xl bg-[#191919] px-4 py-3 text-[14px] font-medium text-white transition hover:opacity-90">
            로드맵에 추가
          </button>
          <button className="rounded-xl border border-[#d6d3d1] bg-white px-4 py-3 text-[14px] font-medium text-[#44403c] transition hover:bg-[#f7f7f5]">
            학습 계획 만들기
          </button>
        </div>
      </section>
    </div>
  );
}
