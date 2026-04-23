type ExploreSectionHeaderProps = {
  title?: string;
  description?: string;
};

export default function ExploreSectionHeader({
  title = "EXPLORE",
  description = "Explore certificates",
}: ExploreSectionHeaderProps) {
  return <pre>{JSON.stringify({ title, description }, null, 2)}</pre>;
}
