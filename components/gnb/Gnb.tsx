"use client";

import { getMe } from "@/app/api/service/user";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GnbNav from "./GnbNav";
import GnbSearchBar from "./GnbSearchBar";
import GnbUserMenu from "./GnbUserMenu";

export default function Gnb() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ 추가

  useEffect(() => {
    async function fetchMe() {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setUserName("");
        setIsLoggedIn(false);
        return;
      }

      try {
        const data = await getMe();
        setUserName(data.name);
        setIsLoggedIn(true); // ✅ 로그인 상태
      } catch {
        localStorage.removeItem("accessToken");
        setUserName("");
        setIsLoggedIn(false); // ❌ 비로그인 상태
      }
    }
    fetchMe();
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 49);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("roadmapId");
      localStorage.removeItem("examTaskId");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Failed to clear storage on logout:", error);
    }
    router.push("/login");
  };

  return (
    <header
      className={`fixed inset-x-0 z-50 bg-white text-[#222] transition-shadow duration-200 ${scrolled ? "shadow-[0_2px_12px_rgba(0,0,0,0.08)]" : ""}`}
      style={{ top: "var(--global-banner-height)" }}
    >
      {scrolled ? (
        <div className="relative flex h-16 items-center justify-center border-b border-[#e5e8eb] bg-white px-6">
          <Link
            href="/dashboard"
            className="absolute left-4 flex items-center text-[28px] font-bold leading-none tracking-[-0.04em] text-[#4876EF]"
          >
            BBuri
          </Link>
          <GnbSearchBar compact />
        </div>
      ) : (
        <>
          <div className="flex h-[49px] items-center border-b border-[#e5e8eb]">
            <div className="flex h-full min-w-0 flex-1 items-center">
              <Link
                href="/dashboard"
                className="flex h-full w-[158px] items-center px-4 text-[28px] font-bold leading-none tracking-[-0.04em] text-[#4876EF]"
              >
                BBuri
              </Link>
              <GnbNav />
            </div>

            {/* ✅ 여기만 분기 */}
            <div className="flex h-full items-center">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/notification"
                    aria-label="Notifications"
                    className="flex h-9 w-9 items-center justify-center rounded-[6px] text-[#475467] transition-colors hover:bg-[#f6f7f9]"
                  >
                    <Bell className="h-[18px] w-[18px]" strokeWidth={1.9} />
                  </Link>

                  <GnbUserMenu userName={userName} onLogout={handleLogout} />
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 text-[13px] text-[#344054] hover:text-[#4876EF]"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 text-[13px] text-[#344054] hover:text-[#4876EF]"
                  >
                    회원가입
                  </Link>
                </>
              )}

              <Link
                href="/certificate"
                className="flex h-full items-center border-l border-[#e5e8eb] px-7 text-[13px] font-medium text-[#344054] transition-colors hover:text-[#4876EF]"
              >
                문의하기
              </Link>
            </div>
          </div>

          <GnbSearchBar />
        </>
      )}
    </header>
  );
}
// "use client";

// import { getMe } from "@/app/api/service/user";
// import { Bell } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import GnbNav from "./GnbNav";
// import GnbSearchBar from "./GnbSearchBar";
// import GnbUserMenu from "./GnbUserMenu";

// export default function Gnb() {
//   const router = useRouter();
//   const [userName, setUserName] = useState<string>("");
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     async function fetchMe() {
//       try {
//         const data = await getMe();
//         setUserName(data.name);
//       } catch (error) {
//         console.error("Failed to fetch user:", error);
//         setUserName("");
//       }
//     }
//     fetchMe();
//   }, []);

//   useEffect(() => {
//     const handler = () => setScrolled(window.scrollY > 49);
//     window.addEventListener("scroll", handler, { passive: true });
//     return () => window.removeEventListener("scroll", handler);
//   }, []);

//   const handleLogout = () => {
//     try {
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//       localStorage.removeItem("roadmapId");
//       localStorage.removeItem("examTaskId");
//       localStorage.removeItem("user");
//     } catch (error) {
//       console.error("Failed to clear storage on logout:", error);
//     }
//     router.push("/login");
//   };

//   return (
//     <header
//       className={`fixed inset-x-0 z-50 bg-white text-[#222] transition-shadow duration-200 ${scrolled ? "shadow-[0_2px_12px_rgba(0,0,0,0.08)]" : ""}`}
//       style={{ top: "var(--global-banner-height)" }}
//     >
//       {scrolled ? (
//         <div className="relative flex h-16 items-center justify-center border-b border-[#e5e8eb] bg-white px-6">
//           <Link
//             href="/dashboard"
//             className="absolute left-4 flex items-center text-[28px] font-bold leading-none tracking-[-0.04em] text-[#0075c3]"
//           >
//             BBuri
//           </Link>
//           <GnbSearchBar compact />
//         </div>
//       ) : (
//         <>
//           <div className="flex h-[49px] items-center border-b border-[#e5e8eb]">
//             <div className="flex h-full min-w-0 flex-1 items-center">
//               <Link
//                 href="/dashboard"
//                 className="flex h-full w-[158px] items-center px-4 text-[28px] font-bold leading-none tracking-[-0.04em] text-[#0075c3]"
//               >
//                 BBuri
//               </Link>
//               <GnbNav />
//             </div>
//             <div className="flex h-full items-center">
//               <Link
//                 href="/notification"
//                 aria-label="Notifications"
//                 className="flex h-9 w-9 items-center justify-center rounded-[6px] text-[#475467] transition-colors hover:bg-[#f6f7f9]"
//               >
//                 <Bell className="h-[18px] w-[18px]" strokeWidth={1.9} />
//               </Link>
//               <GnbUserMenu userName={userName} onLogout={handleLogout} />
//               <Link
//                 href="/certificate"
//                 className="flex h-full items-center border-l border-[#e5e8eb] px-7 text-[13px] font-medium text-[#344054] transition-colors hover:text-[#0FA9CC]"
//               >
//                 문의하기
//               </Link>
//             </div>
//           </div>
//           <GnbSearchBar />
//         </>
//       )}
//     </header>
//   );
// }
