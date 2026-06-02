export default function StandardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="mx-auto w-full max-w-[1390px] px-4 pb-24 pt-[calc(4.5rem+var(--global-banner-height))] lg:px-40 lg:pb-40 lg:pt-[calc(8rem+var(--global-banner-height))]"
    >
      {children}
    </main>
  );
}
