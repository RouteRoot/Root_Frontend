"use client";

import type { PlanSettingsResponse } from "@/app/api/plan/types";
import { Minus, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";

const DAYS = [
  { key: "MON", label: "월" },
  { key: "TUE", label: "화" },
  { key: "WED", label: "수" },
  { key: "THU", label: "목" },
  { key: "FRI", label: "금" },
  { key: "SAT", label: "토" },
  { key: "SUN", label: "일" },
] as const;

type DayKey = (typeof DAYS)[number]["key"];

type RegeneratePayload = {
  examTaskId: number;
  newExamDate: string;
  weeklySchedule: Record<string, number>;
};

type PlanRegenerateModalProps = {
  open: boolean;
  settings: PlanSettingsResponse | null;
  loading?: boolean;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (payload: RegeneratePayload) => void | Promise<void>;
};

function normalizeSchedule(schedule?: Record<string, number>) {
  return DAYS.reduce((acc, day) => {
    acc[day.key] = Math.max(0, Math.min(12, Number(schedule?.[day.key] ?? 0)));
    return acc;
  }, {} as Record<DayKey, number>);
}

function PlanRegenerateForm({
  settings,
  submitting,
  onClose,
  onSubmit,
}: {
  settings: PlanSettingsResponse;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (payload: RegeneratePayload) => void | Promise<void>;
}) {
  const [examDate, setExamDate] = useState(settings.examDate ?? "");
  const [weeklySchedule, setWeeklySchedule] = useState<Record<DayKey, number>>(
    () => normalizeSchedule(settings.weeklySchedule)
  );

  const totalWeeklyHours = useMemo(
    () => Object.values(weeklySchedule).reduce((sum, hours) => sum + hours, 0),
    [weeklySchedule]
  );
  const canSubmit =
    examDate.trim() !== "" && totalWeeklyHours > 0 && !submitting;

  const setDayHours = (key: DayKey, value: number) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      [key]: Math.max(0, Math.min(12, Number.isNaN(value) ? 0 : value)),
    }));
  };

  return (
    <>
      <div className="max-h-[calc(100dvh-220px)] overflow-y-auto px-4 py-4 lg:max-h-none lg:px-6 lg:py-6">
        <label className="block">
          <span className="text-[14px] font-semibold text-[#252A32]">
            시험일
          </span>
          <input
            type="date"
            value={examDate}
            onChange={(event) => setExamDate(event.target.value)}
            className="mt-2 h-11 w-full rounded-[8px] border border-[#D8DDE6] bg-white px-3 text-[14px] text-[#252A32] outline-none focus:border-[#4876EF]"
          />
        </label>

        <div className="mt-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-[14px] font-semibold text-[#252A32]">
              요일별 학습 시간
            </p>
            <p className="mt-1 text-[12px] text-[#8A94A6]">
              주 {totalWeeklyHours}시간
            </p>
          </div>
          {settings.skillLevel && (
            <span className="rounded-full border border-[#D8E4FF] px-3 py-1.5 text-[12px] font-medium text-[#4876EF]">
              {settings.skillLevel}
            </span>
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {DAYS.map((day) => {
            const hours = weeklySchedule[day.key];
            const isRest = hours === 0;

            return (
              <div
                key={day.key}
                className={`rounded-[8px] border px-3 py-3 ${
                  isRest
                    ? "border-[#EEF2F7] bg-[#FAFBFC]"
                    : "border-[#C8D9FF] bg-[#F5F8FF]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[12px] font-semibold ${
                      isRest ? "text-[#A0AEC0]" : "text-[#4876EF]"
                    }`}
                  >
                    {day.label}
                  </span>
                  <span className="text-[11px] font-medium text-[#98A2B3]">
                    시간
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setDayHours(day.key, hours - 1)}
                    disabled={hours === 0}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D8DDE6] bg-white text-[#667085] disabled:opacity-30"
                    aria-label={`${day.label} 줄이기`}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <input
                    type="number"
                    min={0}
                    max={12}
                    value={hours}
                    onChange={(event) =>
                      setDayHours(day.key, Math.floor(Number(event.target.value)))
                    }
                    className="w-10 bg-transparent text-center text-[22px] font-semibold leading-none text-[#252A32] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={() => setDayHours(day.key, hours + 1)}
                    disabled={hours >= 12}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D8DDE6] bg-white text-[#667085] disabled:opacity-30"
                    aria-label={`${day.label} 늘리기`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-[#EEF2F7] bg-white px-4 py-4 lg:flex lg:justify-end lg:px-6">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="h-11 rounded-[8px] border border-[#D8DDE6] text-[13px] font-semibold text-[#667085] disabled:opacity-40 lg:px-4"
        >
          취소
        </button>
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => {
            void onSubmit({
              examTaskId: settings.examTaskId,
              newExamDate: examDate,
              weeklySchedule,
            });
          }}
          className="h-11 rounded-[8px] bg-[#4876EF] text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 lg:px-5"
        >
          {submitting ? "재생성 중..." : "플랜 재생성"}
        </button>
      </div>
    </>
  );
}

export default function PlanRegenerateModal({
  open,
  settings,
  loading = false,
  submitting = false,
  onClose,
  onSubmit,
}: PlanRegenerateModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end bg-black/35 lg:items-center lg:justify-center lg:px-4 lg:py-8"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full overflow-hidden rounded-t-[18px] bg-white shadow-[0_-16px_50px_rgba(15,23,42,0.16)] lg:max-w-[620px] lg:rounded-[18px] lg:shadow-[0_24px_70px_rgba(15,23,42,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#EEF2F7] px-4 py-4 lg:px-6 lg:py-5">
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-[#4876EF]">
              플랜 재생성
            </p>
            <h2 className="mt-1 truncate text-[18px] font-semibold tracking-[-0.03em] text-[#252A32] lg:text-[20px]">
              {settings?.certificationName ?? "학습 플랜"}
            </h2>
            <p className="mt-2 text-[13px] leading-5 text-[#8A94A6]">
              시험일과 학습 시간을 바꾸면 남은 계획을 다시 맞춰드릴게요.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] text-[#8A94A6] active:bg-[#F3F6FA] disabled:opacity-40"
            aria-label="닫기"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {loading || !settings ? (
          <div className="px-4 py-5 lg:px-6">
            <div className="h-11 animate-pulse rounded-[8px] bg-[#EEF2F7]" />
            <div className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-7">
              {DAYS.map((day) => (
                <div
                  key={day.key}
                  className="h-[94px] animate-pulse rounded-[8px] bg-[#EEF2F7]"
                />
              ))}
            </div>
          </div>
        ) : (
          <PlanRegenerateForm
            key={`${settings.examTaskId}-${settings.examDate}`}
            settings={settings}
            submitting={submitting}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        )}
      </div>
    </div>
  );
}
