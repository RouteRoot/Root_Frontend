import type { CertificateScheduleSummary } from "@/app/api/certificate/types";

type CertificateResultCardProps = {
  examName: string;
  schedules: CertificateScheduleSummary[];
};

export default function CertificateResultCard({
  examName,
  schedules,
}: CertificateResultCardProps) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-[11px] font-black uppercase tracking-[0.08em] text-slate-400">
        CERTIFICATE
      </p>

      <h3 className="mt-3 text-[22px] font-black tracking-tight text-slate-900">
        {examName}
      </h3>

      <div className="mt-5 space-y-3">
        {schedules.length === 0 && (
          <p className="rounded-2xl bg-slate-50 px-4 py-4 text-[13px] font-semibold text-slate-400">
            등록된 시험 일정이 없습니다.
          </p>
        )}

        {schedules.map((schedule, index) => (
          <div key={index} className="rounded-2xl bg-slate-50 px-4 py-4">
            <p className="text-[13px] font-black text-slate-800">
              {schedule.round ?? "일정 정보"}
            </p>

            <div className="mt-2 space-y-1 text-[13px] text-slate-500">
              {schedule.docExamStart && (
                <p>필기시험: {schedule.docExamStart}</p>
              )}
              {typeof schedule.docDDay === "number" && (
                <p>필기 D-day: {schedule.docDDay}</p>
              )}
              {schedule.pracExamStart && (
                <p>실기시험: {schedule.pracExamStart}</p>
              )}
              {typeof schedule.pracDDay === "number" && (
                <p>실기 D-day: {schedule.pracDDay}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
