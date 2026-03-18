"use client";

import Image from "next/image";

type ContentCardProps = {
  title: string;
  subtitle: string; 
  image: string;
  category: string;
  alt?: string;
  onClick?: () => void;
};

export default function ContentCard({
  title,
  subtitle,
  image,
  category,
  alt = title,
  onClick,
}: ContentCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full overflow-hidden rounded-2xl border border-[#EAEAEA] bg-white text-left transition hover:shadow-sm"
    >
      <div className="relative h-32 w-full overflow-hidden rounded-t-2xl bg-[#F7F7F5]">
        <Image
          src={image}
          alt={alt}
          fill
          unoptimized
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="px-3 pb-3 pt-2.5">
        <h3 className="line-clamp-2 text-[14px] font-medium leading-[1.35] text-[#222222]">
          {title}
        </h3>
        <p className="mt-1 line-clamp-1 text-[12px] text-[#888888]">
          {subtitle}
        </p>
        <div className="mt-2">
          <span className="rounded-full bg-[#F2F2F2] px-2.5 py-0.5 text-[11px] font-medium text-[#666]">
            {category}
          </span>
        </div>
      </div>
    </button>
  );
}
