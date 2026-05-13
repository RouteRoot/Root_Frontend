"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type SelectOption = {
  value: string | number;
  label: string;
};

type RoadmapSelectProps = {
  name: string;
  value: string | number;
  options: readonly SelectOption[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
};

export default function RoadmapSelect({
  name,
  value,
  options,
  onChange,
  placeholder,
}: RoadmapSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedLabel =
    options.find((o) => String(o.value) === String(value))?.label ??
    placeholder ??
    "";

  const isPlaceholder = !value && value !== 0;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", escHandler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", escHandler);
    };
  }, []);

  const select = (optionValue: string | number) => {
    const synthetic = {
      target: { name, value: String(optionValue) },
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange(synthetic);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-11 w-full items-center justify-between rounded-xl border px-4 text-[14px] outline-none transition ${
          open
            ? "border-[#4876EF] ring-2 ring-[#4876EF]/10"
            : "border-[#E8EDF5] hover:border-[#C7D7FA]"
        } bg-white`}
      >
        <span className={isPlaceholder ? "text-[#C5CFDA]" : "text-[#333333]"}>
          {selectedLabel}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#94A3B8] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-full overflow-hidden rounded-xl border border-[#E8EDF5] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          {placeholder && (
            <button
              type="button"
              onClick={() => select("")}
              className="flex w-full items-center px-4 py-2.5 text-left text-[14px] text-[#C5CFDA] hover:bg-[#F8FAFF]"
            >
              {placeholder}
            </button>
          )}
          {options.map((option) => {
            const selected = String(option.value) === String(value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => select(option.value)}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-[14px] transition ${
                  selected
                    ? "bg-[#EEF4FF] text-[#4876EF]"
                    : "text-[#333333] hover:bg-[#F8FAFF]"
                }`}
              >
                {option.label}
                {selected && <Check className="h-4 w-4 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
