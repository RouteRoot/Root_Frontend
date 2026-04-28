"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Plus, Sparkles, X } from "lucide-react";
import {
  generateRoadmap,
  getRoadmapByToken,
} from "@/app/api/roadmap/roadmap";
import type { RoadmapFormData } from "@/app/api/roadmap/types";

const EDUCATION_OPTIONS = [
  "고졸",
  "2년제 재학",
  "2년제 졸업",
  "3년제 재학",
  "3년제 졸업",
  "4년제 재학",
  "4년제 졸업",
] as const;

const GRADE_OPTIONS = [
  { value: 0, label: "해당 없음" },
  { value: 1, label: "1학년" },
  { value: 2, label: "2학년" },
  { value: 3, label: "3학년" },
  { value: 4, label: "4학년" },
] as const;

const TARGET_OPTIONS = ["사기업", "공기업", "스타트업"] as const;

const SKILL_LEVELS = [
  { value: "하", desc: "처음 준비" },
  { value: "중", desc: "기본 개념 보유" },
  { value: "상", desc: "실전 경험 있음" },
] as const;

const inputClass =
  "h-[46px] w-full rounded-[10px] border border-[#E8EDF5] bg-white px-4 text-[14px] text-[#0B1B3B] outline-none transition placeholder:text-[#C5CFDA] focus:border-[#0FA9CC]";

const selectClass = `${inputClass} appearance-none pr-11`;

const labelClass =
  "mb-2.5 text-[15px] font-semibold tracking-[-0.02em] text-[#0B1B3B]";

export default function RoadmapGeneratePage() {
  const router = useRouter();

  const [form, setForm] = useState<RoadmapFormData>({
    educationStatus: "",
    grade: 0,
    major: "",
    hope: "",
    isMajorRelated: true,
    career: 0,
    acquired: [],
    mylevel: "중",
    target: "",
    personalStory: "",
  });
  const [acquiredInput, setAcquiredInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadAcquiredCertificates = async () => {
      try {
        const roadmap = await getRoadmapByToken();
        const completed = roadmap.phases
          .flatMap((phase) => phase.tasks)
          .filter((task) => task.status === "COMPLETED")
          .map((task) => task.taskName.trim())
          .filter(Boolean);

        if (!mounted || completed.length === 0) return;

        setForm((prev) => ({
          ...prev,
          acquired: Array.from(new Set([...prev.acquired, ...completed])),
        }));
      } catch (err) {
        console.warn("취득 자격증 불러오기 실패:", err);
      }
    };

    loadAcquiredCertificates();

    return () => {
      mounted = false;
    };
  }, []);

  const isValid = useMemo(
    () =>
      form.educationStatus.trim() !== "" &&
      form.major.trim() !== "" &&
      form.hope.trim() !== "" &&
      form.mylevel.trim() !== "" &&
      form.target.trim() !== "" &&
      form.career >= 0,
    [form]
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "grade" || name === "career" ? Number(value) || 0 : value,
    }));
  };

  const addAcquired = () => {
    const next = acquiredInput.trim();
    if (!next) return;

    setForm((prev) => ({
      ...prev,
      acquired: prev.acquired.includes(next)
        ? prev.acquired
        : [...prev.acquired, next],
    }));
    setAcquiredInput("");
  };

  const removeAcquired = (name: string) => {
    setForm((prev) => ({
      ...prev,
      acquired: prev.acquired.filter((item) => item !== name),
    }));
  };

  const handleGenerate = async () => {
    if (!isValid) {
      setError("필수 정보를 모두 입력해주세요.");
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

  return (
    <main className="pt-9 -mb-40 -mt-2 h-[calc(100vh-8rem-var(--global-banner-height))] overflow-hidden bg-white">
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-white/90 backdrop-blur-sm">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-2 w-2 rounded-full bg-[#0075c3] opacity-80"
                style={{ animation: `bounce 1s ${i * 0.18}s infinite` }}
              />
            ))}
          </div>
          <div className="text-center">
            <p className="text-[16px] font-semibold text-[#0B1B3B]">
              AI가 맞춤 로드맵을 만들고 있어요
            </p>
            <p className="mt-1 text-[13px] text-[#94A3B8]">
              현재 상태와 목표 직무를 분석 중입니다. 잠시만 기다려 주세요.
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1062px] px-0 pb-0">
        <div className="mb-2.5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#0FA9CC]">
          <Sparkles className="h-3 w-3" />
          AI 맞춤 로드맵 생성
        </div>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_344px] lg:gap-12">
          <section>
            <div className="mb-5">
              <h1 className="text-[24px] font-bold tracking-[-0.04em] text-[#0B1B3B]">
                목표 직무까지 필요한 자격증 로드맵을 만들어요
              </h1>
              <p className="mt-1.5 text-[14px] leading-6 text-[#94A3B8]">
                학력, 전공, 희망 직무를 바탕으로 지금부터 어떤 순서로 준비하면
                좋을지 정리해드릴게요.
              </p>
            </div>

            <section className="mb-5">
              <h2 className={labelClass}>학력 정보</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="relative">
                  <select
                    name="educationStatus"
                    value={form.educationStatus}
                    onChange={handleChange}
                    className={selectClass}
                  >
                    <option value="">학위 상태 선택</option>
                    {EDUCATION_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                </div>
                <div className="relative">
                  <select
                    name="grade"
                    value={form.grade}
                    onChange={handleChange}
                    className={selectClass}
                  >
                    {GRADE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                </div>
              </div>
            </section>

            <section className="mb-5">
              <h2 className={labelClass}>전공과 목표</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  name="major"
                  value={form.major}
                  onChange={handleChange}
                  placeholder="전공 입력"
                  className={inputClass}
                />
                <input
                  name="hope"
                  value={form.hope}
                  onChange={handleChange}
                  placeholder="희망 직무 예: 백엔드 개발자"
                  className={inputClass}
                />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[
                  { label: "전공 관련 있음", value: true },
                  { label: "전공 관련 없음", value: false },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        isMajorRelated: item.value,
                      }))
                    }
                    className={`h-[44px] rounded-[10px] border text-[14px] font-semibold transition ${
                      form.isMajorRelated === item.value
                        ? "border-[#0FA9CC] bg-[#EAF9FC] text-[#0FA9CC]"
                        : "border-[#E8EDF5] bg-white text-[#7B8798] hover:border-[#BDEAF3]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h2 className={labelClass}>목표 기업과 경력</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="relative">
                  <input
                    name="target"
                    value={form.target}
                    onChange={handleChange}
                    list="roadmap-target-options"
                    placeholder="목표 기업 형태 직접 입력"
                    className={`${inputClass} roadmap-target-input pr-11`}
                  />
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                  <datalist id="roadmap-target-options">
                    {TARGET_OPTIONS.map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    name="career"
                    value={form.career}
                    onChange={handleChange}
                    className={`${inputClass} pr-10`}
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#94A3B8]">
                    년
                  </span>
                </div>
              </div>
            </section>
          </section>

          <div className="flex flex-col gap-5">
            <section>
              <h2 className={labelClass}>현재 실력</h2>
              <div className="grid grid-cols-3 gap-2">
                {SKILL_LEVELS.map(({ value, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, mylevel: value }))
                    }
                    className={`flex flex-col items-center justify-center gap-1 rounded-[10px] border py-3 transition ${
                      form.mylevel === value
                        ? "border-[#0FA9CC] bg-[#EAF9FC]"
                        : "border-[#E8EDF5] bg-white hover:border-[#BDEAF3]"
                    }`}
                  >
                    <span
                      className={`text-[15px] font-bold ${
                        form.mylevel === value
                          ? "text-[#0FA9CC]"
                          : "text-[#7B8798]"
                      }`}
                    >
                      {value}
                    </span>
                    <span className="text-[11px] text-[#94A3B8]">{desc}</span>
                  </button>
                ))}
              </div>
            </section>

            <div className="h-px bg-[#F3F6FA]" />

            <section>
              <h2 className={labelClass}>
                보유 자격증{" "}
                <span className="text-[13px] font-normal text-[#94A3B8]">
                  (선택)
                </span>
              </h2>
              <div className="flex gap-2">
                <input
                  value={acquiredInput}
                  onChange={(e) => setAcquiredInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addAcquired();
                    }
                  }}
                  placeholder="예: 정보처리기사"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={addAcquired}
                  className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[10px] border border-[#E8EDF5] text-[#0FA9CC] transition hover:border-[#0FA9CC]"
                  aria-label="자격증 추가"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {form.acquired.length === 0 ? (
                  <p className="text-[13px] text-[#94A3B8]">
                    취득 완료된 로드맵 자격증은 자동으로 불러와요.
                  </p>
                ) : (
                  form.acquired.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1 rounded-full bg-[#F3F6FA] px-3 py-1.5 text-[13px] font-medium text-[#0B1B3B]"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeAcquired(item)}
                        className="text-[#94A3B8] transition hover:text-[#0FA9CC]"
                        aria-label={`${item} 삭제`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </section>

            <section>
              <h2 className={labelClass}>
                고민이나 상황{" "}
                <span className="text-[13px] font-normal text-[#94A3B8]">
                  (선택)
                </span>
              </h2>
              <textarea
                name="personalStory"
                value={form.personalStory}
                onChange={handleChange}
                placeholder="예: 비전공자라 어떤 자격증부터 시작해야 할지 모르겠어요."
                className="min-h-[96px] w-full resize-none rounded-[10px] border border-[#E8EDF5] bg-white px-4 py-3 text-[14px] leading-6 text-[#0B1B3B] outline-none transition placeholder:text-[#C5CFDA] focus:border-[#0FA9CC]"
              />
            </section>

            {error && (
              <p className="rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13px] text-[#DC2626]">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading || !isValid}
              className="inline-flex h-[50px] w-full items-center justify-center rounded-[12px] bg-[#0FA9CC] text-[15px] font-semibold text-white transition hover:bg-[#0d98b8] disabled:cursor-not-allowed disabled:opacity-40"
            >
              로드맵 생성하기
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.8; }
          40% { transform: translateY(-8px); opacity: 1; }
        }

        .roadmap-target-input::-webkit-calendar-picker-indicator {
          display: none !important;
        }
      `}</style>
    </main>
  );
}
