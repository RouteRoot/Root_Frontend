export default function SidebarLayout({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="pb-24 pt-[calc(4.5rem+var(--global-banner-height))] lg:pb-40 lg:pt-[calc(8rem+var(--global-banner-height))]"
    >
      <div className="mx-auto w-full max-w-[1375px] px-4 lg:px-40">
        {/* relative wrapper — sidebar anchors to this, content keeps StandardLayout alignment */}
        <div className="relative">
          {/* Sidebar: centered in the full left gutter */}
          <div
            className="absolute top-0 hidden h-full justify-center lg:flex"
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
