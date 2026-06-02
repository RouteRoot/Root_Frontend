"use client";

import { getPlanByExamTaskId, getPlanTabs } from "@/app/api/plan/plan";
import type { PlanResponse } from "@/app/api/plan/types";
import { getPopularPosts } from "@/app/api/community/post";
import type { Post } from "@/app/api/community/types";
import { getMe } from "@/app/api/service/user";
import { dashboardCertificates } from "@/components/dashboard/dashboardCertificateData";
import { getPostPreviewContent } from "@/components/community/postContentPreview";
import {
  ArrowRight,
  CalendarCheck,
  ChevronRight,
  Heart,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type MobileDashboardSectionsProps = {
  guest?: boolean;
};

type MobilePost = {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  viewCount?: number;
};

type TodayPlan = {
  taskName: string;
  weekNumber: number;
  dayNumber: number;
  topic: string;
  description: string;
  hours: number;
};

const recommendationCards = [
  {
    href: "/community/1",
    src: "/Group 48 (2).svg",
    alt: "오늘의 추천",
    priority: true,
  },
  {
    href: "/community/4",
    src: "/Group 24.svg",
    alt: "추천 콘텐츠",
  },
  {
    href: "/community/17",
    src: "/Group 25.svg",
    alt: "추천 콘텐츠",
  },
];

const homeHeroCards = [
  {
    href: "/certificate/archive/30",
    src: "/mhero1.png",
    title: "SQLD 취득 완벽 로드맵 2026\n[비전공자를 위한]",
  },
  {
    href: "/certificate/archive/29",
    src: "/mhero2.png",
    title: "정보처리기사 필기 시험 한번에\n합격하는 방법",
  },
  {
    href: "/certificate/archive/28",
    src: "/mhero3.png",
    title: "전기기사, 이렇게 준비하면 합격합니다.",
  },
];

const popularCommunityPosts: MobilePost[] = [
  {
    id: 1,
    title: "BBURI(뿌리) 사용 방법",
    content: "뿌리는 사용자의 목표와 현재 수준을 바탕으로 AI가 맞춤형 로드맵과 학습 플랜을 만들어줍니다.",
    likeCount: 1,
    commentCount: 1,
    viewCount: 98,
  },
  {
    id: 2,
    title: "정보처리기사 필기 3주 합격 후기!",
    content: "정보처리기사 필기 3주 합격 후기 두구두구...",
    likeCount: 0,
    commentCount: 2,
    viewCount: 58,
  },
  {
    id: 3,
    title: "취업에 도움이 되는 자격증 정리 (완전판)",
    content: "취업에 도움이 되는 자격증 정리 (완전판) 🎯 🔥 ...",
    likeCount: 0,
    commentCount: 0,
    viewCount: 27,
  },
  {
    id: 4,
    title: "아니 정처기 왤케 어려워짐?",
    content: "올해부터 엄청 어렵게 바뀐거같은데 이거 뭐지 ㄹㅇ;...",
    likeCount: 0,
    commentCount: 0,
    viewCount: 20,
  },
];

const WIKI_HERO_POST_IDS = [30, 29, 28] as const;
const wikiFallbackGradients = [
  "linear-gradient(135deg,#4876EF,#93C5FD)",
  "linear-gradient(135deg,#0F766E,#5EEAD4)",
  "linear-gradient(135deg,#6D28D9,#C4B5FD)",
];

const wikiFallbackCards = WIKI_HERO_POST_IDS.map((id, index) => ({
  id,
  title: ["자격증 위키 추천 콘텐츠", "합격 전략 아카이브", "커리어에 도움되는 자격증 이야기"][index],
  excerpt: "자격증 위키에서 더 자세히 살펴보세요.",
}));

function toMobilePost(post: Post): MobilePost {
  return {
    id: post.postId,
    title: post.title,
    content: getPostPreviewContent(post.content),
    likeCount: post.likeCount,
    commentCount: post.commentCount,
  };
}

function extractFirstImage(html: string) {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] ?? "";
}

function stripHtml(content: string) {
  return content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function getTodayInSeoul() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function normalizeDate(value: string) {
  if (!value) return "";
  return value.slice(0, 10);
}

function findTodayPlan(plan: PlanResponse): TodayPlan | null {
  const today = getTodayInSeoul();

  for (const week of plan.weeklyPlans) {
    const daily = week.dailyPlans.find(
      (item) => normalizeDate(item.studyDate) === today && !item.isRest
    );

    if (daily) {
      return {
        taskName: plan.taskName,
        weekNumber: week.weekNumber,
        dayNumber: daily.dayNumber,
        topic: daily.topic || plan.taskName,
        description: daily.description || "오늘 학습 계획을 확인해보세요.",
        hours: daily.estimatedHours,
      };
    }
  }

  for (const week of plan.weeklyPlans) {
    const daily = week.dailyPlans.find((item) => !item.isCompleted && !item.isRest);

    if (daily) {
      return {
        taskName: plan.taskName,
        weekNumber: week.weekNumber,
        dayNumber: daily.dayNumber,
        topic: daily.topic || plan.taskName,
        description: daily.description || "다음 학습 계획을 이어서 진행해보세요.",
        hours: daily.estimatedHours,
      };
    }
  }

  return null;
}

function SectionTitle({
  title,
  href,
}: {
  title: string;
  href?: string;
}) {
  const displayTitle = href === "/community" ? "커뮤니티 인기글" : title;

  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-[17px] font-semibold tracking-tight text-[#252A32]">
        {displayTitle}
      </h2>
      {href && (
        <Link
          href={href}
          className="flex min-h-9 items-center gap-0.5 text-[12px] font-medium text-[#8A94A6]"
        >
          더보기
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function MobileHero({ guest }: { guest: boolean }) {
  return (
    <section className="rounded-[8px] border border-[#D8E4FF] bg-[#F7FAFF] px-5 py-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#EAF1FF] text-[#4876EF]">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0">
        <p className="hidden text-[12px] font-medium text-[#4876EF]">
            {guest ? "처음 방문하셨나요?" : "오늘도 이어서"}
          </p>
          <h1 className="mt-1 text-[19px] font-semibold leading-tight tracking-tight text-[#172033]">
            {guest ? "자격증 준비를 한 화면에서 시작해요" : "오늘의 학습 흐름을 확인해요"}
          </h1>
          <p className="mt-2 text-[13px] leading-[1.6] text-[#667085]">
            {guest
              ? "로드맵, 플랜, 커뮤니티 인기글을 모바일에 맞게 빠르게 둘러볼 수 있어요."
              : "추천 콘텐츠와 오늘의 플랜을 먼저 보고 바로 다음 행동으로 이동하세요."}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <Link
          href={guest ? "/signup" : "/plan"}
          className="flex min-h-10 items-center justify-center gap-1 rounded-[8px] bg-[#4876EF] px-3 text-[12px] font-medium text-white"
        >
          {guest ? "무료 시작" : "플랜 보기"}
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href={guest ? "/login" : "/roadmap"}
          className="flex min-h-10 items-center justify-center rounded-[8px] border border-[#CFE0FF] bg-white px-3 text-[12px] font-medium text-[#4876EF]"
        >
          {guest ? "로그인" : "로드맵"}
        </Link>
      </div>
    </section>
  );
}

function TodayPlanCard({ guest }: { guest: boolean }) {
  const [userName, setUserName] = useState("");
  const [plans, setPlans] = useState<TodayPlan[]>([]);
  const [isLoading, setIsLoading] = useState(!guest);

  useEffect(() => {
    if (guest) return;

    let mounted = true;

    async function loadPlan() {
      try {
        setIsLoading(true);
        const [tabs, me] = await Promise.all([getPlanTabs(), getMe().catch(() => null)]);
        if (!mounted) return;

        setUserName(me?.name ?? "");

        const loadedPlans = await Promise.all(
          tabs.map(async (tab) => {
            try {
              const detail = await getPlanByExamTaskId(tab.examTaskId);
              return findTodayPlan(detail);
            } catch {
              return null;
            }
          })
        );

        if (mounted) setPlans(loadedPlans.filter(Boolean) as TodayPlan[]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    void loadPlan();

    return () => {
      mounted = false;
    };
  }, [guest]);

  if (guest) {
    const guestRecommendations = [
      {
        title: "정보처리기사 3주 완성 플랜",
        meta: "비전공자 추천",
        tag: "필기",
        due: "D-21",
      },
      {
        title: "SQLD 입문자 로드맵",
        meta: "데이터 자격증",
        tag: "기초",
        due: "D-14",
      },
      {
        title: "전기기사 핵심 개념 정리",
        meta: "실기 대비",
        tag: "요약",
        due: "D-30",
      },
    ];

    return (
      <section>
        <div className="mb-3 flex items-center justify-between px-0.5">
          <h2 className="text-[15px] font-semibold tracking-tight text-[#252A32]">
            로그인하면 맞춤 플랜 추천해드려요
          </h2>
          <Link href="/login" className="text-[12px] font-semibold text-[#4876EF]">
            로그인
          </Link>
        </div>
        <div className="flex snap-x gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
          {guestRecommendations.map((item) => (
            <Link
              key={item.title}
              href="/login"
              className="block min-h-[132px] w-[76%] shrink-0 snap-start rounded-[8px] border border-[#AFC7FF] bg-white px-4 py-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[12px] font-medium text-[#667085]">
                  {item.meta}
                </p>
                <Sparkles className="h-4 w-4 shrink-0 text-[#C7CEDA]" />
              </div>
              <h3 className="mt-2 line-clamp-2 text-[14px] font-semibold leading-[1.35] text-[#252A32]">
                {item.title}
              </h3>
              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="rounded-[6px] bg-[#F3F6FA] px-2 py-1 text-[11px] font-medium text-[#667085]">
                    맞춤 추천
                  </span>
                  <span className="rounded-[6px] bg-[#F3F6FA] px-2 py-1 text-[11px] font-medium text-[#667085]">
                    {item.tag}
                  </span>
                </div>
                <span className="shrink-0 text-[11px] font-medium text-[#98A2B3]">
                  {item.due}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );

    return (
      <section className="rounded-[8px] border border-[#D8E4FF] bg-[#F7FAFF] px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-white text-[#4876EF] shadow-sm">
            <CalendarCheck className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-[#4876EF]">맞춤 플랜</p>
            <h2 className="mt-1 text-[16px] font-semibold leading-snug text-[#252A32]">
              목표 자격증까지 필요한 계획을 만들어보세요.
            </h2>
            <p className="mt-2 text-[12px] leading-[1.55] text-[#667085]">
              가입하면 학습 기간과 난이도에 맞춘 로드맵을 바로 확인할 수 있어요.
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href="/signup"
            className="flex min-h-10 items-center justify-center rounded-[8px] bg-[#4876EF] px-3 text-[12px] font-semibold text-white shadow-sm"
          >
            플랜 만들기
          </Link>
          <Link
            href="/login"
            className="flex min-h-10 items-center justify-center rounded-[8px] border border-[#CFE0FF] bg-white px-3 text-[12px] font-semibold text-[#4876EF]"
          >
            로그인
          </Link>
        </div>
        <p className="hidden text-[12px] font-medium text-[#4876EF]">맞춤 플랜</p>
        <h2 className="hidden mt-1 text-[15px] font-semibold text-[#252A32]">
          목표 자격증까지 필요한 계획을 만들어보세요.
        </h2>
        <Link
          href="/signup"
          className="hidden"
        >
          회원가입하고 플랜 만들기
        </Link>
      </section>
    );
  }

  return (
    <section>
      <p className="text-[12px] font-medium text-[#8A94A6]">
        {userName ? `${userName}님의 오늘 플랜` : "오늘의 플랜"}
      </p>

      {isLoading ? (
        <div className="mt-3 rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-4">
          <div className="h-5 w-3/4 animate-pulse rounded bg-[#EEF2F7]" />
          <div className="mt-3 h-4 w-full animate-pulse rounded bg-[#F3F6FA]" />
          <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-[#F3F6FA]" />
        </div>
      ) : plans.length > 0 ? (
        <div className="mt-3 flex snap-x gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {plans.map((plan) => (
            <article
              key={`${plan.taskName}-${plan.weekNumber}-${plan.dayNumber}`}
              className="w-[88%] shrink-0 snap-start rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-4"
            >
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#EEF4FF] px-2.5 py-1 text-[11px] font-medium text-[#4876EF]">
                  W{plan.weekNumber} / D{plan.dayNumber}
                </span>
                <span className="text-[12px] font-medium text-[#8A94A6]">
                  {plan.hours}시간
                </span>
              </div>
              <h2 className="mt-3 line-clamp-2 text-[15px] font-medium leading-snug text-[#252A32]">
                {plan.topic}
              </h2>
              <p className="mt-2 line-clamp-3 text-[13px] leading-[1.6] text-[#667085]">
                {plan.description}
              </p>
              <Link
                href="/plan"
                className="mt-4 flex min-h-10 items-center justify-center rounded-[8px] bg-[#4876EF] text-[12px] font-medium text-white"
              >
                오늘 플랜 보기
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-3 rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-4">
          <h2 className="mt-2 text-[15px] font-semibold text-[#252A32]">
            아직 오늘 진행할 플랜이 없어요.
          </h2>
          <Link
            href="/roadmap"
            className="mt-4 flex min-h-10 items-center justify-center rounded-[8px] bg-[#4876EF] text-[12px] font-medium text-white"
          >
            로드맵에서 플랜 만들기
          </Link>
        </div>
      )}
    </section>
  );
}

function RecommendationSection({ guest }: { guest: boolean }) {
  return (
    <section>
      <SectionTitle title="오늘의 추천" />
      <div className="flex overflow-hidden pb-1">
        {recommendationCards.slice(0, 1).map((card, index) => (
          <Link
            key={card.href}
            href={card.href}
            className="relative block aspect-[2.1/1] w-full shrink-0 overflow-hidden rounded-[8px] bg-white shadow-sm"
          >
            <Image
              src={card.src}
              alt={card.alt}
              fill
              sizes="320px"
              priority={card.priority}
              className={`object-cover ${index === 0 ? "translate-x-[-6px] scale-[1.03]" : ""}`}
            />
            {index === 0 && (
              <div className="absolute left-5 top-5">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-[#4876EF]">
                    PICK
                  </span>
                  <span className="text-[10px] font-semibold text-white/75">
                    뿌리 에디터 작성
                  </span>
                </div>
                <h3 className="mt-3 whitespace-pre-line text-[19px] font-medium leading-[1.28] text-white">
                  {"뿌리에 오신걸 환영합니다.\n사용법을 알려드릴게요!"}
                </h3>
              </div>
            )}
          </Link>
        ))}
      </div>
      <div className="mt-3 flex snap-x gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {homeHeroCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="relative block aspect-[1.72/1] w-[72%] shrink-0 snap-start overflow-hidden rounded-[8px] bg-white shadow-sm"
          >
            <Image
              src={card.src}
              alt={card.title}
              fill
              sizes="240px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 px-3.5 pb-3.5">
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-flex rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                  시험 정보
                </span>
                <span className="text-[10px] font-semibold text-white/75">
                  뿌리 에디터
                </span>
              </div>
              <h3 className="line-clamp-2 whitespace-pre-line text-[14px] font-semibold leading-[1.35] text-white">
                {card.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function CommunitySection() {
  const [posts, setPosts] = useState<MobilePost[]>(popularCommunityPosts);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadPosts() {
      try {
        setIsLoading(true);
        await getPopularPosts(3);
        if (mounted) setPosts(popularCommunityPosts);
      } catch {
        if (mounted) setPosts(popularCommunityPosts);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    void loadPosts();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section>
      <SectionTitle title="커뮤니티 인기글" href="/community" />
      <div className="space-y-2">
        {isLoading
          ? [1, 2, 3].map((item) => (
              <div key={item} className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-[#EEF2F7]" />
                <div className="mt-3 h-3 w-full animate-pulse rounded bg-[#F3F6FA]" />
              </div>
            ))
          : posts.slice(0, 3).map((post) => (
              <Link
                key={post.id}
                href={`/community/${post.id}`}
                className="block rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-4"
              >
                <h3 className="line-clamp-2 text-[13px] font-medium leading-[1.45] text-[#252A32]">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-[13px] leading-[1.55] text-[#667085]">
                  {post.content}
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px] font-medium text-[#98A2B3]">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" />
                      {post.likeCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {post.commentCount}
                    </span>
                  </div>
                  {typeof post.viewCount === "number" && (
                    <span>조회 {post.viewCount}</span>
                  )}
                </div>
              </Link>
            ))}

        {!isLoading && posts.length === 0 && (
          <div className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-6 text-center text-[13px] text-[#98A2B3]">
            아직 인기글이 없어요.
          </div>
        )}
      </div>
    </section>
  );
}

function CertificateSection() {
  const topCertificates = useMemo(() => dashboardCertificates.slice(0, 6), []);

  return (
    <section>
      <SectionTitle title="자격증 TOP" href="/certificate" />
      <div className="space-y-2">
        {topCertificates.map((item) => (
          <Link
            key={item.rank}
            href={`/certificate/search?keyword=${encodeURIComponent(item.name)}`}
            className="flex min-h-16 items-center gap-3 rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-3"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[#EEF4FF] text-[12px] font-semibold text-[#4876EF]">
              {item.rank}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium text-[#252A32]">
                {item.name}
              </span>
              <span className="mt-0.5 block truncate text-[12px] font-medium text-[#8A94A6]">
                {item.agency} · {item.examDate}
              </span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-[#B3BBC8]" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function ReviewSection() {
  const reviews = [
    {
      title: "합격자들이 남긴 준비 루틴을 확인해보세요.",
      href: "/community",
      icon: MessageCircle,
    },
    {
      title: "시험 일정과 학습 계획을 함께 관리해보세요.",
      href: "/certificate/archive",
      icon: CalendarCheck,
    },
  ];

  return (
    <section>
      <SectionTitle title="합격 후기와 자료" href="/certificate/archive" />
      <div className="grid grid-cols-1 gap-2">
        {reviews.map((review) => {
          const Icon = review.icon;

          return (
            <Link
              key={review.href}
              href={review.href}
              className="flex min-h-16 items-center gap-3 rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#F7F9FB] text-[#4876EF]">
                <Icon className="h-5 w-5" />
              </div>
              <p className="min-w-0 flex-1 text-[12px] font-medium leading-[1.45] text-[#344054]">
                {review.title}
              </p>
              <ChevronRight className="h-4 w-4 text-[#B3BBC8]" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default function MobileDashboardSections({
  guest = false,
}: MobileDashboardSectionsProps) {
  return (
    <div className="mx-auto flex w-full max-w-[430px] flex-col gap-7 pb-7">
      <RecommendationSection guest={guest} />
      <TodayPlanCard guest={guest} />
      <CommunitySection />
      <CertificateSection />
      <ReviewSection />
    </div>
  );
}
