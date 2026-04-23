import SectionHeader from "@/features/dashboard/components/SectionHeader";
import NoticeCard from "@/features/dashboard/components/NoticeCard";
import RoadmapBar from "@/features/dashboard/components/RoadmapBar";
import BubuBounce from "@/features/dashboard/components/BubuBounce";
import TodayPlanCard from "@/features/dashboard/components/TodayPlanCard";

const noticeMock = [
  {
    id: 1,
    date: "2026.02.01",
    title: "SQLD certificate guide",
    description: "Dashboard notice item.",
  },
  {
    id: 2,
    date: "2026.01.01",
    title: "Certificate information",
    description: "Dashboard notice item.",
  },
];

export default function Page() {
  return (
    <>
      <SectionHeader title="NOTICE" />
      {noticeMock.map((notice) => (
        <NoticeCard key={notice.id} {...notice} />
      ))}
      <SectionHeader title="ROADMAP" />
      <RoadmapBar />
      <SectionHeader title="PLAN" />
      <BubuBounce />
      <TodayPlanCard
        subtitle="Current plan"
        certificateName="Information Processing Engineer"
        currentDay={2}
        totalDay={39}
        href="/plan"
      />
      <SectionHeader title="FEATURES" />
      <pre>{JSON.stringify({ noticeMock }, null, 2)}</pre>
    </>
  );
}
