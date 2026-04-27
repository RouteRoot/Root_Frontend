import StandardLayout from "@/components/layouts/StandardLayout";

export default function PlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StandardLayout>{children}</StandardLayout>;
}
