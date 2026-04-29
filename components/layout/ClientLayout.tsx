"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import GlobalBannerPopup from "@/components/common/GlobalBannerPopup";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [checkedPath, setCheckedPath] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const authPaths = ["/login", "/register", "/signup"];
    const protectedPaths = [
      "/dashboard",
      "/community",
      "/plan",
      "/roadmap",
      "/certificate",
      "/notification",
      "/mypage",
      "/settings",
    ];

    const isAuthPath = authPaths.includes(pathname);
    const isProtectedPath = protectedPaths.some((path) =>
      pathname.startsWith(path)
    );

    if (token && isAuthPath) {
      router.replace("/dashboard");
      return;
    }

    if (!token && isProtectedPath) {
      router.replace("/login");
      return;
    }

    const timer = window.setTimeout(() => {
      setCheckedPath(pathname);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [pathname, router]);

  if (checkedPath !== pathname) return null;

  return (
    <>
      <GlobalBannerPopup />
      {children}
    </>
  );
}
// "use client";

// import { useEffect, useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import GlobalBannerPopup from "@/components/common/GlobalBannerPopup";

// export default function ClientLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [checked, setChecked] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");

//     const publicPaths = ["/", "/login", "/signup"];
//     const authPaths = ["/login", "/signup"];

//     const isPublicPath = publicPaths.includes(pathname);
//     const isAuthPath = authPaths.includes(pathname);

//     if (!token && !isPublicPath) {
//       router.replace("/login");
//       return;
//     }

//     if (token && isAuthPath) {
//       router.replace("/dashboard");
//       return;
//     }

//     setTimeout(() => {
//       setChecked(true);
//     }, 0);
//   }, [pathname, router]);

//   if (!checked) return null;

//   return (
//     <>
//       <GlobalBannerPopup />
//       {children}
//     </>
//   );
// }
