import { SKILL_LEVELS } from "./roadmapGenerateConfig";

type SkillLevelSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SkillLevelSelector({
  value,
  onChange,
}: SkillLevelSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {SKILL_LEVELS.map(({ value: level, desc }) => {
        const selected = value === level;
        return (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border py-3.5 transition-all ${
              selected
                ? "border-[#4876EF] bg-[#4876EF] shadow-[0_2px_10px_rgba(72,118,239,0.28)]"
                : "border-[#E8EDF5] bg-white hover:border-[#C7D7FA] hover:bg-[#F8FAFF]"
            }`}
          >
            <span
              className={`text-[15px] font-bold ${
                selected ? "text-white" : "text-[#7B8798]"
              }`}
            >
              {level}
            </span>
            <span
              className={`text-[10px] ${
                selected ? "text-white/75" : "text-[#94A3B8]"
              }`}
            >
              {desc}
            </span>
          </button>
        );
      })}
    </div>
  );
}
