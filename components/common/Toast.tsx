"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

type ToastItem = {
  id: number;
  message: string;
  type: "success" | "error";
  visible: boolean;
};

type ToastState = {
  toasts: ToastItem[];
  show: (message: string, type?: "success" | "error") => void;
};

let _setState: React.Dispatch<React.SetStateAction<ToastItem[]>> | null = null;
let _counter = 0;

export function useToast(): Pick<ToastState, "show"> {
  const show = (message: string, type: "success" | "error" = "success") => {
    if (!_setState) return;
    const id = ++_counter;
    _setState((prev) => [...prev, { id, message, type, visible: true }]);

    setTimeout(() => {
      _setState?.((prev) =>
        prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
      );
    }, 2600);

    setTimeout(() => {
      _setState?.((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return { show };
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    _setState = setToasts;
    return () => {
      _setState = null;
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-1/2 z-[200] flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-2.5 rounded-[14px] border px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.12)] transition-all duration-300 ${
            toast.visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          } ${
            toast.type === "success"
              ? "border-[#d1fae5] bg-white text-[#065f46]"
              : "border-[#fecdd3] bg-white text-[#9f1239]"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="h-4 w-4 shrink-0 text-[#10b981]" />
          ) : (
            <XCircle className="h-4 w-4 shrink-0 text-[#f43f5e]" />
          )}
          <span className="text-[13px] font-medium">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
