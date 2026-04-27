export default function StandardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="mx-auto w-full max-w-[1390px] px-40 pb-40"
      style={{ paddingTop: "calc(8rem + var(--global-banner-height))" }}
    >
      {children}
    </main>
  );
}
