import StandardLayout from "@/components/layouts/StandardLayout";

export default function RoadmapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StandardLayout>{children}</StandardLayout>;
}
