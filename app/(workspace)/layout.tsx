import Gnb from "@/components/gnb/Gnb";
import Footer from "@/components/common/Footer";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <Gnb />
      {children}
      <Footer />
    </div>
  );
}
