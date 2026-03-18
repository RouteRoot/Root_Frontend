"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/api/auth/authApi";

import Input from "@/components/shared/auth/input";
import BasicButton from "@/components/buttons/BasicButton";

export default function Login() {
  const router = useRouter();
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await login({ loginId, loginPw });
      const token = result.data?.token;

      if (token) {
        localStorage.setItem("accessToken", token);
        router.replace("/dashboard");
      }
    } catch (err) {
      console.error("로그인 실패:", err);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="relative min-h-[calc(100vh-31vh)] overflow-hidden bg-white">
        <div className="absolute bottom-[7%] left-[4%] w-[45%] max-w-250">
          <Image
            src="/main-page-image.svg"
            alt="ROOTY"
            width={1200}
            height={900}
            priority
            className="h-auto w-full"
          />
        </div>

        <div className="absolute right-[13%] top-[25%] w-[40%] max-w-xl">
          <h1 className="text-6xl font-bold leading-tight text-gray-900">
            뿌리에서 스펙을
            <br />
            시작해보세요!
          </h1>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <Input
              type="text"
              placeholder="아이디"
              value={loginId}
              autoComplete="username"
              onChange={(e) => setLoginId(e.target.value)}
            />

            <Input
              type="password"
              placeholder="비밀번호"
              value={loginPw}
              autoComplete="current-password"
              onChange={(e) => setLoginPw(e.target.value)}
            />

            <BasicButton type="submit" fullWidth>
              로그인
            </BasicButton>
          </form>

          <div className="mt-6 text-sm text-gray-500">
            아이디가 없으신가요?{" "}
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="font-medium text-black transition hover:underline"
            >
              회원가입
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
