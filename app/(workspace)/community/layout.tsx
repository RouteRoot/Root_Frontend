import CommunityGnb from "@/components/gnb/CommunityGnb";

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <CommunityGnb />

      <main className="mx-auto w-full max-w-[1610px] px-40 pt-32 pb-40">
        {children}
      </main>
    </div>
  );
}
