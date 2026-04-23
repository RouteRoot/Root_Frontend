"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const publicPaths = ["/", "/login", "/signup"];
    const authPaths = ["/login", "/signup"];

    const isPublicPath = publicPaths.includes(pathname);
    const isAuthPath = authPaths.includes(pathname);

    if (!token && !isPublicPath) {
      router.replace("/login");
      return;
    }

    if (token && isAuthPath) {
      router.replace("/dashboard");
      return;
    }

    setTimeout(() => {
      setChecked(true);
    }, 0);
  }, [pathname, router]);

  if (!checked) return null;

  return <>{children}</>;
}
