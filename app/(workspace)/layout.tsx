'use client';

import { usePathname } from 'next/navigation';
import Gnb from '@/components/gnb/Gnb';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isCommunity = pathname.startsWith('/community');

  return (
    <div className="min-h-screen bg-white">
      <Gnb />
      <main
        className="mx-auto w-full max-w-[1390px] px-40 pb-40 bg"
        style={{ paddingTop: "calc(8rem + var(--global-banner-height))" }}
      >
        {children}
      </main>
    </div>
  );
}
