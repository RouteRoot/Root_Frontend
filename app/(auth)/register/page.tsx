"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signup } from "@/app/api/auth/authApi";
import type { SignupRequest } from "@/app/api/auth/authTypes";

export default function SignupPage() {
  const [form, setForm] = useState<SignupRequest>({
    loginId: "",
    loginPw: "",
    name: "",
    nickname: "",
    birthDate: "",
    phoneNumber: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange =
    (key: keyof SignupRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const result = await signup(form);

      if (result.status === 201) {
        window.location.href = "/login";
      }
    } catch {
      setErrorMessage("회원가입 실패");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F3F3F4]">
      <div className="mx-auto flex min-h-screen w-full flex-col items-center px-5 pt-[120px]">

        {/* 로고 */}
        <Link
          href="/"
          className="text-[36px] font-semibold tracking-[-0.05em] text-[#0075C3]"
        >
          BBURI
        </Link>

        {/* 설명 */}
        <p className="mt-5 text-center text-[14px] text-[#333333]">
          뿌리는 회원님의 목표 성장을 돕기 위해
          <br />
          불필요한 개인정보를 노출하지 않습니다.
        </p>

        {/* 카드 */}
        <section className="mt-8 w-full max-w-[380px] rounded-[14px] bg-white shadow-sm">
          <div className="px-[30px] pb-[28px] pt-[28px]">

            <h1 className="mb-[20px] text-[20px] font-semibold text-[#333333]">
              회원가입
            </h1>

            <form onSubmit={handleSubmit}>
              <div className="space-y-[10px]">

                <input
                  type="text"
                  placeholder="이메일"
                  value={form.loginId}
                  onChange={handleChange("loginId")}
                  className="h-[46px] w-full rounded-md border border-[#E5E7EB] px-4 text-[14px] outline-none focus:border-[#0075C3]"
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호"
                    value={form.loginPw}
                    onChange={handleChange("loginPw")}
                    className="h-[46px] w-full rounded-md border border-[#E5E7EB] px-4 pr-10 text-[14px] outline-none focus:border-[#0075C3]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="이름"
                  value={form.name}
                  onChange={handleChange("name")}
                  className="h-[46px] w-full rounded-md border border-[#E5E7EB] px-4 text-[14px]"
                />

                <input
                  type="text"
                  placeholder="닉네임"
                  value={form.nickname}
                  onChange={handleChange("nickname")}
                  className="h-[46px] w-full rounded-md border border-[#E5E7EB] px-4 text-[14px]"
                />

                <input
                  type="date"
                  value={form.birthDate}
                  onChange={handleChange("birthDate")}
                  className="h-[46px] w-full rounded-md border border-[#E5E7EB] px-4 text-[14px]"
                />

                <input
                  type="text"
                  placeholder="전화번호"
                  value={form.phoneNumber}
                  onChange={handleChange("phoneNumber")}
                  className="h-[46px] w-full rounded-md border border-[#E5E7EB] px-4 text-[14px]"
                />

              </div>

              {errorMessage && (
                <p className="mt-3 text-sm text-red-500">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-3 h-[48px] w-full rounded-md bg-[#0075C3] text-[15px] font-semibold text-white hover:bg-[#0069AF]"
              >
                {isLoading ? "가입 중..." : "회원가입"}
              </button>

            </form>
          </div>

          {/* 하단 */}
          <div className="border-t border-[#EEF1F5] px-[30px] py-[18px] text-center text-sm text-[#333333]">
            이미 계정이 있으신가요?
            <Link href="/login" className="ml-2 font-semibold text-[#0075C3]">
              로그인
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}