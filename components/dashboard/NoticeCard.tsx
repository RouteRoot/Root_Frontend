type NoticeCardProps = {
  href?: string;
  date: string;
  title: string;
  description: string;
};

export default function NoticeCard({
  href = "#",
  date,
  title,
  description,
}: NoticeCardProps) {
  return (
    <a
      href={href}
      className="
        group block cursor-pointer rounded-3xl border border-slate-100 bg-white
        px-8 py-8
        transition-all duration-300 ease-out
        hover:-translate-y-0.75 hover:border-slate-200
        hover:shadow-[0_16px_36px_rgba(15,23,42,0.10)]
      "
    >
      <p className="text-xs font-medium text-slate-400">{date}</p>

      <h4
        className="
          mt-4 line-clamp-1 text-lg font-bold text-slate-900
          transition-colors duration-200
          group-hover:text-[#4F46E5]
        "
      >
        {title}
      </h4>

      <p
        className="
          mt-4 line-clamp-2 text-sm font-medium leading-relaxed text-slate-400
          transition-colors duration-300
        "
      >
        {description}
      </p>
    </a>
  );
}