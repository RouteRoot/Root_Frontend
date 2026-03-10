import Image from "next/image";
import Link from "next/link";

export default function Nav() {
  const MENUS = [
    { name: "서비스 소개", href: "/" },
    { name: "자격증 정보", href: "/qualifications" },
    { name: "커리어 확인", href: "/services" },
    { name: "커뮤니티", href: "/contact" },
    { name: "마이페이지", href: "/mypage" },
    { name: "고객센터", href: "/support" },
  ];

  return (
    <nav className="w-full h-16 bg-white">
      <div className="relative h-full max-w-400 mx-auto flex items-center px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-50">
        {/* 전체를 살짝 오른쪽으로 */}
        <div className="relative w-full h-full flex items-center lg:ml-10 xl:ml-16">
          <div className="flex items-center shrink-0">
            <Link href="/">
              <Image
                src="/logo.svg"
                alt="ROOT Logo"
                width={34}
                height={50}
                className="h-auto"
              />
            </Link>
          </div>
          <ul className="absolute left-1/2 -translate-x-1/2 hidden lg:flex gap-4 xl:gap-6 2xl:gap-8 font">
            {MENUS.map((menu) => (
              <li key={menu.name}>
                <Link
                  href={menu.href}
                  className="text-gray-500 hover:text-gray-900 whitespace-nowrap text-sm xl:text-base"
                >
                  {menu.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center shrink-0">
            <div className="hidden lg:flex items-center">
              <Link
                href="/login"
                className="text-gray-500 hover:text-gray-900 text-sm xl:text-base"
              >
                로그인
              </Link>

              <div className="h-4 border-l border-gray-300 mx-3" />

              <Link
                href="/signup"
                className="text-gray-500 hover:text-gray-900 text-sm xl:text-base"
              >
                회원가입
              </Link>
            </div>

            <button className="lg:hidden ml-4 text-2xl" aria-label="메뉴 열기">
              ☰
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
