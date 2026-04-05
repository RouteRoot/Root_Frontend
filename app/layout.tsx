import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

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
      <body className="font-[Arial,Helvetica,sans-serif] antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}