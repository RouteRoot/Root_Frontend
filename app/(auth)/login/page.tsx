"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { login } from "@/app/api/auth/authApi";
import type { LoginRequest } from "@/app/api/auth/authTypes";

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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange =
    (key: keyof LoginRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
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

    return "A server error occurred.";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.loginId.trim() || !form.loginPw.trim()) {
      setErrorMessage("Please enter both ID and password.");
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

      if (token && typeof token === "string") {
        localStorage.setItem("accessToken", token);

        if (typeof result.data?.userId === "number") {
          localStorage.setItem("userId", String(result.data.userId));
        }

        window.location.href = "/dashboard";
        return;
      }

      setErrorMessage(result.data?.message || "Login failed. Please try again.");
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_1.05fr]">
        <section className="flex items-center justify-center px-6 py-12 lg:px-20">
          <div className="w-full max-w-[430px]">
            <div className="rounded-[28px] border border-black/10 bg-white px-7 py-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
              <div className="mb-7">
                <h2 className="text-[18px] font-semibold tracking-[-0.03em] text-black">
                  Welcome back
                </h2>
                <p className="mt-1 text-[15px] leading-6 text-[#7a7a75]">
                  Sign in to continue to your BBURI.
                </p>
              </div>

              <button
                type="button"
                className="flex h-[54px] w-full items-center justify-center gap-3 rounded-[18px] border border-[#dfddd7] bg-white text-[15px] font-medium text-black transition hover:bg-[#faf9f6]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.56-5.17 3.56-8.65Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.73-2.46 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.26v3.12A12 12 0 0 0 12 24Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.29V6.59H1.26A12 12 0 0 0 0 12c0 1.94.46 3.77 1.26 5.41l4.01-3.12Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.77c1.76 0 3.34.61 4.58 1.8l3.43-3.43C17.95 1.14 15.24 0 12 0A12 12 0 0 0 1.26 6.59l4.01 3.12c.95-2.85 3.6-4.94 6.73-4.94Z"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#e7e4de]" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-[13px] text-[#9a9891]">OR</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={form.loginId}
                  onChange={handleChange("loginId")}
                  placeholder="Email address"
                  className="h-[54px] w-full rounded-[18px] border border-[#dfddd7] bg-white px-5 text-[15px] text-black outline-none transition placeholder:text-[#9b98a9] focus:border-black"
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.loginPw}
                    onChange={handleChange("loginPw")}
                    placeholder="Password"
                    className="h-[54px] w-full rounded-[18px] border border-[#dfddd7] bg-white px-5 pr-12 text-[15px] text-black outline-none transition placeholder:text-[#9b98a9] focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b887f] transition hover:text-black"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {errorMessage && (
                  <div className="rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-600">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 flex h-[54px] w-full items-center justify-center rounded-[18px] bg-black text-[15px] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "Logging in..." : "Log in"}
                </button>
              </form>

              <div className="mt-7 text-center">
                <button
                  type="button"
                  className="text-[15px] font-medium text-[#4f4f4b] underline underline-offset-4 transition hover:text-black"
                >
                  Forgot password?
                </button>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-[15px] text-[#6b6b66]">
                <span>Dont have an account?</span>
                <Link
                  href="/signup"
                  className="font-semibold text-black hover:opacity-70 underline underline-offset-4 transition"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="relative hidden min-h-screen lg:block">
          <div className="absolute inset-0 bg-black" />
          <div className="relative h-full w-full">
            <Image
              src="/main-hero.png"
              alt="people"
              fill
              priority
              className="object-cover grayscale"
            />
          </div>
          <div className="absolute inset-0 bg-black/10" />
        </section>
      </div>
    </main>
  );
}