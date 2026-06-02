import StandardLayout from "@/components/layouts/StandardLayout";
import Gnb from "@/components/gnb/Gnb";
import Footer from "@/components/common/Footer";
import MobileBottomNav from "@/mobile/components/MobileBottomNav";
import MobileHeader from "@/mobile/components/MobileHeader";

export default function CombinedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F3F3F4" }}>
      <div className="hidden lg:block">
        <Gnb />
      </div>
      <MobileHeader />
      <StandardLayout>
        {children}
      </StandardLayout>
      <div className="hidden lg:block">
        <Footer />
      </div>
      <MobileBottomNav />
    </div>
  );
}
