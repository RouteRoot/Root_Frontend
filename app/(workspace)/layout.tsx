import Gnb from "@/components/gnb/Gnb";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <Gnb />
      {children}
    </div>
  );
}
