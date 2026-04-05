type SectionHeaderProps = {
  title: string;
};

export default function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-1.5 mb-8">
      
      {/* 왼쪽 (dot + title) */}
      <div className="flex items-center gap-3 shrink-0">
        {/* dot */}
        <span className="h-2 w-2 rounded-full bg-[#4F46E5]" />

        {/* title */}
        <h2 className="text-[20px] font-black tracking-tight uppercase text-[#1f2937]">
          {title}
        </h2>
      </div>
    </div>
  );
}