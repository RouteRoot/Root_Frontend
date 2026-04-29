export default function RoadmapGenerateLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-white/90 backdrop-blur-sm">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full bg-[#0075c3] opacity-80"
            style={{ animation: `bounce 1s ${i * 0.18}s infinite` }}
          />
        ))}
      </div>
      <div className="text-center">
        <p className="text-[16px] font-semibold text-[#333333]">
          AI가 맞춤 로드맵을 만들고 있어요
        </p>
        <p className="mt-1 text-[13px] text-[#94A3B8]">
          현재 상태와 목표 직무를 분석 중입니다. 잠시만 기다려 주세요.
        </p>
      </div>
    </div>
  );
}
