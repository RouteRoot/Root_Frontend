export default function SidebarLayout({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="mx-auto flex w-full max-w-[1390px] gap-8 px-40 pb-40"
      style={{ paddingTop: "calc(8rem + var(--global-banner-height))" }}
    >
      <aside className="w-[240px] flex-none">{sidebar}</aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
