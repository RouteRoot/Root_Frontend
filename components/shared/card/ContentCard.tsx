"use client";

import Image from "next/image";

type ContentCardProps = {
  title: string;
  image: string;
  category: string; 
  alt?: string;
  onClick?: () => void;
};

export default function ContentCard({
  title,
  image,
  category,
  alt = title,
  onClick,
}: ContentCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full overflow-hidden rounded-[18px] border border-[#EAEAEA] bg-white text-left transition hover:shadow-md"
    >
      {/* 이미지 */}
      <div className="px-3 pt-3">
        <div className="relative h-[126px] w-full overflow-hidden rounded-[12px] bg-[#F7F7F5]">
          <Image
            src={image}
            alt={alt}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        </div>
      </div>

      {/* 텍스트 */}
      <div className="px-4 pb-4 pt-3">
        {/* 제목 */}
        <h3 className="line-clamp-2 min-h-[56px] text-[15px] font-medium leading-[1.4] tracking-[-0.01em] text-[#222222]">
          {title}
        </h3>

        {/* 🔥 분류 뱃지 */}
        <div className="mt-3 flex items-center">
          <span className="rounded-full bg-[#F2F2F2] px-3 py-1 text-[12px] font-medium text-[#666]">
            {category}
          </span>
        </div>
      </div>
    </button>
  );
}
