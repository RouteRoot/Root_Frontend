import StandardLayout from "@/components/layouts/StandardLayout";

export default function CertificateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StandardLayout>{children}</StandardLayout>;
}
