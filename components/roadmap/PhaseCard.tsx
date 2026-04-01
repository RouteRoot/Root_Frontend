type PhaseCardProps = {
  step: string;
  title: string;
  description: string;
};

export default function PhaseCard({ step, title, description }: PhaseCardProps) {
  return (
    <div className="rounded-[16px] border border-[#9ad8b0] bg-[#edf4ef] p-6">
      <p className="mb-3 text-[13px] font-semibold text-[#1ca35d]">{step}</p>

      <h3 className="mb-3 text-[17px] font-semibold leading-[1.55] text-[#0f2a44]">
        {title}
      </h3>

      <p className="text-[15px] leading-[1.9] text-[#2f536d]">
        {description}
      </p>
    </div>
  );
}