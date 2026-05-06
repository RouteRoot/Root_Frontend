"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import type { PlanSettingsResponse } from "@/app/api/plan/types";

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

function normalizeSchedule(
  schedule?: Record<string, number>
): Record<DayKey, number> {
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
      <div className="px-6 py-6">
        <label className="block">
          <span className="text-[13px] font-semibold text-[#333333]">
            시험일
          </span>
          <input
            type="date"
            value={examDate}
            onChange={(event) => setExamDate(event.target.value)}
            className="mt-2 h-[46px] w-full rounded-[12px] border border-[#E8EDF5] bg-white px-4 text-[14px] text-[#333333] outline-none transition focus:border-[#4876EF]"
          />
        </label>

        <div className="mt-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-[13px] font-semibold text-[#333333]">
              요일별 학습 시간
            </p>
            <p className="mt-1 text-[12px] text-[#94A3B8]">
              주 {totalWeeklyHours}시간
            </p>
          </div>
          {settings.skillLevel && (
            <span className="rounded-full border border-[#D8E4FF] px-3 py-1.5 text-[12px] font-medium text-[#4876EF]">
              {settings.skillLevel}
            </span>
          )}
        </div>

        <div className="mt-3 grid grid-cols-7 gap-2">
          {DAYS.map((day) => {
            const hours = weeklySchedule[day.key];
            const isRest = hours === 0;

            return (
              <div
                key={day.key}
                className={`flex min-h-[124px] flex-col items-center justify-between rounded-[14px] border px-2 py-3 ${
                  isRest
                    ? "border-[#EEF2F7] bg-[#FAFBFC]"
                    : "border-[#C8D9FF] bg-[#F5F8FF]"
                }`}
              >
                <span
                  className={`text-[12px] font-semibold ${
                    isRest ? "text-[#A0AEC0]" : "text-[#4876EF]"
                  }`}
                >
                  {day.label}
                </span>

                <input
                  type="number"
                  min={0}
                  max={12}
                  value={hours}
                  onChange={(event) =>
                    setDayHours(day.key, Math.floor(Number(event.target.value)))
                  }
                  className={`w-10 bg-transparent text-center text-[22px] font-semibold leading-none outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                    isRest ? "text-[#CBD5E1]" : "text-[#333333]"
                  }`}
                />

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setDayHours(day.key, hours - 1)}
                    disabled={hours === 0}
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-[#E8EDF5] bg-white text-[#94A3B8] transition hover:border-[#4876EF] hover:text-[#4876EF] disabled:opacity-25"
                    aria-label={`${day.label} 학습 시간 줄이기`}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDayHours(day.key, hours + 1)}
                    disabled={hours >= 12}
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-[#E8EDF5] bg-white text-[#94A3B8] transition hover:border-[#4876EF] hover:text-[#4876EF] disabled:opacity-25"
                    aria-label={`${day.label} 학습 시간 늘리기`}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-[#EEF2F7] bg-[#FBFCFE] px-6 py-4">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="h-10 rounded-[10px] px-4 text-[13px] font-semibold text-[#667085] transition hover:bg-[#EEF2F7] disabled:opacity-40"
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
          className="h-10 rounded-[10px] bg-[#4876EF] px-5 text-[13px] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "재설정 중" : "플랜 재설정하기"}
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
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/30 px-4 py-8"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[620px] overflow-hidden rounded-[18px] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#EEF2F7] px-6 py-5">
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-[#4876EF]">
              플랜 재설정
            </p>
            <h2 className="mt-1 truncate text-[20px] font-semibold tracking-[-0.03em] text-[#333333]">
              {settings?.certificationName ?? "학습 플랜"}
            </h2>
            <p className="mt-2 text-[13px] leading-5 text-[#94A3B8]">
              시험일과 학습 시간을 바꾸면 남은 계획을 다시 맞춰드릴게요.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#94A3B8] transition hover:bg-[#F8FAFC] disabled:opacity-40"
            aria-label="닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {loading || !settings ? (
          <div className="px-6 py-7">
            <div className="h-11 animate-pulse rounded-[12px] bg-[#EEF2F7]" />
            <div className="mt-6 grid grid-cols-7 gap-2">
              {DAYS.map((day) => (
                <div
                  key={day.key}
                  className="h-[116px] animate-pulse rounded-[14px] bg-[#EEF2F7]"
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
