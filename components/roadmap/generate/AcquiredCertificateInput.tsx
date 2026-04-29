import { Plus, X } from "lucide-react";
import { inputClass, labelClass } from "./roadmapGenerateConfig";

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
    <section>
      <h2 className={labelClass}>
        보유 자격증{" "}
        <span className="text-[13px] font-normal text-[#94A3B8]">(선택)</span>
      </h2>
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
          className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[10px] border border-[#E8EDF5] text-[#0FA9CC] transition hover:border-[#0FA9CC]"
          aria-label="자격증 추가"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.length === 0 ? (
          <p className="text-[13px] text-[#94A3B8]">
            취득 완료된 로드맵 자격증은 자동으로 불러와요.
          </p>
        ) : (
          items.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded-full bg-[#F3F6FA] px-3 py-1.5 text-[13px] font-medium text-[#333333]"
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(item)}
                className="text-[#94A3B8] transition hover:text-[#0FA9CC]"
                aria-label={`${item} 삭제`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))
        )}
      </div>
    </section>
  );
}
