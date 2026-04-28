import StandardLayout from "@/components/layouts/StandardLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F3F3F4" }}>
      <StandardLayout>{children}</StandardLayout>
    </div>
  );
}
