import Link from "next/link";
import { Building2, CalendarDays, ChevronRight } from "lucide-react";
import {
  dashboardCertificates,
  type DashboardCertificateItem,
} from "./dashboardCertificateData";

function CertificateCard({ item }: { item: DashboardCertificateItem }) {
  return (
    <Link
      href={`/certificate/search?keyword=${encodeURIComponent(item.name)}`}
      className="group block h-full"
    >
      <article className="h-full overflow-hidden rounded-[9px] border border-[#EBEBEB] bg-white transition-colors duration-150 hover:border-[#D0D7E3]">
        <div
          className="relative flex h-32 items-end overflow-hidden px-5 pb-5"
          style={{ background: item.tone }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(255,255,255,0.28),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.02),rgba(15,23,42,0.5))]" />
          <div className="absolute -right-5 -top-6 h-24 w-24 rounded-full border border-white/20" />
          <div className="absolute right-10 top-8 h-12 w-12 rounded-full bg-white/10" />

          <div className="relative min-w-0">
            <span className="mb-2 inline-flex items-center rounded-full bg-white/18 px-2.5 py-1 text-[11px] font-bold leading-none text-white backdrop-blur">
              TOP {item.rank}
            </span>
            <h3 className="line-clamp-1 text-[18px] font-black tracking-tight text-white">
              {item.name}
            </h3>
          </div>
        </div>

        <div className="space-y-3 px-5 py-5">
          <div className="flex items-center gap-2 text-[14px] leading-none">
            <Building2 className="h-3.5 w-3.5 shrink-0 text-[#94A3B8]" />
            <span className="shrink-0 font-semibold text-[#8A94A6]">
              시험기관
            </span>
            <span className="min-w-0 truncate font-medium text-[#334155]">
              {item.agency}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[14px] leading-none">
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[#94A3B8]" />
            <span className="shrink-0 font-semibold text-[#8A94A6]">
              시험일
            </span>
            <span className="font-medium text-[#334155]">{item.examDate}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function DashboardCertificateSection() {
  return (
    <section className="mt-16">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-[22px] font-semibold font-black tracking-tight text-[#333333]">
          자격증 TOP16
        </p>

        <Link
          href="/certificate"
          className="flex items-center gap-0.5 text-[16px] font-medium text-[#94A3B8] transition-colors hover:text-[#4876EF]"
        >
          더보기
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardCertificates.map((item) => (
          <CertificateCard key={item.rank} item={item} />
        ))}
      </div>
    </section>
  );
}
