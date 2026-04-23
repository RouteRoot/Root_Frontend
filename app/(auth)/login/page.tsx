"use client";

import Link from "next/link";
import { useState } from "react";
import { login } from "@/features/auth/api/authApi";
import type { LoginRequest } from "@/features/auth/types";

type ErrorWithResponse = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

export default function LoginPage() {
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
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={form.loginId}
          onChange={handleChange("loginId")}
          placeholder="Email address"
        />
        <input
          type={showPassword ? "text" : "password"}
          value={form.loginPw}
          onChange={handleChange("loginPw")}
          placeholder="Password"
        />
        <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
          {showPassword ? "Hide password" : "Show password"}
        </button>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log in"}
        </button>
      </form>
      <Link href="/signup">Sign up</Link>
      <pre>{JSON.stringify({ form, showPassword, isLoading, errorMessage }, null, 2)}</pre>
    </>
  );
}
