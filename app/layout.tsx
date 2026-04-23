import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/shared/components/layout/ClientLayout";

export const metadata: Metadata = {
  title: "BBuri",
  description: "BBuri",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
