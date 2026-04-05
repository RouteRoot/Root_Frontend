import Link from "next/link";

type TodayPlanCardProps = {
  subtitle: string;
  certificateName: string;
  currentDay: number;
  totalDay: number;
  href: string;
};

export default function TodayPlanCard({
  subtitle,
  certificateName,
  currentDay,
  totalDay,
  href,
}: TodayPlanCardProps) {
  return (
    <Link
      href={href}
      className="mt-24 flex overflow-hidden rounded-[32px] border border-slate-200 bg-white px-8 py-3 transition-colors hover:bg-slate-50"
    >
      {/* 왼쪽 세로선 */}
      <div className="mr-5 flex items-center">
        <div className="w-[4px] h-9 rounded-full bg-indigo-600" />
      </div>

      {/* 왼쪽 타이틀 */}
      <div className="flex shrink-0 items-center">
        <div>
          <span className="block text-[11px] leading-none font-black text-slate-400 uppercase">
            오늘의 플랜
          </span>
          <span className="mt-1 block text-[14px] font-black tracking-tight text-slate-900">
            PLAN
          </span>
        </div>
      </div>

      {/* 구분선 */}
      <div className="mx-8 w-px shrink-0 bg-slate-200" />

      {/* 내용 */}
      <div className="flex min-w-0 flex-1 items-center justify-between gap-6">
        <div className="min-w-0">
          <p className="text-[10px] leading-none font-bold uppercase tracking-[0.08em] text-slate-400">
            {subtitle}
          </p>

          <p className="mt-2 truncate text-[14px] leading-none font-black tracking-tight text-slate-700">
            {certificateName}
          </p>

          <p className="mt-2 text-[12px] font-bold tracking-tight text-slate-500">
            {currentDay} Day / {totalDay} Day
          </p>
        </div>

        {/* 바로가기 */}
        <div className="shrink-0 text-[13px] font-black text-slate-400 transition-transform duration-200 group-hover:translate-x-1">
          바로가기
        </div>
      </div>
    </Link>
  );
}