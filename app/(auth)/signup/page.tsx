"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signup } from "@/app/api/auth/authApi";
import type { SignupRequest } from "@/app/api/auth/authTypes";

type ErrorWithResponse = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

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
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange =
    (key: keyof SignupRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));

      if (errorMessage) setErrorMessage("");
      if (successMessage) setSuccessMessage("");
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

    if (
      !form.loginId.trim() ||
      !form.loginPw.trim() ||
      !form.name.trim() ||
      !form.nickname.trim() ||
      !form.birthDate.trim() ||
      !form.phoneNumber.trim()
    ) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const result = await signup({
        loginId: form.loginId.trim(),
        loginPw: form.loginPw,
        name: form.name.trim(),
        nickname: form.nickname.trim(),
        birthDate: form.birthDate,
        phoneNumber: form.phoneNumber.trim(),
      });

      if (result.status === 201) {
        setSuccessMessage(
          result.data?.message || "Your account has been created successfully."
        );

        setTimeout(() => {
          window.location.href = "/";
        }, 1200);

        return;
      }

      setErrorMessage(result.data?.message || "Sign up failed. Please try again.");
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
                  Create account
                </h2>
                <p className="mt-1 text-[15px] leading-6 text-[#7a7a75]">
                  Sign up to start your journey with BBURI.
                </p>
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

                <input
                  type="text"
                  value={form.name}
                  onChange={handleChange("name")}
                  placeholder="Name"
                  className="h-[54px] w-full rounded-[18px] border border-[#dfddd7] bg-white px-5 text-[15px] text-black outline-none transition placeholder:text-[#9b98a9] focus:border-black"
                />

                <input
                  type="text"
                  value={form.nickname}
                  onChange={handleChange("nickname")}
                  placeholder="Nickname"
                  className="h-[54px] w-full rounded-[18px] border border-[#dfddd7] bg-white px-5 text-[15px] text-black outline-none transition placeholder:text-[#9b98a9] focus:border-black"
                />

                <input
                  type="date"
                  value={form.birthDate}
                  onChange={handleChange("birthDate")}
                  className="h-[54px] w-full rounded-[18px] border border-[#dfddd7] bg-white px-5 text-[15px] text-black outline-none transition focus:border-black"
                />

                <input
                  type="text"
                  value={form.phoneNumber}
                  onChange={handleChange("phoneNumber")}
                  placeholder="Phone number"
                  className="h-[54px] w-full rounded-[18px] border border-[#dfddd7] bg-white px-5 text-[15px] text-black outline-none transition placeholder:text-[#9b98a9] focus:border-black"
                />

                {errorMessage && (
                  <div className="rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-600">
                    {errorMessage}
                  </div>
                )}

                {successMessage && (
                  <div className="rounded-[16px] border border-green-200 bg-green-50 px-4 py-3 text-[14px] text-green-700">
                    {successMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 flex h-[54px] w-full items-center justify-center rounded-[18px] bg-black text-[15px] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "Signing up..." : "Sign up"}
                </button>
              </form>

              <div className="mt-7 text-center">
                <button
                  type="button"
                  className="text-[15px] font-medium text-[#4f4f4b] underline underline-offset-4 transition hover:text-black"
                >
                  Need help?
                </button>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-[15px] text-[#6b6b66]">
                <span>Already have an account?</span>
                <Link
                  href="/"
                  className="font-semibold text-black hover:opacity-70 underline underline-offset-4 transition"
                >
                  Log in
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