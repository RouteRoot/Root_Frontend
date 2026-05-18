export default function SidebarLayout({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ paddingTop: "calc(8rem + var(--global-banner-height))" }}
      className="pb-40"
    >
      <div className="mx-auto w-full max-w-[1375px] px-40">
        {/* relative wrapper — sidebar anchors to this, content keeps StandardLayout alignment */}
        <div className="relative">
          {/* Sidebar: centered in the full left gutter */}
          <div
            className="absolute top-0 h-full flex justify-center"
            style={{
              right: "100%",
              width: "calc((100vw - 1375px) / 2 + 160px)",
            }}
          >
            <div
              className="w-full max-w-[210px]"
              style={{
                position: "sticky",
                top: "calc(129px + var(--global-banner-height))",
                alignSelf: "flex-start",
              }}
            >
              {sidebar}
            </div>
          </div>

          {/* Content: exact same alignment as StandardLayout */}
          {children}
        </div>
      </div>
    </div>
  );
}
