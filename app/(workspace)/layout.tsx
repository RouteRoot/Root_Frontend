import Sidebar from "@/components/shared/bar/Sidebar";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#ffffff]">
      <Sidebar />

      <main className="min-w-0 flex-1 bg-[#ffffff]">
        <div className="mx-auto w-full max-w-8xl px-40 pb-16 pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
