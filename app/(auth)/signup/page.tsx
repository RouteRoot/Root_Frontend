"use client";

import Link from "next/link";
import { useState } from "react";
import { signup } from "@/features/auth/api/authApi";
import type { SignupRequest } from "@/features/auth/types";

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
        <input
          type="text"
          value={form.name}
          onChange={handleChange("name")}
          placeholder="Name"
        />
        <input
          type="text"
          value={form.nickname}
          onChange={handleChange("nickname")}
          placeholder="Nickname"
        />
        <input
          type="date"
          value={form.birthDate}
          onChange={handleChange("birthDate")}
        />
        <input
          type="text"
          value={form.phoneNumber}
          onChange={handleChange("phoneNumber")}
          placeholder="Phone number"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing up..." : "Sign up"}
        </button>
      </form>
      <Link href="/">Log in</Link>
      <pre>
        {JSON.stringify(
          { form, showPassword, isLoading, errorMessage, successMessage },
          null,
          2
        )}
      </pre>
    </>
  );
}
