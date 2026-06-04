"use client";

import { useState } from "react";
import AboutCompanyModal from "@/components/common/AboutCompanyModal";

type AboutCompanyModalTriggerProps = {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
};

export default function AboutCompanyModalTrigger({
  children,
  className,
  ariaLabel = "bburi company introduction open",
}: AboutCompanyModalTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={() => setIsOpen(true)}
        className={className}
      >
        {children}
      </button>

      {isOpen && <AboutCompanyModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
