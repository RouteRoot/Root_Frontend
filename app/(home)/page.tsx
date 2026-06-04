import Image from "next/image";
import Link from "next/link";
import ProgressCard from "@/components/dashboard/ProgressCard";
import DashboardCommunitySection from "@/components/dashboard/DashboardCommunitySection";
import DashboardCertificateSection from "@/components/dashboard/DashboardCertificateSection";
import DashboardCertificateReviewSection from "@/components/dashboard/DashboardCertificateReviewSection";
import MobileHomePage from "@/mobile/pages/home/MobileHomePage";
import AboutCompanyModalTrigger from "@/components/common/AboutCompanyModalTrigger";

export default function Page() {
  return (
    <>
      <div className="lg:hidden">
        <MobileHomePage />
      </div>

      <div className="hidden flex-col gap-6 lg:flex">
        <section>
          <p className="mb-8 font-semibold mt-14 text-[22px] tracking-tight text-[#333333]">
            오늘의 추천
          </p>

          <div
            className="grid w-full grid-cols-3 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-4"
            style={{ aspectRatio: "1079 / 416" }}
          >
            <AboutCompanyModalTrigger className="col-span-2 block h-full overflow-hidden rounded-3xl text-left">
              <Image
                src="/Group 22.svg"
                alt="오늘의 추천 메인"
                width={698}
                height={200}
                className="block h-full w-full object-cover"
                priority
              />
            </AboutCompanyModalTrigger>

            <div className="row-span-2 h-full min-h-0">
              <ProgressCard variant="guest" />
            </div>

            <Link
              href="/community/4"
              className="block h-full overflow-hidden rounded-3xl"
            >
              <Image
                src="/Group 24.svg"
                alt="추천 콘텐츠 1"
                width={341}
                height={200}
                className="block h-full w-full object-cover"
              />
            </Link>

            <Link
              href="/community/17"
              className="block h-full overflow-hidden rounded-3xl"
            >
              <Image
                src="/Group 25.svg"
                alt="추천 콘텐츠 2"
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
