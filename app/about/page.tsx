import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "회사소개 | bburi",
  description: "bburi 소개 페이지입니다.",
};

export default function AboutPage() {
  return (
    <main className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-4 py-6">
      <section className="relative flex h-[92vh] w-full max-w-[1100px] flex-col overflow-hidden rounded-[10px] bg-white shadow-2xl">
        <Link
          href="/"
          aria-label="about close"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#252A32] shadow-sm transition hover:bg-[#F3F6FA]"
        >
          <X className="h-5.5 w-5.5" strokeWidth={2} />
        </Link>

        <div className="h-full overflow-y-auto px-4 py-3 md:px-8 md:py-5">
          <Image
            src="/Group 50.png"
            alt="bburi 소개"
            width={1920}
            height={6000}
            className="mx-auto h-auto w-full rounded-[6px]"
            priority
          />
        </div>
      </section>
    </main>
  );
}
