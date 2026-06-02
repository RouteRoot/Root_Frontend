import Gnb from "@/components/gnb/Gnb";
import Footer from "@/components/common/Footer";
import MobileBottomNav from "@/mobile/components/MobileBottomNav";
import MobileHeader from "@/mobile/components/MobileHeader";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <div className="hidden lg:block">
        <Gnb />
      </div>
      <MobileHeader />
      {children}
      <div className="hidden lg:block">
        <Footer />
      </div>
      <MobileBottomNav />
    </div>
  );
}
