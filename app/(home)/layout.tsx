import StandardLayout from "@/components/layouts/StandardLayout";
import Gnb from "@/components/gnb/Gnb";

export default function CombinedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F3F3F4" }}>
      <Gnb />
      <StandardLayout>
        {children}
      </StandardLayout>
    </div>
  );
}