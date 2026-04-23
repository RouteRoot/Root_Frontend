type SectionHeaderProps = {
  title: string;
};

export default function SectionHeader({ title }: SectionHeaderProps) {
  return <p>{title}</p>;
}
