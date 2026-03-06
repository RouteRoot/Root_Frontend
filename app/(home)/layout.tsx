import React from "react";
import Nav from "@/components/shared/nav/Nav";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-white">
    <Nav />
    {children}
  </div>;
}
