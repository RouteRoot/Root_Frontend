type RoadmapBarItem = {
  id: number;
  title: string;
  status: "진행중" | "예정" | "완료";
};

type RoadmapBarProps = {
  items: RoadmapBarItem[];
};

export default function RoadmapBar({ items }: RoadmapBarProps) {
  return (
    <a
      href="/roadmap"
      className="mt-4 flex overflow-hidden rounded-[32px] border border-slate-200 bg-white px-8 py-6"
    >
      {/* 왼쪽 세로선 */}
      <div className="mr-5 flex items-center">
        <div className="w-[4px] self-stretch rounded-full bg-indigo-600" />
      </div>

      {/* 왼쪽 타이틀 */}
      <div className="flex shrink-0 items-center">
        <div>
          <span className="block text-[11px] leading-none font-black  text-slate-400 uppercase">
            나의 뿌리
          </span>
          <span className="mt-1 block text-[14px] font-black tracking-tight text-slate-900">
            ROADMAP
          </span>
        </div>
      </div>

      {/* 구분선 */}
      <div className="mx-8 w-px shrink-0 bg-slate-200" />

      {/* 항목들 */}
      <div className="flex min-w-0 flex-1 items-center gap-10 overflow-hidden">
        {items.map((item) => (
          <div key={item.id} className="shrink-0">
            <p className="max-w-[120px] truncate text-[14px] leading-none font-black tracking-tight text-slate-700">
              {item.title}
            </p>
            <span className="mt-2 block text-[10px] leading-none font-bold uppercase tracking-[0.08em] text-slate-400">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </a>
  );
}