"use client";

import { ChevronDown } from "lucide-react";
import AcquiredCertificateInput from "@/components/roadmap/generate/AcquiredCertificateInput";
import RoadmapFieldSection from "@/components/roadmap/generate/RoadmapFieldSection";
import RoadmapGenerateLoading from "@/components/roadmap/generate/RoadmapGenerateLoading";
import RoadmapSelect from "@/components/roadmap/generate/RoadmapSelect";
import SkillLevelSelector from "@/components/roadmap/generate/SkillLevelSelector";
import {
  EDUCATION_SELECT_OPTIONS,
  GRADE_OPTIONS,
  TARGET_OPTIONS,
  inputClass,
  labelClass,
} from "@/components/roadmap/generate/roadmapGenerateConfig";
import useRoadmapGenerateForm from "@/components/roadmap/generate/useRoadmapGenerateForm";

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
    <main className="pt-9 pb-20 bg-white">
      {loading && <RoadmapGenerateLoading />}

      <div className="mx-auto max-w-[1062px] px-0 pb-0">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_344px] lg:gap-12">
          <section>
            <div className="mb-5">
              <h1 className="text-[24px] font-bold tracking-[-0.04em] text-[#333333]">
                목표 직무까지 필요한 자격증 로드맵을 만들어요
              </h1>
              <p className="mt-1.5 text-[14px] leading-6 text-[#94A3B8]">
                학력, 전공, 희망 직무를 바탕으로 지금부터 어떤 순서로 준비하면
                좋을지 정리해드릴게요.
              </p>
            </div>

            <RoadmapFieldSection title="학력 정보" className="mb-5">
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
            </RoadmapFieldSection>

            <RoadmapFieldSection title="전공과 목표" className="mb-5">
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
                    className={`h-[44px] rounded-[10px] border text-[14px] font-semibold transition ${
                      form.isMajorRelated === item.value
                        ? "border-[#4876EF] bg-[#EEF4FF] text-[#4876EF]"
                        : "border-[#E8EDF5] bg-white text-[#7B8798] hover:border-[#C7D7FA]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </RoadmapFieldSection>

            <RoadmapFieldSection title="목표 기업과 경력">
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
            </RoadmapFieldSection>
          </section>

          <div className="flex flex-col gap-5">
            <SkillLevelSelector
              value={form.mylevel}
              onChange={(value) => updateField("mylevel", value)}
            />

            <div className="h-px bg-[#F3F6FA]" />

            <AcquiredCertificateInput
              items={form.acquired}
              inputValue={acquiredInput}
              onInputChange={setAcquiredInput}
              onAdd={addAcquired}
              onRemove={removeAcquired}
            />

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
                className="min-h-[96px] w-full resize-none rounded-[10px] border border-[#E8EDF5] bg-white px-4 py-3 text-[14px] leading-6 text-[#333333] outline-none transition placeholder:text-[#C5CFDA] focus:border-[#4876EF]"
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
              className="inline-flex h-[50px] w-full items-center justify-center rounded-[12px] bg-[#4876EF] text-[15px] font-semibold text-white transition hover:bg-[#3565e0] disabled:cursor-not-allowed disabled:opacity-40"
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
