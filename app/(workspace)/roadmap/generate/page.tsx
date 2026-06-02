"use client";

import { Sparkles } from "lucide-react";
import AcquiredCertificateInput from "@/components/roadmap/generate/AcquiredCertificateInput";
import RoadmapGenerateLoading from "@/components/roadmap/generate/RoadmapGenerateLoading";
import RoadmapSelect from "@/components/roadmap/generate/RoadmapSelect";
import SkillLevelSelector from "@/components/roadmap/generate/SkillLevelSelector";
import {
  EDUCATION_SELECT_OPTIONS,
  GRADE_OPTIONS,
  TARGET_OPTIONS,
  inputClass,
} from "@/components/roadmap/generate/roadmapGenerateConfig";
import useRoadmapGenerateForm from "@/components/roadmap/generate/useRoadmapGenerateForm";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-[15px] font-bold tracking-[-0.02em] text-[#333333]">
      {children}
    </h2>
  );
}

function PanelLabel({
  children,
  optional,
}: {
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <p className="mb-2.5 text-[13px] font-semibold text-[#555E6D]">
      {children}
      {optional && (
        <span className="ml-1 font-normal text-[#94A3B8]">(선택)</span>
      )}
    </p>
  );
}

export default function RoadmapGeneratePage() {
  const {
    form,
    acquiredInput,
    loading,
    error,
    isValid,
    setAcquiredInput,
    handleChange,
    updateField,
    addAcquired,
    removeAcquired,
    handleGenerate,
  } = useRoadmapGenerateForm();

  return (
    <main className="pb-28 pt-12">
      {loading && <RoadmapGenerateLoading />}

      <div className="mx-auto max-w-[1062px] px-4">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
          {/* Left column */}
          <section>
            <div className="mb-12">
              <h1 className="text-[26px] font-bold tracking-[-0.04em] text-[#1A1F2E]">
                목표 직무까지 필요한
                <br />
                자격증 로드맵을 만들어요
              </h1>
              <p className="mt-2 text-[14px] leading-6 text-[#94A3B8]">
                학력, 전공, 희망 직무를 바탕으로 지금부터 어떤 순서로 준비하면
                좋을지 정리해드릴게요.
              </p>
            </div>

            {/* 학력 정보 */}
            <div className="mb-8">
              <SectionHeading>학력 정보</SectionHeading>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <RoadmapSelect
                  name="educationStatus"
                  value={form.educationStatus}
                  onChange={handleChange}
                  options={EDUCATION_SELECT_OPTIONS}
                  placeholder="학위 상태 선택"
                />
                <RoadmapSelect
                  name="grade"
                  value={form.grade}
                  onChange={handleChange}
                  options={GRADE_OPTIONS}
                />
              </div>
            </div>

            {/* 전공과 목표 */}
            <div className="mb-8">
              <SectionHeading>전공과 목표</SectionHeading>
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
                    onClick={() => updateField("isMajorRelated", item.value)}
                    className={`h-11 rounded-xl border text-[14px] font-semibold transition ${
                      form.isMajorRelated === item.value
                        ? "border-[#4876EF] bg-[#4876EF] text-white shadow-[0_2px_10px_rgba(72,118,239,0.28)]"
                        : "border-[#E8EDF5] bg-white text-[#7B8798] hover:border-[#C7D7FA] hover:bg-[#F8FAFF]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 목표 기업과 경력 */}
            <div>
              <SectionHeading>목표 기업과 경력</SectionHeading>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <RoadmapSelect
                  name="target"
                  value={form.target}
                  onChange={handleChange}
                  options={TARGET_OPTIONS.map((o) => ({ value: o, label: o }))}
                  placeholder="목표 기업 형태 선택"
                />
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    name="career"
                    value={form.career}
                    onChange={handleChange}
                    placeholder="경력"
                    className={`${inputClass} pr-10`}
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#94A3B8]">
                    년
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Right sticky panel */}
          <div className="lg:sticky lg:top-22.5 lg:self-start">
            <div className="rounded-2xl border border-[#E8EDF5]">
              {/* Card header */}
              <div className="border-b border-[#F3F6FA] px-6 py-5">
                <p className="text-[15px] font-bold tracking-[-0.02em] text-[#1A1F2E]">
                  현재 상태 입력
                </p>
                <p className="mt-0.5 text-[12px] text-[#94A3B8]">
                  정확할수록 더 정교한 로드맵이 만들어져요
                </p>
              </div>

              {/* Card body */}
              <div className="flex flex-col gap-5 px-6 py-5">
                <div>
                  <PanelLabel>현재 실력</PanelLabel>
                  <SkillLevelSelector
                    value={form.mylevel}
                    onChange={(value) => updateField("mylevel", value)}
                  />
                </div>

                <div className="h-px bg-[#F3F6FA]" />

                <div>
                  <PanelLabel optional>보유 자격증</PanelLabel>
                  <AcquiredCertificateInput
                    items={form.acquired}
                    inputValue={acquiredInput}
                    onInputChange={setAcquiredInput}
                    onAdd={addAcquired}
                    onRemove={removeAcquired}
                  />
                </div>

                <div className="h-px bg-[#F3F6FA]" />

                <div>
                  <PanelLabel optional>고민이나 상황</PanelLabel>
                  <textarea
                    name="personalStory"
                    value={form.personalStory}
                    onChange={handleChange}
                    placeholder="예: 비전공자라 어떤 자격증부터 시작해야 할지 모르겠어요."
                    className="min-h-22 w-full resize-none rounded-xl border border-[#E8EDF5] bg-white px-4 py-3 text-[14px] leading-6 text-[#333333] outline-none transition placeholder:text-[#C5CFDA] focus:border-[#4876EF] focus:ring-2 focus:ring-[#4876EF]/10"
                  />
                </div>

                {error && (
                  <p className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13px] text-[#DC2626]">
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={loading || !isValid}
                  className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#4876EF] text-[15px] font-bold text-white shadow-[0_4px_14px_rgba(72,118,239,0.35)] transition hover:bg-[#3565e0] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Sparkles className="h-4 w-4" />
                  로드맵 생성하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes roadmap-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.8; }
          40% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </main>
  );
}
