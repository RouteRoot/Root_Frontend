"use client";

import { getPlanByExamTaskId, getPlanTabs } from "@/app/api/plan/plan";
import type { PlanResponse } from "@/app/api/plan/types";
import { getPopularPosts } from "@/app/api/community/post";
import type { Post } from "@/app/api/community/types";
import { getArchivePostDetail } from "@/app/api/archive/archive";
import type { ArchivePost } from "@/app/api/archive/types";
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
    src: "/Group 45.png",
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
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-[17px] font-semibold tracking-tight text-[#252A32]">
        {title}
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
          <p className="text-[12px] font-medium text-[#4876EF]">
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
    return (
      <section className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-4">
        <p className="text-[12px] font-medium text-[#4876EF]">맞춤 플랜</p>
        <h2 className="mt-1 text-[15px] font-semibold text-[#252A32]">
          목표 자격증까지 필요한 계획을 만들어보세요.
        </h2>
        <Link
          href="/signup"
          className="mt-4 flex min-h-10 items-center justify-center rounded-[8px] bg-[#252A32] text-[12px] font-medium text-white"
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
  const [wikiPosts, setWikiPosts] = useState<ArchivePost[]>([]);

  useEffect(() => {
    let mounted = true;

    Promise.all(
      WIKI_HERO_POST_IDS.map((id) => getArchivePostDetail(id).catch(() => null))
    ).then((posts) => {
      if (!mounted) return;
      setWikiPosts(posts.filter((post): post is ArchivePost => post !== null));
    });

    return () => {
      mounted = false;
    };
  }, []);

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
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-[#4876EF]">
                PICK
              </span>
            )}
          </Link>
        ))}
      </div>
      {guest && (
        <div className="mt-3 flex snap-x gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {(wikiPosts.length > 0 ? wikiPosts : wikiFallbackCards).map((item, index) => {
            const isPost = "postId" in item;
            const postId = isPost ? item.postId : item.id;
            const title = item.title;
            const excerpt = isPost ? stripHtml(item.content) : item.excerpt;
            const imageUrl = isPost ? extractFirstImage(item.content) : "";

            return (
              <Link
                key={postId}
                href={`/certificate/archive/${postId}`}
                className="relative block aspect-[1.72/1] w-[72%] shrink-0 snap-start overflow-hidden rounded-[8px] bg-white shadow-sm"
                style={{
                  backgroundImage: imageUrl
                    ? undefined
                    : wikiFallbackGradients[index % wikiFallbackGradients.length],
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              >
                {imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/72 via-black/20 to-transparent" />
                {!imageUrl && (
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.11)_1px,transparent_1px)] bg-size-[16px_16px]" />
                )}
                <div className="relative z-10 flex h-full flex-col justify-end px-3.5 py-3.5">
                  <span className="w-fit rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                  자격증 위키
                </span>
                <h3 className="mt-2 line-clamp-2 text-[14px] font-semibold leading-[1.35] text-white">
                  {title}
                </h3>
                <p className="mt-1 line-clamp-1 text-[11px] font-medium text-white/75">
                  {excerpt}
                </p>
              </div>
            </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

function CommunitySection() {
  const [posts, setPosts] = useState<MobilePost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadPosts() {
      try {
        setIsLoading(true);
        const data = await getPopularPosts(3);
        if (mounted) setPosts(data.map(toMobilePost));
      } catch {
        if (mounted) setPosts([]);
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
          : posts.map((post) => (
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
                <div className="mt-3 flex items-center gap-3 text-[11px] font-medium text-[#98A2B3]">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5" />
                    {post.likeCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {post.commentCount}
                  </span>
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
      <MobileHero guest={guest} />
      <TodayPlanCard guest={guest} />
      <CommunitySection />
      <CertificateSection />
      <ReviewSection />
    </div>
  );
}
