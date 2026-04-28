import Image from "next/image";
import ProgressCard from "@/components/dashboard/ProgressCard";
import DashboardCommunitySection from "@/components/dashboard/DashboardCommunitySection";

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      {/* 오늘의 추천 */}
      <section>
        <p className="mb-8 font-semibold text-[22px] font-black tracking-tight text-[#333333] mt-14">
          오늘의 추천
        </p>

        {/* 3-column grid */}
        <div className="grid grid-cols-3 grid-rows-2 gap-4 w-full">
          {/* 메인 카드 — col 1-2, row 1 */}
          <div className="col-span-2 overflow-hidden rounded-3xl">
            <Image
              src="/Group 22.svg"
              alt="오늘의 추천 메인"
              width={698}
              height={200}
              className="block h-auto w-full"
              priority
            />
          </div>

          {/* 우측 카드 — col 3, row 1-2 */}
          <div className="row-span-2 h-full min-h-0">
            <ProgressCard />
          </div>

          {/* 하단 카드 1 — col 1, row 2 */}
          <div
            className="overflow-hidden rounded-3xl"
            style={{ aspectRatio: "349 / 200", backgroundColor: "#FBCFE8" }}
          />

          {/* 하단 카드 2 — col 2, row 2 */}
          <div
            className="overflow-hidden rounded-3xl"
            style={{ aspectRatio: "349 / 200", backgroundColor: "#BAE6FD" }}
          />
        </div>
      </section>

      <div className="mt-5">
      <DashboardCommunitySection />
      </div>
    </div>
  );
}
