import Sidebar from "@/components/shared/bar/Sidebar";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f7f7f5]">
      <Sidebar />

      <main className="min-w-0 flex-1 bg-[#fbfbfa]">
        <div className="mx-auto w-full max-w-6xl px-10 pb-16 pt-12">
          {children}
        </div>
      </main>
    </div>
  );
}
