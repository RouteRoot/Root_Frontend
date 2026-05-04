import type { CertificateSearchItem } from "@/app/api/certificate/types";
import { Building2, CalendarDays, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getCertificateDescriptionText } from "./certificateDescription";

type CertificateResultCardProps = {
  item: CertificateSearchItem;
};

function getNextScheduleLabel(item: CertificateSearchItem) {
  const next = item.schedules.find(
    (schedule) => schedule.docExamStart || schedule.pracExamStart
  );

  if (!next) return "등록된 일정 없음";
  return next.docExamStart
    ? `필기 ${next.docExamStart}`
    : `실기 ${next.pracExamStart}`;
}

export default function CertificateResultCard({
  item,
}: CertificateResultCardProps) {
  const descriptionText = getCertificateDescriptionText(item.description);

  return (
    <Link
      href={`/certificate/${encodeURIComponent(item.examCode)}`}
      className="group block border-b border-[#E5E8EB] py-6"
    >
      <article className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {item.category && (
              <span className="rounded-sm bg-[#F5F7FA] px-2 py-1 text-[12px] font-normal text-[#7B8798]">
                {item.category}
              </span>
            )}
            {item.examGroup && (
              <span className="rounded-sm bg-[#EEF3FF] px-2 py-1 text-[12px] font-normal text-[#4876EF]">
                {item.examGroup}
              </span>
            )}
          </div>

          <h3 className="mt-3 text-[18px] font-semibold tracking-tight text-[#333333] transition-colors group-hover:text-[#4876EF]">
            {item.examName}
          </h3>

          <p className="mt-2 line-clamp-2 text-[14px] leading-[1.65] text-[#667085]">
            {descriptionText || "자격증 상세 정보와 시험 일정을 확인해보세요."}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-[#7B8798]">
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              {item.organization || "기관 정보 없음"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {getNextScheduleLabel(item)}
            </span>
          </div>
        </div>

        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-[#B8C0CC] transition-colors group-hover:text-[#4876EF]" />
      </article>
    </Link>
  );
}
