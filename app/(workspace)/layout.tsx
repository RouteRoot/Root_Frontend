import ClientLayout from "@/components/layout/ClientLayout";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
