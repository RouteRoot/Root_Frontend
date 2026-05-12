import { labelClass, SKILL_LEVELS } from "./roadmapGenerateConfig";

type SkillLevelSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SkillLevelSelector({
  value,
  onChange,
}: SkillLevelSelectorProps) {
  return (
    <section>
      <h2 className={labelClass}>현재 실력</h2>
      <div className="grid grid-cols-3 gap-2">
        {SKILL_LEVELS.map(({ value: level, desc }) => (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            className={`flex flex-col items-center justify-center gap-1 rounded-[10px] border py-3 transition ${
              value === level
                ? "border-[#4876EF] bg-[#EEF4FF]"
                : "border-[#E8EDF5] bg-white hover:border-[#C7D7FA]"
            }`}
          >
            <span
              className={`text-[15px] font-bold ${
                value === level ? "text-[#4876EF]" : "text-[#7B8798]"
              }`}
            >
              {level}
            </span>
            <span className="text-[11px] text-[#94A3B8]">{desc}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
