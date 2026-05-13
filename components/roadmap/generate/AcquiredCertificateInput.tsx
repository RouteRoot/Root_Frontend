import { Plus, X } from "lucide-react";
import { inputClass } from "./roadmapGenerateConfig";

type AcquiredCertificateInputProps = {
  items: string[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (name: string) => void;
};

export default function AcquiredCertificateInput({
  items,
  inputValue,
  onInputChange,
  onAdd,
  onRemove,
}: AcquiredCertificateInputProps) {
  return (
    <div>
      <div className="flex gap-2">
        <input
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
          placeholder="예: 정보처리기사"
          className={inputClass}
        />
        <button
          type="button"
          onClick={onAdd}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E8EDF5] text-[#4876EF] transition hover:border-[#4876EF] hover:bg-[#EEF4FF]"
          aria-label="자격증 추가"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {items.length === 0 ? (
          <p className="text-[12px] text-[#94A3B8]">
            취득 완료된 로드맵 자격증은 자동으로 불러와요.
          </p>
        ) : (
          items.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded-full bg-[#EEF4FF] px-3 py-1 text-[12px] font-medium text-[#4876EF]"
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(item)}
                className="opacity-60 transition hover:opacity-100"
                aria-label={`${item} 삭제`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))
        )}
      </div>
    </div>
  );
}
