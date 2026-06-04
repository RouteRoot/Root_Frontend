import Image from "next/image";
import Link from "next/link";
import ProgressCard from "@/components/dashboard/ProgressCard";
import DashboardCommunitySection from "@/components/dashboard/DashboardCommunitySection";
import DashboardCertificateSection from "@/components/dashboard/DashboardCertificateSection";
import DashboardCertificateReviewSection from "@/components/dashboard/DashboardCertificateReviewSection";
import MobileDashboardPage from "@/mobile/pages/dashboard/MobileDashboardPage";
import AboutCompanyModalTrigger from "@/components/common/AboutCompanyModalTrigger";

export default function Page() {
  return (
    <>
      <div className="lg:hidden">
        <MobileDashboardPage />
      </div>

      <div className="hidden flex-col gap-6 lg:flex">
        <section>
          <p className="mb-8 mt-14 text-[22px] font-semibold tracking-tight text-[#333333]">
            오늘의 추천
          </p>

          <div
            className="grid w-full grid-cols-3 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-4"
            style={{ aspectRatio: "1079 / 416" }}
          >
            <AboutCompanyModalTrigger className="relative col-span-2 block h-full overflow-hidden rounded-[10px] text-left">
              <Image
                src="/Group 58 (1).svg"
                alt="뿌리 사용 방법"
                width={698}
                height={200}
                className="block h-full w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-black/1 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 px-6 pb-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-normal text-white backdrop-blur">
                    PICK
                  </span>
                  <span className="text-[11px] font-normal text-white/75">
                    뿌리 에디터
                  </span>
                </div>
                <h3 className="whitespace-pre-line text-[24px] font-semibold leading-[1.32] text-white">
                  {"뿌리가 처음이신가요?\n사용방법을 알려드릴게요!"}
                </h3>
              </div>
            </AboutCompanyModalTrigger>

            <div className="row-span-2 h-full min-h-0">
              <ProgressCard />
            </div>

            <Link
              href="/certificate/archive/30"
              className="relative block h-full overflow-hidden rounded-[10px]"
            >
              <Image
                src="/mhero1.png"
                alt="SQLD 취득 완벽 로드맵"
                width={341}
                height={200}
                className="block h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 px-5 pb-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-normal text-white backdrop-blur">
                    시험 정보
                  </span>
                  <span className="text-[11px] font-normal text-white/75">
                    뿌리 에디터
                  </span>
                </div>
                <h3 className="line-clamp-2 text-[18px] font-semibold leading-[1.32] text-white">
                  SQLD 취득 완벽 로드맵 2026 [비전공자를 위한]
                </h3>
              </div>
            </Link>

            <Link
              href="/certificate/archive/28"
              className="relative block h-full overflow-hidden rounded-[10px]"
            >
              <Image
                src="/eeee.png"
                alt="전기기사 합격 전략"
                width={341}
                height={200}
                className="block h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 px-5 pb-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-normal text-white backdrop-blur">
                    직무 분석
                  </span>
                  <span className="text-[11px] font-normal text-white/75">
                    뿌리 에디터
                  </span>
                </div>
                <h3 className="line-clamp-2 text-[18px] font-semibold leading-[1.32] text-white">
                  전기기사, 이렇게 준비하면 합격합니다.
                </h3>
              </div>
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
