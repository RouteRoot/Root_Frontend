"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { generateRoadmap } from "@/app/api/roadmap/roadmap";
import type { RoadmapFormData } from "@/app/api/roadmap/types";

const educationOptions = [
  "고등학교 졸업",
  "전문대 재학",
  "전문대 졸업",
  "4년제 재학",
  "4년제 졸업",
  "대학원 재학",
  "대학원 졸업",
];

const gradeOptions = [1, 2, 3, 4];
const levelOptions = ["하", "중", "상"];
const targetOptions = [
  "사기업",
  "공기업",
  "인턴십",
  "대기업",
  "스타트업",
  "대학원",
];

export default function GeneratePage() {
  const router = useRouter();

  const [form, setForm] = useState<RoadmapFormData>({
    educationStatus: "",
    grade: 0,
    major: "",
    hope: "",
    isMajorRelated: true,
    career: 0,
    daily: 0,
    weekly: 0,
    mylevel: "",
    target: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "grade" ||
        name === "career" ||
        name === "daily" ||
        name === "weekly"
          ? Number(value) || 0
          : name === "isMajorRelated"
          ? value === "true"
          : value,
    }));
  };

  const validateForm = () => {
    if (!form.educationStatus.trim()) return "학력 상태를 선택해주세요.";
    if (!form.grade || form.grade < 1) return "학년을 선택해주세요.";
    if (!form.major.trim()) return "전공을 입력해주세요.";
    if (!form.hope.trim()) return "희망 직무를 입력해주세요.";
    if (!form.target.trim()) return "목표를 선택하거나 입력해주세요.";
    if (!form.daily || form.daily < 1) return "하루 공부 시간을 입력해주세요.";
    if (!form.weekly || form.weekly < 1) return "주간 공부 시간을 입력해주세요.";
    if (!form.mylevel) return "현재 수준을 선택해주세요.";
    if (form.career < 0) return "경력은 0 이상이어야 합니다.";
    return "";
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await generateRoadmap(form);

      if (result?.roadmapId) {
        localStorage.setItem("roadmapId", String(result.roadmapId));
      }

      router.push("/roadmap");
    } catch (err) {
      console.error("로드맵 생성 실패:", err);
      setError("로드맵 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const sectionTitleStyle =
    "text-[22px] font-extrabold tracking-[-0.04em] text-[#0B1B3B]";
  const labelStyle = "mb-2 block text-sm font-semibold text-[#0F172A]";
  const inputStyle =
    "h-[52px] w-full rounded-2xl border border-[#E7EBF2] bg-white px-4 text-[14px] text-[#111827] outline-none transition-all duration-200 placeholder:text-[#94A3B8] focus:border-[#6D5DF6] focus:bg-[#FCFBFF] focus:ring-4 focus:ring-[#6D5DF6]/10";
  const selectStyle =
    "h-[52px] w-full appearance-none rounded-2xl border border-[#E7EBF2] bg-white px-4 pr-11 text-[14px] text-[#111827] outline-none transition-all duration-200 focus:border-[#6D5DF6] focus:bg-[#FCFBFF] focus:ring-4 focus:ring-[#6D5DF6]/10";
  const cardStyle =
    "rounded-[28px] border border-[#E8EDF5] bg-white p-6 md:p-7";
  const helperStyle = "mt-1 text-[12px] leading-5 text-[#94A3B8]";

  return (
    <main className="min-h-screen bg-white px-6 py-10 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-[30px] font-extrabold tracking-[-0.05em] text-[#0B1B3B]">
            나만의 로드맵 만들기
          </h1>

          <p className="mt-2 max-w-5xl text-[15px] leading-7 text-[#667085]">
            나의 현재 상태와 목표를 입력하면, AI가 당신에게 맞는 커리어
            로드맵을 설계해드려요. 정확하게 입력할수록 더 현실적인 학습 계획을
            추천받을 수 있어요.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          <section className={cardStyle}>
            <div className="mb-6">
              <h2 className={sectionTitleStyle}>현재 상태</h2>
              <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
                지금 나의 학업 배경과 역량 수준을 알려주세요.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className={labelStyle}>학력 상태</label>
                <div className="relative">
                  <select
                    name="educationStatus"
                    value={form.educationStatus}
                    onChange={handleChange}
                    className={selectStyle}
                  >
                    <option value="">선택하세요</option>
                    {educationOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
                </div>
                <p className={helperStyle}>
                  현재 기준으로 가장 가까운 상태를 선택해주세요.
                </p>
              </div>

              <div>
                <label className={labelStyle}>학년</label>
                <div className="relative">
                  <select
                    name="grade"
                    value={form.grade || ""}
                    onChange={handleChange}
                    className={selectStyle}
                  >
                    <option value="">선택하세요</option>
                    {gradeOptions.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}학년
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
                </div>
                <p className={helperStyle}>
                  재학 중이라면 현재 학년을 선택해주세요.
                </p>
              </div>

              <div>
                <label className={labelStyle}>전공</label>
                <input
                  name="major"
                  value={form.major}
                  onChange={handleChange}
                  placeholder="예: 컴퓨터공학, 경영학, 산업디자인"
                  className={inputStyle}
                />
                <p className={helperStyle}>
                  복수전공이라면 가장 중심이 되는 전공을 입력해주세요.
                </p>
              </div>

              <div>
                <label className={labelStyle}>전공 관련 여부</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, isMajorRelated: true }))
                    }
                    className={`h-[52px] rounded-2xl border px-4 text-sm font-semibold transition-all duration-200 ${
                      form.isMajorRelated
                        ? "border-[#6D5DF6] bg-[#F4F1FF] text-[#6D5DF6] shadow-[0_4px_14px_rgba(109,93,246,0.08)]"
                        : "border-[#E7EBF2] bg-white text-[#667085] hover:bg-[#FAFBFC]"
                    }`}
                  >
                    관련 있음
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, isMajorRelated: false }))
                    }
                    className={`h-[52px] rounded-2xl border px-4 text-sm font-semibold transition-all duration-200 ${
                      !form.isMajorRelated
                        ? "border-[#6D5DF6] bg-[#F4F1FF] text-[#6D5DF6] shadow-[0_4px_14px_rgba(109,93,246,0.08)]"
                        : "border-[#E7EBF2] bg-white text-[#667085] hover:bg-[#FAFBFC]"
                    }`}
                  >
                    관련 없음
                  </button>
                </div>
                <p className={helperStyle}>
                  희망 직무가 현재 전공과 직접 연결되는지 선택해주세요.
                </p>
              </div>

              <div>
                <label className={labelStyle}>현재 수준</label>
                <div className="flex flex-wrap gap-3">
                  {levelOptions.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, mylevel: level }))
                      }
                      className={`min-w-[76px] rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                        form.mylevel === level
                          ? "border-[#6D5DF6] bg-[#6D5DF6] text-white shadow-[0_8px_20px_rgba(109,93,246,0.18)]"
                          : "border-[#E7EBF2] bg-white text-[#667085] hover:bg-[#FAFBFC]"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <p className={helperStyle}>
                  스스로 느끼는 현재 준비 수준을 기준으로 선택해주세요.
                </p>
              </div>

              <div>
                <label className={labelStyle}>관련 경력</label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    name="career"
                    value={form.career || ""}
                    onChange={handleChange}
                    placeholder="0"
                    className={`${inputStyle} pr-14`}
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#98A2B3]">
                    개월
                  </span>
                </div>
                <p className={helperStyle}>
                  인턴, 프로젝트, 실무 경험이 있다면 개월 수로 입력해주세요.
                </p>
              </div>
            </div>
          </section>

          <section className={cardStyle}>
            <div className="mb-6">
              <h2 className={sectionTitleStyle}>목표 설정</h2>
              <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
                어떤 방향으로 성장하고 싶은지 알려주세요.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className={labelStyle}>희망 직무</label>
                <input
                  name="hope"
                  value={form.hope}
                  onChange={handleChange}
                  placeholder="예: 백엔드 개발자, UI/UX 디자이너, 데이터 분석가"
                  className={inputStyle}
                />
                <p className={helperStyle}>
                  가장 취업하고 싶은 직무 하나를 중심으로 입력해주세요.
                </p>
              </div>

              <div>
                <label className={labelStyle}>목표</label>
                <div className="relative">
                  <select
                    name="target"
                    value={form.target}
                    onChange={handleChange}
                    className={selectStyle}
                  >
                    <option value="">선택하세요</option>
                    {targetOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
                </div>
                <p className={helperStyle}>
                  취업 방향이나 준비 목적에 가장 가까운 항목을 선택해주세요.
                </p>
              </div>
            </div>
          </section>

          <section className={cardStyle}>
            <div className="mb-6">
              <h2 className={sectionTitleStyle}>학습 가능 시간</h2>
              <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
                실제로 투자할 수 있는 시간을 기준으로 입력해주세요.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className={labelStyle}>하루 공부 시간</label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    name="daily"
                    value={form.daily || ""}
                    onChange={handleChange}
                    placeholder="2"
                    className={`${inputStyle} pr-14`}
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#98A2B3]">
                    시간
                  </span>
                </div>
                <p className={helperStyle}>
                  평균적으로 하루에 꾸준히 가능한 시간을 입력해주세요.
                </p>
              </div>

              <div>
                <label className={labelStyle}>주간 공부 시간</label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    name="weekly"
                    value={form.weekly || ""}
                    onChange={handleChange}
                    placeholder="16"
                    className={`${inputStyle} pr-14`}
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#98A2B3]">
                    시간
                  </span>
                </div>
                <p className={helperStyle}>
                  주말 포함 1주일 기준으로 가능한 총 시간을 입력해주세요.
                </p>
              </div>
            </div>
          </section>

          {error && (
            <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]">
              {error}
            </div>
          )}

          <div className="mt-2 rounded-[24px] border border-[#EEF2F7] bg-[#FBFCFE] px-4 py-4 sm:px-5 md:px-6">
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => router.push("/roadmap")}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#E7EBF2] bg-white px-5 text-sm font-semibold text-[#111827] transition-all duration-200 hover:bg-[#F8FAFC]"
              >
                취소
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#6D5DF6] px-5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(109,93,246,0.22)] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_14px_32px_rgba(109,93,246,0.28)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "로드맵 생성 중..." : "로드맵 생성하기"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}