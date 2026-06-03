"use client";

import { login } from "@/app/api/auth/authApi";
import type { LoginRequest } from "@/app/api/auth/authTypes";
import { ArrowLeft, Eye, EyeOff, Lock, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ErrorWithResponse = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginRequest>({
    loginId: "",
    loginPw: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  };

  const handleChange =
    (key: keyof LoginRequest) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [key]: event.target.value,
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
    <main className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-4">
        <header className="grid h-12 grid-cols-[40px_1fr_40px] items-center border-b border-[#EEF1F5]">
          <button
            type="button"
            onClick={goBack}
            aria-label="go back"
            className="flex h-10 w-10 items-center justify-center rounded-[8px] text-[#252A32] active:bg-[#F3F6FA]"
          >
            <ArrowLeft className="h-5.5 w-5.5" strokeWidth={2} />
          </button>
          <h1 className="text-center text-[16px] font-semibold text-[#111827]">
            로그인
          </h1>
          <Link
            href="/"
            aria-label="close login"
            className="flex h-10 w-10 items-center justify-center rounded-[8px] text-[#252A32] active:bg-[#F3F6FA]"
          >
            <X className="h-5.5 w-5.5" strokeWidth={2} />
          </Link>
        </header>

        <section className="flex flex-1 flex-col pt-10 lg:pt-28">
          <div className="contents">
          <div className="text-center">
            <Image
              src="/Group 55 (2).png"
              alt="로그인 안내 이미지"
              width={2508}
              height={1296}
              className="mx-auto h-auto w-1/2"
              priority
            />
            <p className="mt-3 text-center text-[14px] font-normal leading-[1.65] text-[#686A6D]">
              뿌리는 회원님의 익명성을 보장하기 위해
              <br />
              어떠한 개인정보도 노출하지 않습니다.
            </p>
            <p className="hidden text-[13px] font-medium text-[#252A32]">
              자격증 준비는 하나로 통한다!
            </p>
            <Link
              href="/"
              className="hidden mt-3 text-[44px] font-bold leading-none tracking-[-0.06em] text-[#4876EF]"
            >
              bburi
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="mt-9">
            <div className="space-y-2">
              <label className="relative block">
                <User className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#C3C8D0]" />
                <input
                  type="text"
                  value={form.loginId}
                  onChange={handleChange("loginId")}
                  placeholder="아이디"
                  className="h-[44px] w-full rounded-[8px] border border-[#D8DDE6] bg-white pl-11 pr-4 text-[14px] font-medium text-[#252A32] outline-none placeholder:text-[#A1A8B5] focus:border-[#4876EF]"
                />
              </label>

              <label className="relative block">
                <Lock className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#C3C8D0]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.loginPw}
                  onChange={handleChange("loginPw")}
                  placeholder="비밀번호"
                  className="h-[44px] w-full rounded-[8px] border border-[#D8DDE6] bg-white pl-11 pr-11 text-[14px] font-medium text-[#252A32] outline-none placeholder:text-[#A1A8B5] focus:border-[#4876EF]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="toggle password visibility"
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[8px] text-[#A1A8B5] active:bg-[#F3F6FA]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </label>
            </div>

            {errorMessage && (
              <p className="mt-3 text-[13px] font-medium text-red-500">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 h-[48px] w-full rounded-[8px] bg-[#4876EF] text-[15px] font-medium text-white active:bg-[#3F68D8] disabled:opacity-60"
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>

            <Link
              href="/signup"
              className="hidden"
            >
              회원가입
            </Link>

            <div className="mt-3 flex items-center justify-between gap-3 text-[13px] font-normal text-[#252A32]">
              <Link
                href="/signup"
                className="font-medium text-[#4876EF] active:text-[#3F68D8]"
              >
                회원가입
              </Link>
              <div className="flex items-center gap-3">
                <Link href="/find-id" className="active:text-[#4876EF]">
                  아이디 찾기
                </Link>
                <span className="h-3 w-px bg-[#D8DDE6]" />
                <Link href="/find-password" className="active:text-[#4876EF]">
                  비밀번호 찾기
                </Link>
              </div>
            </div>

            <div className="hidden mt-5 items-center justify-end gap-3 text-[13px] font-normal text-[#252A32]">
              <Link href="/find-id" className="active:text-[#4876EF]">
                아이디 찾기
              </Link>
              <span className="h-3 w-px bg-[#D8DDE6]" />
              <Link href="/find-password" className="active:text-[#4876EF]">
                비밀번호 찾기
              </Link>
            </div>
          </form>

          <div className="hidden mt-10 text-center">
            <Link href="/signup" className="text-[14px] font-medium text-[#475467]">
              회원가입
            </Link>
          </div>
          </div>
        </section>
      </div>
    </main>
  );
}
