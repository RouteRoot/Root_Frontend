"use client";

import { signup } from "@/app/api/auth/authApi";
import type { SignupRequest } from "@/app/api/auth/authTypes";
import {
  ArrowLeft,
  Calendar,
  Eye,
  EyeOff,
  Lock,
  Phone,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SignupField = keyof SignupRequest;

export default function SignupPage() {
  const router = useRouter();
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

  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  };

  const handleChange =
    (key: SignupField) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [key]: event.target.value,
      }));

      if (errorMessage) setErrorMessage("");
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.loginId.trim() || !form.loginPw.trim() || !form.name.trim()) {
      setErrorMessage("아이디, 비밀번호, 이름을 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      const result = await signup(form);

      if (result.status === 201) {
        window.location.href = "/login";
        return;
      }

      setErrorMessage("회원가입에 실패했습니다.");
    } catch {
      setErrorMessage("회원가입에 실패했습니다.");
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
            회원가입
          </h1>
          <Link
            href="/"
            aria-label="close signup"
            className="flex h-10 w-10 items-center justify-center rounded-[8px] text-[#252A32] active:bg-[#F3F6FA]"
          >
            <X className="h-5.5 w-5.5" strokeWidth={2} />
          </Link>
        </header>

        <section className="flex flex-1 flex-col pt-10 lg:pt-32">
          <div className="text-center">
            <p className="text-[13px] font-medium text-[#252A32]">
              자격증 준비는 하나로 통한다!
            </p>
            <Link
              href="/"
              className="mt-3 inline-block text-[44px] font-bold leading-none tracking-[-0.06em] text-[#4876EF]"
            >
              bburi
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="mt-10">
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

              <label className="relative block">
                <User className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#C3C8D0]" />
                <input
                  type="text"
                  value={form.name}
                  onChange={handleChange("name")}
                  placeholder="이름"
                  className="h-[44px] w-full rounded-[8px] border border-[#D8DDE6] bg-white pl-11 pr-4 text-[14px] font-medium text-[#252A32] outline-none placeholder:text-[#A1A8B5] focus:border-[#4876EF]"
                />
              </label>

              <label className="relative block">
                <User className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#C3C8D0]" />
                <input
                  type="text"
                  value={form.nickname}
                  onChange={handleChange("nickname")}
                  placeholder="닉네임"
                  className="h-[44px] w-full rounded-[8px] border border-[#D8DDE6] bg-white pl-11 pr-4 text-[14px] font-medium text-[#252A32] outline-none placeholder:text-[#A1A8B5] focus:border-[#4876EF]"
                />
              </label>

              <label className="relative block">
                <Calendar className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#C3C8D0]" />
                <input
                  type="date"
                  value={form.birthDate}
                  onChange={handleChange("birthDate")}
                  className="h-[44px] w-full rounded-[8px] border border-[#D8DDE6] bg-white pl-11 pr-4 text-[14px] font-medium text-[#252A32] outline-none placeholder:text-[#A1A8B5] focus:border-[#4876EF]"
                />
              </label>

              <label className="relative block">
                <Phone className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#C3C8D0]" />
                <input
                  type="text"
                  value={form.phoneNumber}
                  onChange={handleChange("phoneNumber")}
                  placeholder="전화번호"
                  className="h-[44px] w-full rounded-[8px] border border-[#D8DDE6] bg-white pl-11 pr-4 text-[14px] font-medium text-[#252A32] outline-none placeholder:text-[#A1A8B5] focus:border-[#4876EF]"
                />
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
              {isLoading ? "가입 중..." : "회원가입"}
            </button>
          </form>

          <div className="mt-8 text-center text-[14px] font-normal text-[#667085]">
            이미 계정이 있으신가요?
            <Link href="/login" className="ml-2 font-medium text-[#4876EF]">
              로그인
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
