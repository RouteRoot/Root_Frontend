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
        <section className="relative">
          <p className="mb-8 mt-14 text-[22px] font-semibold tracking-tight text-[#333333]">
            오늘의 추천
          </p>

          <div className="relative">
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
                <h3 className="whitespace-pre-line text-[24px] font-medium leading-[1.32] text-white">
                  {"뿌리가 처음이신가요?\n사용방법을 알려드릴게요!"}
                </h3>
              </div>
            </AboutCompanyModalTrigger>

            <div className="row-span-2 h-full min-h-0">
              <ProgressCard variant="guest" />
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
              <div className="absolute inset-0 bg-linear-to-t from-black/52 via-black/14 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 px-5 pb-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-normal text-white backdrop-blur">
                    시험 정보
                  </span>
                  <span className="text-[11px] font-normal text-white/75">
                    뿌리 에디터
                  </span>
                </div>
                <h3 className="line-clamp-2 text-[18px] font-medium leading-[1.32] text-white">
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
              <div className="absolute inset-0 bg-linear-to-t from-black/52 via-black/14 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 px-5 pb-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-normal text-white backdrop-blur">
                    직무 분석
                  </span>
                  <span className="text-[11px] font-normal text-white/75">
                    뿌리 에디터
                  </span>
                </div>
                <h3 className="line-clamp-2 text-[18px] font-medium leading-[1.32] text-white">
                  전기기사, 이렇게 준비하면 합격합니다.
                </h3>
              </div>
              </Link>
            </div>

            <div className="absolute left-[calc(100%+22px)] top-0 hidden 2xl:block">
              <Link
                href="/roadmap"
                className="block w-[112px] overflow-hidden rounded-[10px] border border-[#E5E8EB] bg-white transition hover:border-[#D0D7E3]"
              >
                <Image
                  src="/Group 59.svg"
                  alt="나만의 맞춤형 로드맵 보러가기"
                  width={240}
                  height={300}
                  className="block h-auto w-full"
                />
              </Link>
            </div>
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
