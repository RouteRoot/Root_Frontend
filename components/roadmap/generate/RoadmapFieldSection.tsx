import { labelClass } from "./roadmapGenerateConfig";

type RoadmapFieldSectionProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export default function RoadmapFieldSection({
  title,
  children,
  className,
}: RoadmapFieldSectionProps) {
  return (
    <section className={className}>
      <h2 className={labelClass}>{title}</h2>
      {children}
    </section>
  );
}
