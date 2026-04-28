import { ChevronDown } from "lucide-react";
import { selectClass } from "./roadmapGenerateConfig";

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
  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={selectClass}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
    </div>
  );
}
