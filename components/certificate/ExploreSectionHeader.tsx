type ExploreSectionHeaderProps = {
  title?: string;
  description?: string;
};

export default function ExploreSectionHeader({
  title = "EXPLORE",
  description = "다양한 분류의 자격증을 둘러보세요",
}: ExploreSectionHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="shrink-0 text-[20px] font-black tracking-tight text-slate-900">
        {title}
      </h2>

      <div className="h-px flex-1 bg-[#E9EDF3]" />

      <p className="shrink-0 text-[12px] font-semibold text-[#A7B6D6]">
        {description}
      </p>
    </div>
  );
}