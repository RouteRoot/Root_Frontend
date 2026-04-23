"use client";

type CertificateSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch: (keyword: string) => void | Promise<void>;
  placeholder?: string;
};

export default function CertificateSearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search certificate",
}: CertificateSearchBarProps) {
  const handleSearch = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  };

  return (
    <>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
        placeholder={placeholder}
      />
      <button type="button" onClick={handleSearch} disabled={!value.trim()}>
        Search
      </button>
      <pre>{JSON.stringify({ value }, null, 2)}</pre>
    </>
  );
}
