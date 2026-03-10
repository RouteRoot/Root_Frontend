"use client";

import { useState } from "react";

type LoginResponse = {
  message?: string;
  token?: string;
  userId?: number;
  [key: string]: unknown;
};

export default function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [responseData, setResponseData] = useState<
    LoginResponse | string | null
  >(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setResultMessage("");
    setResponseData(null);

    try {
      const res = await fetch("http://3.106.248.91:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loginId: id,
          loginPw: password,
        }),
      });

      const rawText = await res.text();
      console.log("status:", res.status);
      console.log("raw response:", rawText);

      let parsedData: LoginResponse | string | null = null;

      if (rawText) {
        try {
          parsedData = JSON.parse(rawText) as LoginResponse;
        } catch {
          parsedData = rawText;
        }
      }

      setResponseData(parsedData);

      if (res.ok) {
        setResultMessage(`로그인 성공 (${res.status})`);

        if (
          parsedData &&
          typeof parsedData === "object" &&
          "token" in parsedData
        ) {
          const token = parsedData.token;
          if (typeof token === "string") {
            localStorage.setItem("accessToken", token);
          }
        }
      } else {
        setResultMessage(`로그인 실패 (${res.status})`);
      }
    } catch (error) {
      console.error("에러:", error);
      setResultMessage("서버 연결 실패");
      setResponseData(String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="id"
              className="block text-sm font-medium text-gray-700"
            >
              아이디
            </label>
            <input
              type="text"
              id="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              autoComplete="username"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="아이디를 입력하세요"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          계정이 없으신가요?{" "}
          <a href="/signup" className="text-indigo-600 hover:text-indigo-700">
            회원가입
          </a>
        </p>

        {resultMessage && (
          <div className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-800">
              {resultMessage}
            </p>

            {responseData !== null && (
              <pre className="mt-3 text-xs text-gray-700 whitespace-pre-wrap break-words overflow-x-auto">
                {typeof responseData === "string"
                  ? responseData
                  : JSON.stringify(responseData, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
