"use client";

import { X } from "lucide-react";
import Image from "next/image";

type AboutCompanyModalProps = {
  onClose: () => void;
};

export default function AboutCompanyModal({ onClose }: AboutCompanyModalProps) {
  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 px-2 py-4 sm:px-4 md:py-6"
      role="dialog"
      aria-modal="true"
      aria-label="bburi company introduction"
      onClick={onClose}
    >
      <div
        className="relative flex h-[90dvh] w-full max-w-[1240px] flex-col overflow-hidden rounded-[10px] bg-white shadow-2xl md:h-[92vh]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#252A32] shadow-sm transition hover:bg-[#F3F6FA] md:right-4 md:top-4 md:h-10 md:w-10"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>

        <div className="h-full overflow-y-auto px-2 py-2 md:px-8 md:py-5">
          <Image
            src="/Group 50.png"
            alt="bburi 회사소개"
            width={1920}
            height={6000}
            className="mx-auto h-auto w-full rounded-[6px]"
            priority
          />
        </div>
      </div>
    </div>
  );
}
