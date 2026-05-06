"use client";

import { useMemo, useState } from "react";
import { CalendarDays, X } from "lucide-react";
import type { PlannerTask } from "@/components/plan/WeeklyProgressSection";

type PlanMigrateModalProps = {
  task: PlannerTask | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (dailyPlanId: number, targetDate: string) => void | Promise<void>;
};

function toDateInputValue(date: string): string {
  if (!date) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  if (/^\d{4}\.\d{2}\.\d{2}$/.test(date)) return date.replace(/\./g, "-");

  const sliced = date.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(sliced)) return sliced;
  return "";
}

export default function PlanMigrateModal({
  task,
  loading = false,
  onClose,
  onSubmit,
}: PlanMigrateModalProps) {
  const initialDate = useMemo(() => toDateInputValue(task?.date ?? ""), [task]);
  const [targetDate, setTargetDate] = useState(initialDate);

  if (!task) return null;

  const canSubmit = targetDate.trim() !== "" && !loading;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/30 px-4 py-8"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] overflow-hidden rounded-[18px] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#EEF2F7] px-6 py-5">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[12px] font-semibold text-[#4876EF]">
              <CalendarDays className="h-3.5 w-3.5" />
              일정 설정
            </p>
            <h2 className="mt-1 line-clamp-2 text-[18px] font-semibold leading-snug tracking-[-0.03em] text-[#333333]">
              {task.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#94A3B8] transition hover:bg-[#F8FAFC] disabled:opacity-40"
            aria-label="닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="rounded-[12px] border border-[#EEF2F7] bg-[#FBFCFE] px-4 py-3">
            <p className="text-[11px] font-semibold text-[#98A2B3]">
              현재 설정
            </p>
            <p className="mt-1 text-[13px] font-semibold text-[#333333]">
              Week {task.week} / Day {task.day} · {task.date}
            </p>
          </div>

          <label className="mt-5 block">
            <span className="text-[13px] font-semibold text-[#333333]">
              설정할 날짜
            </span>
            <input
              type="date"
              value={targetDate}
              onChange={(event) => setTargetDate(event.target.value)}
              className="mt-2 h-[46px] w-full rounded-[12px] border border-[#E8EDF5] bg-white px-4 text-[14px] text-[#333333] outline-none transition focus:border-[#4876EF]"
            />
          </label>

          <p className="mt-3 text-[12px] leading-5 text-[#94A3B8]">
            같은 날짜에 이미 계획이 있으면 자동으로 이동/병합 결과를 정리합니다.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#EEF2F7] bg-[#FBFCFE] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-10 rounded-[10px] px-4 text-[13px] font-semibold text-[#667085] transition hover:bg-[#EEF2F7] disabled:opacity-40"
          >
            취소
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => {
              void onSubmit(task.id, targetDate);
            }}
            className="h-10 rounded-[10px] bg-[#4876EF] px-5 text-[13px] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
          {loading ? "설정 중" : "설정하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
