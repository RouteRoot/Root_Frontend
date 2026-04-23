import Link from "next/link";

type TodayPlanCardProps = {
  subtitle: string;
  certificateName: string;
  currentDay: number;
  totalDay: number;
  href: string;
};

export default function TodayPlanCard({
  subtitle,
  certificateName,
  currentDay,
  totalDay,
  href,
}: TodayPlanCardProps) {
  return (
    <Link href={href}>
      <pre>
        {JSON.stringify(
          { subtitle, certificateName, currentDay, totalDay },
          null,
          2
        )}
      </pre>
    </Link>
  );
}
