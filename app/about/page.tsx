import Link from "next/link";

export const metadata = {
  title: "회사소개 | bburi",
  description: "bburi 팀을 소개합니다.",
};

const TEAM = [
  { name: "권민서", role: "Full-Stack / PM" },
  { name: "김성민", role: "Full-Stack" },
  { name: "박준서", role: "Full-Stack" },
  { name: "조은",   role: "Full-Stack" },
];

const FEATURES = [
  {
    icon: "🔍",
    title: "자격증 탐색",
    desc: "1,400개 이상의 자격증 정보를 카테고리·키워드로 빠르게 찾을 수 있습니다.",
  },
  {
    icon: "🗺️",
    title: "로드맵 설계",
    desc: "AI가 목표 자격증에 맞는 학습 로드맵을 자동으로 설계해 드립니다.",
  },
  {
    icon: "📅",
    title: "학습 플랜 관리",
    desc: "오늘 해야 할 학습을 놓치지 않도록 일·주 단위 플랜을 제공합니다.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-[20px] font-extrabold tracking-tight text-[#4876EF]">
            bburi
          </Link>
          <nav className="flex items-center gap-8 text-[14px] font-medium text-[#334155]">
            <a href="#mission" className="transition-colors hover:text-[#4876EF]">Mission</a>
            <a href="#service" className="transition-colors hover:text-[#4876EF]">서비스</a>
            <a href="#team" className="transition-colors hover:text-[#4876EF]">팀 소개</a>
            <Link
              href="/"
              className="rounded-full bg-[#4876EF] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              서비스 바로가기
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative flex min-h-screen items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #0c1b3b 0%, #1a3566 25%, #2563c0 55%, #7c9fd4 78%, #b8cce8 90%, #dde8f4 100%)",
        }}
      >
        {/* 장식용 원형 블러 */}
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-20 left-1/2 h-[300px] w-[900px] -translate-x-1/2 rounded-full bg-[#4876EF]/10 blur-2xl" />

        <div className="relative z-10 px-6 text-center">
          <p className="mb-4 text-[15px] font-semibold uppercase tracking-[0.2em] text-white/60">
            About bburi
          </p>
          <h1 className="text-[48px] font-extrabold leading-[1.2] tracking-tight text-white md:text-[64px]">
            bburi 팀은<br />모두가 합격하는<br />세상을 만듭니다
          </h1>
          <p className="mt-6 text-[17px] leading-relaxed text-white/70">
            자격증 탐색부터 학습 플랜까지, 한 곳에서.
          </p>
          <a
            href="#mission"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-white/15 px-6 py-3 text-[14px] font-semibold text-white backdrop-blur-sm transition hover:bg-white/25"
          >
            더 알아보기
            <span className="text-[18px]">↓</span>
          </a>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="mission" className="bg-white px-6 py-28">
        <div className="mx-auto max-w-3xl">
          <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#4876EF]">
            Mission &amp; Vision
          </p>

          <h2 className="mt-4 text-[32px] font-bold leading-[1.35] tracking-tight text-[#0f172a]">
            bburi는 모두가 합격하는<br />세상을 만듭니다
          </h2>
          <div className="mt-6 space-y-4 text-[16px] leading-[1.9] text-[#475569]">
            <p>
              bburi는 "필요한 자격증 정보를 더 빠르고 쉽게 찾을 수 없을까?"라는 질문에서 시작되었습니다.
            </p>
            <p>
              사람들이 자격증에 대한 정확하고 투명한 정보를 갖게 되면 더 나은 선택을 할 수 있고,
              그 선택이 결국 더 나은 커리어와 삶의 만족으로 이어진다고 믿습니다.
            </p>
          </div>

          <div className="mt-16 border-t border-[#E2E8F0] pt-16">
            <h2 className="text-[32px] font-bold leading-[1.35] tracking-tight text-[#0f172a]">
              우리는 개인이 목표 자격증을 향한<br />최선의 경로를 찾을 수 있도록 돕습니다
            </h2>
            <div className="mt-6 space-y-4 text-[16px] leading-[1.9] text-[#475569]">
              <p>
                자격증 취득이 중요한 개인이 스스로 최선의 선택을 내리고 주도적으로 학습을 설계할 수 있도록,
                bburi 팀은 데이터 기반의 로드맵과 맞춤 플랜을 통해 더 나은 학습 환경을 만들어갑니다.
              </p>
              <p>
                자격증에 대한 고민은 누구에게나 중요한 문제입니다.
                bburi는 사용자가 진정으로 필요로 하는 가치를 끊임없이 고민하며,
                자신 있게 추천할 수 있는 높은 수준의 서비스를 만들어갈 것입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service */}
      <section id="service" className="bg-[#F8FAFF] px-6 py-28">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-[13px] font-bold uppercase tracking-[0.2em] text-[#4876EF]">
            Service
          </p>
          <h2 className="mt-4 text-center text-[32px] font-bold tracking-tight text-[#0f172a]">
            bburi가 제공하는 것
          </h2>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-sm"
              >
                <span className="text-[36px]">{f.icon}</span>
                <h3 className="mt-5 text-[18px] font-bold text-[#0f172a]">{f.title}</h3>
                <p className="mt-3 text-[14px] leading-[1.8] text-[#64748b]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievement */}
      <section className="bg-white px-6 py-28">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-[13px] font-bold uppercase tracking-[0.2em] text-[#4876EF]">
            Achievement
          </p>
          <h2 className="mt-4 text-center text-[32px] font-bold tracking-tight text-[#0f172a]">
            숫자로 보는 bburi
          </h2>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              { value: "1,430+", label: "등록 자격증 수" },
              { value: "AI 기반", label: "로드맵 자동 설계" },
              { value: "4인 팀", label: "풀스택 개발팀" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-[48px] font-extrabold text-[#4876EF]">{item.value}</p>
                <p className="mt-2 text-[15px] text-[#64748b]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="bg-[#F8FAFF] px-6 py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#4876EF]">Team</p>
          <h2 className="mt-4 text-[32px] font-bold tracking-tight text-[#0f172a]">
            bburi를 만드는 사람들
          </h2>
          <p className="mt-4 text-[15px] text-[#64748b]">
            한성대학교에서 함께 시작한 네 명의 개발자가 만들어가고 있습니다.
          </p>

          <div className="mt-14 grid grid-cols-2 gap-5 md:grid-cols-4">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="rounded-2xl border border-[#E2E8F0] bg-white px-4 py-8 shadow-sm"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF4FF] text-[20px] font-bold text-[#4876EF]">
                  {member.name[0]}
                </div>
                <p className="mt-4 text-[15px] font-bold text-[#0f172a]">{member.name}</p>
                <p className="mt-1 text-[12px] text-[#94a3b8]">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 text-center">
          <p className="text-[20px] font-extrabold text-[#4876EF]">bburi</p>
          <p className="text-[13px] text-[#94a3b8]">
            서울특별시 성북구 삼선교로 16길 116 한성대학교
          </p>
          <p className="text-[12px] text-[#cbd5e1]">
            © bburi. All rights reserved.
          </p>
          <Link
            href="/"
            className="mt-2 rounded-full border border-[#4876EF] px-5 py-2 text-[13px] font-semibold text-[#4876EF] transition hover:bg-[#4876EF] hover:text-white"
          >
            서비스로 돌아가기
          </Link>
        </div>
      </footer>
    </div>
  );
}
