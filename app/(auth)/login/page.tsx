"use client";

import { useState } from "react";
import Image from "next/image";
import { login } from "@/app/api/auth/authApi";
import Input from "@/components/shared/auth/input";
import BasicButton from "@/components/buttons/BasicButton";

export default function Login() {
    
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await login({ loginId, loginPw });
      console.log(result);
      alert("로그인 성공");
    } catch (err) {
      console.error(err);
      alert("로그인 실패");
    }
  };

  return (
    <main>
      <section className="relative h-[calc(100vh-63.0px)] overflow-hidden bg-linear-to-b from-white via-[#e7d3c2] to-[#ebc3a4]">
        <div className="absolute bottom-10 left-10 z-10">
          <Image
            src="/rooty-2.svg"
            alt="ROOTY"
            width={640}
            height={450}
            priority
          />
        </div>
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-start justify-end px-6 pr-45 pt-[20vh]">
          <div className="max-w-xl text-left">
            <h1 className="text-6xl font-bold leading-tight text-gray-900">
              뿌리에서 스펙을
              <br />
              시작해보세요!
            </h1>
            <form onSubmit={handleLogin} className="mt-10 space-y-4">
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
          </div>
        </div>
      </section>
    </main>
  );
}
