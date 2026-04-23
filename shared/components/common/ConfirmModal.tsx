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
  confirmText = "Confirm",
  cancelText = "Cancel",
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
    <>
      <p>{title}</p>
      {description && <p>{description}</p>}
      <button type="button" onClick={onCancel} disabled={loading}>
        {cancelText}
      </button>
      <button type="button" onClick={onConfirm} disabled={loading}>
        {loading ? "Loading" : confirmText}
      </button>
    </>
  );
}
