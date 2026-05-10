"use client";

import React, { useEffect } from "react";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 px-4"
      onClick={onCancel} 
    >
      <div
        className="w-full max-w-[320px] overflow-hidden rounded-[22px] border border-[#E8EDF5] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* 헤더 */}
        <div className="border-b border-[#EEF2F7] bg-[#FBFCFE] px-5 py-4">
          <p className="text-[16px] font-bold text-[#0B1B3B]">{title}</p>
        </div>

        {/* 본문 */}
        <div className="px-5 py-5">
          {description && (
            <p className="text-[14px] leading-7 text-[#7B8798]">
              {description}
            </p>
          )}

          {/* 버튼 영역 */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="inline-flex h-[40px] items-center justify-center rounded-[12px] border border-[#E7EBF2] bg-white px-4 text-[13px] font-semibold text-[#667085] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="inline-flex h-[40px] items-center justify-center rounded-[12px] bg-[#4876EF] px-4 text-[13px] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "처리 중..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}