import Gnb from "@/components/gnb/Gnb";

export default function CertificateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <Gnb />

      <main className="mx-auto w-full max-w-[1610px] px-40 pt-32 pb-40">
        {children}
      </main>
    </div>
  );
}
