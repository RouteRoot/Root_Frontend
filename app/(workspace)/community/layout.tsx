import StandardLayout from "@/components/layouts/StandardLayout";

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StandardLayout>{children}</StandardLayout>;
}
