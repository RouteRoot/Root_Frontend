type Schedule = {
  round: string;
  docExamStart?: string;
  docDday?: number;
  pracExamStart?: string;
  pracDday?: number;
};

type CertificateResultCardProps = {
  examName: string;
  schedules: Schedule[];
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
        {schedules.map((schedule, index) => (
          <div key={index} className="rounded-2xl bg-slate-50 px-4 py-4">
            <p className="text-[13px] font-black text-slate-800">
              {schedule.round}
            </p>

            <div className="mt-2 space-y-1 text-[13px] text-slate-500">
              {schedule.docExamStart && (
                <p>필기시험: {schedule.docExamStart}</p>
              )}
              {typeof schedule.docDday === "number" && (
                <p>필기 D-day: {schedule.docDday}</p>
              )}
              {schedule.pracExamStart && (
                <p>실기시험: {schedule.pracExamStart}</p>
              )}
              {typeof schedule.pracDday === "number" && (
                <p>실기 D-day: {schedule.pracDday}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}