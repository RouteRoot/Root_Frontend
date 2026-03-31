"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateRoadmap } from "@/app/api/roadmap/roadmap";
import type { RoadmapFormData } from "@/app/api/roadmap/types";

export default function GeneratePage() {
  const router = useRouter();

  const [form, setForm] = useState<RoadmapFormData>({
    major: "",
    hope: "",
    acquired: "",
    status: "",
    daily: 0,
    weekly: 0,
    mylevel: "",
    target: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "daily" || name === "weekly" ? Number(value) || 0 : value,
    }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await generateRoadmap(form);
      router.push("/roadmap");
    } catch (err) {
      console.error("로드맵 생성 실패:", err);
      setError("로드맵 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-gray-500">Generate</p>
          <h1 className="text-3xl font-bold tracking-tight text-black">
            로드맵 생성하기
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            현재 상태와 목표를 입력하면 AI가 맞춤형 자격증 로드맵을
            생성해드려요.
          </p>
        </div>

        <form
          onSubmit={handleGenerate}
          className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-black">
                전공
              </label>
              <input
                name="major"
                value={form.major}
                onChange={handleChange}
                placeholder="예: Computer Science"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-black outline-none transition focus:border-black"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-black">
                희망 직무
              </label>
              <input
                name="hope"
                value={form.hope}
                onChange={handleChange}
                placeholder="예: 프론트엔드 개발자"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-black outline-none transition focus:border-black"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-black">
                보유 역량 / 자격
              </label>
              <input
                name="acquired"
                value={form.acquired}
                onChange={handleChange}
                placeholder="예: 없음"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-black outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                현재 상태
              </label>
              <input
                name="status"
                value={form.status}
                onChange={handleChange}
                placeholder="예: 대학교 4학년"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-black outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                목표
              </label>
              <input
                name="target"
                value={form.target}
                onChange={handleChange}
                placeholder="예: 사기업"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-black outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                하루 공부 시간
              </label>
              <input
                type="number"
                name="daily"
                value={form.daily}
                onChange={handleChange}
                placeholder="예: 2"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-black outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                주간 공부 시간
              </label>
              <input
                type="number"
                name="weekly"
                value={form.weekly}
                onChange={handleChange}
                placeholder="예: 16"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-black outline-none transition focus:border-black"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-black">
                현재 수준
              </label>
              <select
                name="mylevel"
                value={form.mylevel}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-black outline-none transition focus:border-black"
              >
                <option value="">선택하세요</option>
                <option value="하">하</option>
                <option value="중">중</option>
                <option value="상">상</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/roadmap")}
              className="rounded-2xl border border-gray-200 px-5 py-3 text-sm font-medium text-black transition hover:bg-gray-50"
            >
              취소
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "생성 중..." : "로드맵 생성하기"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
