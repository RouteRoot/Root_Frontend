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
    <nav className="relative w-full h-16 bg-white flex items-center px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
      <div className="flex items-center">
        <Image
          src="/logo.svg"
          alt="ROOT Logo"
          width={64}
          height={50}
          className="h-auto"
        />
      </div>
      <ul className="absolute left-1/2 -translate-x-1/2 hidden lg:flex gap-4 md:gap-6 lg:gap-8">
        {MENUS.map((menu) => (
          <li key={menu.name}>
            <Link
              href={menu.href}
              className="text-gray-500 hover:text-gray-900 whitespace-nowrap"
            >
              {menu.name}
            </Link>
          </li>
        ))}
      </ul>
      <div className="ml-auto flex items-center">
        <div className="hidden lg:flex items-center">
          <Link href="/login" className="text-gray-500 hover:text-gray-900">
            로그인
          </Link>
          <div className="h-4 border-l border-gray-300 mx-3"></div>
          <Link href="/signup" className="text-gray-500 hover:text-gray-900">
            회원가입
          </Link>
        </div>
        <button className="lg:hidden ml-4 text-2xl">☰</button>
      </div>
    </nav>
  );
}
