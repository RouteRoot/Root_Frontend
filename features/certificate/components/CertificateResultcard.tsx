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
  return <pre>{JSON.stringify({ examName, schedules }, null, 2)}</pre>;
}
