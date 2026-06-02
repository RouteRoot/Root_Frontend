import Image from "next/image";
import Link from "next/link";
import ProgressCard from "@/components/dashboard/ProgressCard";
import DashboardCommunitySection from "@/components/dashboard/DashboardCommunitySection";
import DashboardCertificateSection from "@/components/dashboard/DashboardCertificateSection";
import DashboardCertificateReviewSection from "@/components/dashboard/DashboardCertificateReviewSection";
import MobileHomePage from "@/mobile/pages/home/MobileHomePage";

export default function Page() {
  return (
    <>
    <div className="lg:hidden">
      <MobileHomePage />
    </div>

    <div className="hidden flex-col gap-6 lg:flex">
      {/* 오늘의 추천 */}
      <section>
        <p className="mb-8 font-semibold text-[22px] font-black tracking-tight text-[#333333] mt-14">
          오늘의 추천
        </p>

        {/* 3-column grid */}
        <div
          className="grid w-full grid-cols-3 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-4"
          style={{ aspectRatio: "1079 / 416" }}
        >
          {/* 메인 카드 — col 1-2, row 1 */}
          <Link
            href="/community/1"
            className="col-span-2 block h-full overflow-hidden rounded-3xl"
          >
            <Image
              src="/Group 22.svg"
              alt="오늘의 추천 메인"
              width={698}
              height={200}
              className="block h-full w-full object-cover"
              priority
            />
          </Link>

          {/* 우측 카드 — col 3, row 1-2 */}
          <div className="row-span-2 h-full min-h-0">
            <ProgressCard variant="guest" />
          </div>

          {/* 하단 카드 1 — col 1, row 2 */}
          <Link
            href="/community/4"
            className="block h-full overflow-hidden rounded-3xl"
          >
            <Image
              src="/Group 24.svg"
              alt="?ㅻ뒛??異붿쿇 ?섎떒 1"
              width={341}
              height={200}
              className="block h-full w-full object-cover"
            />
          </Link>

          {/* 하단 카드 2 — col 2, row 2 */}
          <Link
            href="/community/17"
            className="block h-full overflow-hidden rounded-3xl"
          >
            <Image
              src="/Group 25.svg"
              alt="?ㅻ뒛??異붿쿇 ?섎떒 2"
              width={341}
              height={200}
              className="block h-full w-full object-cover"
            />
          </Link>
        </div>
      </section>

      <div className="mt-5">
        <DashboardCommunitySection />
      </div>

      <DashboardCertificateSection />

      <DashboardCertificateReviewSection />
    </div>
    </>
  );
}
