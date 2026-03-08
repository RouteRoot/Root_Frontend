import React from "react";
import Nav from "@/components/shared/nav/Nav";

export default function LoginPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-white">
    <Nav />
    {children}
  </div>;
}
