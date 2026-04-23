type NoticeCardProps = {
  href?: string;
  date: string;
  title: string;
  description: string;
};

export default function NoticeCard({
  href = "#",
  date,
  title,
  description,
}: NoticeCardProps) {
  return (
    <a href={href}>
      <pre>{JSON.stringify({ date, title, description }, null, 2)}</pre>
    </a>
  );
}
