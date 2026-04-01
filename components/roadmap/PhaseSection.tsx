"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Noto_Serif_KR } from "next/font/google";
import useRoadmap from "@/hooks/useRoadmap";
import type {
  Phase,
  RoadmapResponse,
  Task,
} from "@/app/api/roadmap/types";

const serif = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

type SectionViewModel = {
  number: string;
  label: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  cards: Task[];
};

function PhaseCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="h-[330px] rounded-[14px] border border-[#9DDEB9] bg-[#EEFAF3] p-6">
      <p
        className="mb-4 text-[13px] font-semibold leading-none text-[#2FA66A]"
        style={{
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", sans-serif',
        }}
      >
        {step}
      </p>

      <h3
        className="mb-4 line-clamp-2 text-[18px] font-bold leading-[1.5] text-[#1C1E22]"
        style={{
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", sans-serif',
        }}
      >
        {title}
      </h3>

      <p
        className="line-clamp-8 text-[13px] leading-[1.9] text-[#454B55]"
        style={{
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", sans-serif',
        }}
      >
        {description}
      </p>
    </div>
  );
}

function AddCard() {
  return (
    <div className="flex h-[280px] items-center justify-center rounded-[14px] border border-[#9DDEB9] bg-[#EEFAF3] p-6">
      <span
        className="flex h-[56px] w-[56px] items-center justify-center rounded-full border border-[#9DDEB9] text-[30px] font-medium leading-none text-[#2FA66A]"
        style={{
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", sans-serif',
        }}
      >
        +
      </span>
    </div>
  );
}

function PhaseCards({
  cards,
  sectionNumber,
}: {
  cards: Task[];
  sectionNumber: string;
}) {
  const shouldSlide = cards.length > 3;

  if (shouldSlide) {
    return (
      <div className="mt-10">
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-4">
            {cards.map((card, index) => (
              <div
                key={`${sectionNumber}-${card.taskId}-${index}`}
                className="w-[320px] shrink-0"
              >
                <PhaseCard
                  step={getStepLabel(index)}
                  title={card.taskName}
                  description={card.description}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filledCards: Array<Task | null> = [...cards];
  while (filledCards.length < 3) {
    filledCards.push(null);
  }

  return (
    <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
      {filledCards.map((card, index) =>
        card === null ? (
          <AddCard key={`${sectionNumber}-add-${index}`} />
        ) : (
          <PhaseCard
            key={`${sectionNumber}-${card.taskId}-${index}`}
            step={getStepLabel(index)}
            title={card.taskName}
            description={card.description}
          />
        )
      )}
    </div>
  );
}

function SectionActionButtons({
  cards,
  roadmap,
}: {
  cards: Task[];
  roadmap: RoadmapResponse;
}) {
  const router = useRouter();

  const handleCreatePlan = (task: Task) => {
    const params = new URLSearchParams({
      roadmapId: String(roadmap.roadmapId),
      examTaskId: String(task.taskId),
      name: task.taskName,
      daily: String(roadmap.daily),
      weekly: String(roadmap.weekly),
      mylevel: roadmap.mylevel,
    });

    router.push(`/plan/generate?${params.toString()}`);
  };

  return (
    <div className="mt-6">
      <p
        className="mb-3 text-[14px] font-medium text-[#5B6470]"
        style={{
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", sans-serif',
        }}
      >
        플랜을 만들까요?
      </p>

      <div className="flex flex-wrap gap-2">
        {cards.map((card, index) => {
          const isPrimary = index === 0;

          return (
            <button
              key={`${card.taskId}-${index}`}
              type="button"
              onClick={() => handleCreatePlan(card)}
              className={
                isPrimary
                  ? "inline-flex h-[42px] items-center justify-center rounded-full bg-[#2FA66A] px-4 text-[14px] font-semibold text-white transition hover:opacity-90"
                  : "inline-flex h-[42px] items-center justify-center rounded-full border border-[#D0D5DD] bg-white px-4 text-[14px] font-medium text-[#344054] transition hover:bg-[#F9FAFB]"
              }
              style={{
                fontFamily:
                  'Inter, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", sans-serif',
              }}
            >
              {card.taskName} 플랜 만들기
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BottomRegenerateButton() {
  const router = useRouter();

  return (
    <div className="mt-16 flex justify-center">
      <button
        type="button"
        onClick={() => router.push("/roadmap/generate")}
        className="inline-flex h-[46px] items-center justify-center rounded-full border border-[#1eb926] bg-[#c2e2ba] px-6 text-[14px] font-medium text-[#333333] transition hover:bg-[#F9FAFB]"
        style={{
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", sans-serif',
        }}
      >
        로드맵 재생성하기
      </button>
    </div>
  );
}

function EmptyRoadmapState() {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <button
        type="button"
        onClick={() => router.push("/roadmap/generate")}
        className="inline-flex h-[48px] items-center justify-center rounded-full bg-[#2FA66A] px-6 text-[15px] font-semibold text-white transition hover:opacity-90"
        style={{
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", sans-serif',
        }}
      >
        로드맵 생성하기
      </button>
    </div>
  );
}

function PhaseBlock({
  section,
  roadmap,
}: {
  section: SectionViewModel;
  roadmap: RoadmapResponse;
}) {
  return (
    <div className="border-t border-[#E5E7EB] pt-16 first:border-t-0 first:pt-0">
      <div className="flex items-start gap-6">
        <div
          className="mt-1 pb-1 text-[64px] font-semibold leading-none tracking-[-1px] text-[#5FCC8E]"
          style={{
            transform: "scaleY(1.5)",
            transformOrigin: "center",
            fontFamily: '"Lora", "Georgia", serif',
          }}
        >
          {section.number}
        </div>

        <div className="min-w-0 pt-1">
          <p
            className="mb-1 ml-1 mt-3 text-[11px] font-medium leading-none text-[#98A2B3]"
            style={{
              fontFamily:
                'Inter, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", sans-serif',
            }}
          >
            {section.label}
          </p>

          <h2
            className={`text-[34px] font-bold leading-[1.2] tracking-[-0.5px] text-[#1C1E22] ${serif.className}`}
          >
            {section.title}
          </h2>
        </div>
      </div>

      <p
        className="mb-7 mt-4 text-[15px] leading-[1.9] text-[#454B55]"
        style={{
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", sans-serif',
        }}
      >
        {section.description}
      </p>

      <div className="mt-8 flex justify-center">
        <Image
          src={section.imageSrc}
          alt={section.imageAlt}
          width={760}
          height={430}
          className="h-auto w-full max-w-[600px] object-contain"
          priority
        />
      </div>

      <PhaseCards cards={section.cards} sectionNumber={section.number} />
      <SectionActionButtons cards={section.cards} roadmap={roadmap} />
    </div>
  );
}

export default function PhaseSection() {
  const { roadmap, loading, error } = useRoadmap();

  if (loading) {
    return (
      <div className="py-16 text-[15px] text-[#667085]">
        로드맵을 불러오는 중...
      </div>
    );
  }

  if (error || !roadmap || roadmap.phases.length === 0) {
    return <EmptyRoadmapState />;
  }

  const sections = roadmap.phases.map((phase, index) =>
    mapPhaseToSection(phase, index)
  );

  return (
    <div
      className="mt-10 space-y-24"
      style={{
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", sans-serif',
      }}
    >
      {sections.map((section) => (
        <div key={section.number}>
          <PhaseBlock section={section} roadmap={roadmap} />
        </div>
      ))}

      <BottomRegenerateButton />
    </div>
  );
}

function mapPhaseToSection(phase: Phase, index: number): SectionViewModel {
  const phaseIndex = phase.phaseNumber ?? index + 1;

  return {
    number: String(phaseIndex).padStart(2, "0"),
    label: getPhaseLabel(phaseIndex),
    title: phase.phaseTitle,
    description: getPhaseDescription(phaseIndex, phase),
    imageSrc: getPhaseImage(phaseIndex),
    imageAlt: `phase ${phaseIndex}`,
    cards: phase.tasks,
  };
}

function getPhaseLabel(phaseNumber: number) {
  switch (phaseNumber) {
    case 1:
      return "기초";
    case 2:
      return "준비";
    case 3:
      return "심화";
    default:
      return "단계";
  }
}

function getPhaseImage(phaseNumber: number) {
  switch (phaseNumber) {
    case 1:
      return "/phase-hero1.png";
    case 2:
      return "/phase-hero.png";
    case 3:
      return "/phase-hero5.png";
    default:
      return "/images/moxt-phase-01.png";
  }
}

function getPhaseDescription(phaseNumber: number, phase: Phase) {
  switch (phaseNumber) {
    case 1:
      return "막연한 목표는 쉽게 흐트러지지만, 방향이 정리된 목표는 바로 시작할 수 있습니다. 뿌리는 사용자의 현재 상태와 목표를 바탕으로, 무엇을 언제까지 어떻게 준비해야 하는지를 단계별로 정리합니다. 흐름이 보이면, 실행은 자연스럽게 이어집니다.";
    case 2:
      return "시험 준비와 커리어 성장은 늘 혼자 감당해야 하는 일처럼 느껴집니다. 뿌리는 단순히 정보를 보여주는 서비스가 아니라, 사용자의 목표를 함께 정리하고 다음 행동을 제안하는 AI 기반 학습 파트너가 되고자 합니다.";
    case 3:
      return "자격증, 공부 기록, 일정, 목표가 많아질수록 오히려 더 복잡해질 수 있습니다. 중요한 것은 많이 모으는 것이 아니라, 지금의 목표에 맞는 것만 연결해 하나의 흐름으로 만드는 일입니다. 뿌리는 흩어진 준비를 의미 있는 성장 경로로 정리합니다.";
    default:
      return `${phase.phaseTitle} 단계에서 필요한 자격증과 학습 흐름을 확인하고, 원하는 항목을 선택해 바로 플랜 생성을 시작할 수 있습니다.`;
  }
}

function getStepLabel(index: number) {
  const labels = ["첫째", "둘째", "셋째", "넷째", "다섯째", "여섯째"];
  return labels[index] ?? `${index + 1}번째`;
}