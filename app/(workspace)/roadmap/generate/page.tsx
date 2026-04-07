"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Check } from "lucide-react";
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

const stepMeta = [
  {
    id: 1,
    step: "01",
    title: "현재 상태",
    description: "학업 배경, 전공, 현재 수준을 바탕으로 출발점을 정할게요.",
    bullet: "현재 나의 배경과 역량 입력",
  },
  {
    id: 2,
    step: "02",
    title: "목표 설정",
    description: "어떤 직무와 방향을 목표로 하는지 알려주면 더 정확한 로드맵을 만들 수 있어요.",
    bullet: "희망 직무와 목표 방향 입력",
  },
  {
    id: 3,
    step: "03",
    title: "학습 가능 시간",
    description: "실제로 투자할 수 있는 시간을 기준으로 현실적인 계획을 설계할게요.",
    bullet: "하루/주간 학습 가능 시간 입력",
  },
] as const;

export default function GeneratePage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
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

  const progress = useMemo(() => {
    return (currentStep / 3) * 100;
  }, [currentStep]);

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

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!form.educationStatus.trim()) return "학력 상태를 선택해주세요.";
      if (!form.grade || form.grade < 1) return "학년을 선택해주세요.";
      if (!form.major.trim()) return "전공을 입력해주세요.";
      if (!form.mylevel) return "현재 수준을 선택해주세요.";
      if (form.career < 0) return "경력은 0 이상이어야 합니다.";
      return "";
    }

    if (step === 2) {
      if (!form.hope.trim()) return "희망 직무를 입력해주세요.";
      if (!form.target.trim()) return "목표를 선택해주세요.";
      return "";
    }

    if (step === 3) {
      if (!form.daily || form.daily < 1) return "하루 공부 시간을 입력해주세요.";
      if (!form.weekly || form.weekly < 1) return "주간 공부 시간을 입력해주세요.";
      return "";
    }

    return "";
  };

  const handleNext = () => {
    const validationError = validateStep(currentStep);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3);
    }
  };

  const handlePrev = () => {
    setError("");
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateStep(3);
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

  const currentStepData = stepMeta[currentStep - 1];

  const sectionTitleStyle =
    "text-[24px] font-extrabold tracking-[-0.04em] text-[#0B1B3B]";
  const labelStyle = "mb-2 block text-sm font-semibold text-[#0F172A]";
  const inputStyle =
    "h-[52px] w-full rounded-2xl border border-[#E7EBF2] bg-white px-4 text-[14px] text-[#111827] outline-none transition-all duration-200 placeholder:text-[#94A3B8] focus:border-[#6D5DF6] focus:bg-[#FCFBFF] focus:ring-4 focus:ring-[#6D5DF6]/10";
  const selectStyle =
    "h-[52px] w-full appearance-none rounded-2xl border border-[#E7EBF2] bg-white px-4 pr-11 text-[14px] text-[#111827] outline-none transition-all duration-200 focus:border-[#6D5DF6] focus:bg-[#FCFBFF] focus:ring-4 focus:ring-[#6D5DF6]/10";
  const helperStyle = "mt-1 text-[12px] leading-5 text-[#94A3B8]";
  const cardStyle =
    "rounded-[32px] border border-[#E8EDF5] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.03)] md:p-8";

  return (
    <main className="min-h-screen bg-white px-6 -mt-4 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-[32px] font-extrabold tracking-[-0.05em] text-[#0B1B3B]">
            나만의 로드맵 생성하기
          </h1>

          <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#667085]">
            현재 상태, 목표, 학습 가능 시간을 순서대로 입력하면 BUBU가 당신에게
            맞는 현실적인 커리어 로드맵을 설계해드려요.
          </p>
        </div>

        <form onSubmit={handleGenerate}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            {/* 왼쪽 Step 패널 */}
            <aside className="h-fit rounded-[30px] border border-[#E8EDF5] bg-[#FBFCFE] p-5 lg:sticky lg:top-8">
              <div className="mb-5">
                <p className="text-[12px] text-[#8FA3BF]">
                  STEP {currentStep} / 3
                </p>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#EEF2F7]">
                  <div
                    className="h-full rounded-full bg-[#6D5DF6] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="mt-3 text-[14px] font-semibold text-[#0F172A]">
                  {currentStepData.title}
                </p>
                <p className="mt-1 text-[13px] leading-6 text-[#94A3B8]">
                  {currentStepData.bullet}
                </p>
              </div>

              <div className="space-y-3">
                {stepMeta.map((item, index) => {
                  const stepNumber = index + 1;
                  const isActive = currentStep === stepNumber;
                  const isDone = currentStep > stepNumber;

                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border px-4 py-4 transition-all ${
                        isActive
                          ? "border-[#D9D2FF] bg-[#F7F4FF]"
                          : "border-[#EEF2F7] bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            isDone
                              ? "bg-[#6D5DF6] text-white"
                              : isActive
                              ? "bg-[#EEE9FF] text-[#6D5DF6]"
                              : "bg-[#F3F5F8] text-[#98A2B3]"
                          }`}
                        >
                          {isDone ? <Check className="h-4 w-4" /> : item.step}
                        </div>

                        <div className="min-w-0">
                          <p
                            className={`text-[15px] font-bold ${
                              isActive || isDone
                                ? "text-[#0B1B3B]"
                                : "text-[#667085]"
                            }`}
                          >
                            {item.title}
                          </p>
                          <p className="mt-1 text-[12px] leading-5 text-[#98A2B3]">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>

            {/* 오른쪽 입력 영역 */}
            <section className={cardStyle}>
              <div className="mb-8 border-b border-[#EEF2F7] pb-6">
                <div className="inline-flex rounded-full border border-[#E4DDFF] bg-[#F5F2FF] px-3 py-1 text-[12px] font-bold text-[#6D5DF6]">
                  STEP {currentStepData.step}
                </div>

                <h2 className={`${sectionTitleStyle} mt-4`}>
                  {currentStepData.title}
                </h2>
              </div>

              {/* STEP 1 */}
              {currentStep === 1 && (
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
              )}

              {/* STEP 2 */}
              {currentStep === 2 && (
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

                  <div className="md:col-span-2 rounded-[24px] border border-[#EEF2F7] bg-[#FBFCFE] p-5">
                    <p className="text-sm font-semibold text-[#0F172A]">
                      현재 입력된 방향
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-3 py-2 text-sm font-medium text-[#667085] border border-[#E7EBF2]">
                        전공: {form.major || "미입력"}
                      </span>
                      <span className="rounded-full bg-white px-3 py-2 text-sm font-medium text-[#667085] border border-[#E7EBF2]">
                        현재 수준: {form.mylevel || "미선택"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {currentStep === 3 && (
                <div className="space-y-5">
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

                  <div className="rounded-[24px] border border-[#E8EDF5] bg-[#FBFCFE] p-5">
                    <p className="text-sm font-semibold text-[#0F172A]">
                      생성 전 요약
                    </p>

                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-[#EEF2F7] bg-white px-4 py-3">
                        <p className="text-xs font-semibold text-[#98A2B3]">
                          현재 상태
                        </p>
                        <p className="mt-1 text-sm font-medium text-[#0F172A]">
                          {form.educationStatus || "미선택"} / {form.grade || "-"}학년 /{" "}
                          {form.major || "미입력"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-[#EEF2F7] bg-white px-4 py-3">
                        <p className="text-xs font-semibold text-[#98A2B3]">
                          목표
                        </p>
                        <p className="mt-1 text-sm font-medium text-[#0F172A]">
                          {form.hope || "미입력"} / {form.target || "미선택"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-[#EEF2F7] bg-white px-4 py-3 md:col-span-2">
                        <p className="text-xs font-semibold text-[#98A2B3]">
                          학습 가능 시간
                        </p>
                        <p className="mt-1 text-sm font-medium text-[#0F172A]">
                          하루 {form.daily || 0}시간 · 주간 {form.weekly || 0}시간
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-6 rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]">
                  {error}
                </div>
              )}

              <div className="mt-8 rounded-[24px] border border-[#EEF2F7] bg-[#FBFCFE] px-4 py-4 sm:px-5 md:px-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-[#98A2B3]">
                    {currentStep < 3
                      ? "입력한 값은 저장된 상태로 다음 단계로 넘어갑니다."
                      : "입력한 내용을 바탕으로 맞춤 로드맵이 생성됩니다."}
                  </p>

                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={currentStep === 1 ? () => router.push("/roadmap") : handlePrev}
                      className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#E7EBF2] bg-white px-5 text-sm font-semibold text-[#111827] transition-all duration-200 hover:bg-[#F8FAFC]"
                    >
                      {currentStep === 1 ? "취소" : "이전"}
                    </button>

                    {currentStep < 3 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex h-12 items-center justify-center gap-1 rounded-2xl bg-[#6D5DF6] px-5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(109,93,246,0.22)] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_14px_32px_rgba(109,93,246,0.28)]"
                      >
                        다음
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#6D5DF6] px-5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(109,93,246,0.22)] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_14px_32px_rgba(109,93,246,0.28)] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {loading ? "로드맵 생성 중..." : "로드맵 생성하기"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </form>
      </div>
    </main>
  );
}