"use client";

import { login } from "@/app/api/auth/authApi";
import type { LoginRequest } from "@/app/api/auth/authTypes";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type ErrorWithResponse = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

export default function LandingPage() {
  const [form, setForm] = useState<LoginRequest>({
    loginId: "",
    loginPw: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [keepLogin, setKeepLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange =
    (key: keyof LoginRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));

      if (errorMessage) setErrorMessage("");
    };

  const getErrorMessage = (error: unknown): string => {
    if (typeof error === "object" && error !== null) {
      const err = error as ErrorWithResponse;

      if (typeof err.response?.data?.message === "string") {
        return err.response.data.message;
      }

      if (typeof err.message === "string") {
        return err.message;
      }
    }

    return "서버 오류가 발생했습니다.";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.loginId.trim() || !form.loginPw.trim()) {
      setErrorMessage("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      const result = await login({
        loginId: form.loginId.trim(),
        loginPw: form.loginPw,
      });

      const token = result.data?.token;

      if (token) {
        localStorage.setItem("accessToken", token);
        window.location.href = "/dashboard";
        return;
      }

      setErrorMessage(result.data?.message || "로그인 실패");
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F3F3F4]">
      <div className="mx-auto flex min-h-screen w-full flex-col items-center px-5 pt-[150px]">
        {/* 로고 */}
        <Link
          href="/"
          className="text-[36px] font-semibold tracking-[-0.05em] text-[#0075C3]"
        >
          BBURI
        </Link>

        {/* 설명 */}
        <p className="mt-5 text-center text-[14px] leading-[1.7] text-[#333333]">
          뿌리는 회원님의 목표 성장을 돕기 위해
          <br />
          불필요한 개인정보를 노출하지 않습니다.
        </p>

        {/* 카드 */}
        <section className="mt-8 w-full max-w-[380px] rounded-[14px] bg-white shadow-sm">
          <div className="px-[30px] pb-[28px] pt-[28px]">
            <h1 className="mb-[20px] text-[20px] font-semibold text-[#323438]">
              로그인
            </h1>

            <form onSubmit={handleSubmit}>
              <div className="space-y-[10px]">
                {/* 이메일 */}
                <div className="relative">
                  <input
                    type="text"
                    value={form.loginId}
                    onChange={handleChange("loginId")}
                    placeholder="이메일 주소"
                    className="h-[46px] w-full rounded-md border border-gray-300 pl-5 pr-4 text-[14px] outline-none focus:border-[#0075C3]"
                  />
                </div>

                {/* 비밀번호 */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.loginPw}
                    onChange={handleChange("loginPw")}
                    placeholder="비밀번호"
                    className="h-[46px] w-full rounded-md border border-gray-300 pl-5 pr-10 text-[14px] outline-none focus:border-[#0075C3]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* 에러 */}
              {errorMessage && (
                <p className="mt-3 text-sm text-red-500">{errorMessage}</p>
              )}

              {/* 버튼 */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-3 h-[48px] w-full rounded-md bg-[#0075C3] text-[15px] font-semibold text-white hover:bg-[#0069AF]"
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </button>

              {/* 옵션 */}
              <div className="mt-4 flex items-center justify-between text-sm text-[#323438]">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={keepLogin}
                    onChange={() => setKeepLogin((prev) => !prev)}
                  />
                  로그인 상태 유지
                </label>

                <Link href="/find-password" className="hover:text-[#323438]">
                  비밀번호 찾기
                </Link>
              </div>
            </form>
          </div>

          {/* 하단 */}
          <div className="border-t border-[#E5E7EB] px-[30px] py-[18px] text-center text-sm text-[#323438]">
            {" "}
            아직 회원이 아니세요?
            <Link href="/signup" className="ml-2 font-semibold text-[#0075C3]">
              회원가입
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
