"use client";

import { useEffect, useState } from "react";

type Section = {
  id: string;
  label: string;
};

type SectionIndicatorProps = {
  sections: Section[];
};

export default function SectionIndicator({ sections }: SectionIndicatorProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleSections.length > 0) {
          setActiveSection(visibleSections[0].target.id);
        }
      },
      {
        threshold: [0.4, 0.6],
        rootMargin: "-20% 0px -20% 0px",
      },
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const handleMove = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 xl:flex">
      <div className="flex items-start gap-3">
        {/* 점 + 라인 */}
        <div className="relative flex flex-col items-center">
          <div className="absolute top-2 bottom-2 w-px bg-gray-300" />

          {sections.map((section) => {
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => handleMove(section.id)}
                className="relative z-10 flex h-9 items-center"
                type="button"
              >
                <span
                  className={`block h-2 w-2 rounded-full transition-all ${
                    isActive ? "bg-[#6B4F3A]" : "bg-gray-400"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* 텍스트 */}
        <div className="flex flex-col">
          {sections.map((section) => {
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => handleMove(section.id)}
                className={`flex h-9 items-center text-left text-xs font-medium transition-colors ${
                  isActive ? "text-[#6B4F3A]" : "text-gray-400"
                }`}
                type="button"
              >
                {section.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
