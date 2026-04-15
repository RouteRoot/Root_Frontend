"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type TabType = "pick" | "popular";

type RecommendPost = {
  id: number;
  type: TabType;
  title: string;
  content: string;
  commentCount: number;
  viewCount: number | string;
};

const CARD_WIDTH = 276;
const CARD_HEIGHT = 189;
const CARD_GAP = 12;
const PEEK = 46;
const MAX_VISIBLE_COUNT = 5;
const DRAG_THRESHOLD = 8;

const mockPosts: RecommendPost[] = [
  {
    id: 1,
    type: "pick",
    title: "컴활 1급이랑 SQLD 중에 뭐 먼저 준비하는 게 좋을까요?",
    content:
      "방학 동안 자격증 하나는 꼭 따고 싶은데 우선순위를 못 정하겠어요. 개발 직무 기준으로 먼저 준비해본 분들 의견 궁금합니다.",
    commentCount: 18,
    viewCount: 782,
  },
  {
    id: 2,
    type: "pick",
    title: "한성대 근처에서 SQLD 스터디 같이 하실 분 구해요",
    content:
      "주 2회 오프라인으로 기출 풀이랑 개념 정리 같이 할 분 모집합니다. 초보도 괜찮고 꾸준히 하실 분이면 좋겠어요.",
    commentCount: 12,
    viewCount: 431,
  },
  {
    id: 3,
    type: "pick",
    title: "정보처리기사 필기 3주 합격 후기 공유합니다",
    content:
      "비전공자 기준으로 3주 공부해서 붙었어요. 기출 반복이 핵심이었고, 과목별 시간 배분 어떻게 했는지도 같이 적어봤습니다.",
    commentCount: 26,
    viewCount: 1542,
  },
  {
    id: 4,
    type: "pick",
    title: "Next.js 포트폴리오 만들 때 꼭 넣으면 좋은 것들",
    content:
      "프로젝트 개수보다 핵심 기능 설명이 더 중요하더라고요. 실제로 면접에서 질문 많이 받았던 포인트들 정리해봤어요.",
    commentCount: 9,
    viewCount: 628,
  },
  {
    id: 5,
    type: "pick",
    title: "아침 8시 온라인 모각공 같이 하실 분 있을까요?",
    content:
      "줌 켜두고 2시간씩 각자 공부하는 방식입니다. 혼자 하면 흐트러져서 같이 루틴 잡으실 분 있으면 좋겠어요.",
    commentCount: 14,
    viewCount: 505,
  },
  {
    id: 6,
    type: "popular",
    title: "오늘 공부 6시간 했는데도 왜 이렇게 불안할까요",
    content:
      "분명 열심히 했는데도 계속 부족한 것 같고 뒤처지는 느낌이 듭니다. 다들 이런 날 어떻게 멘탈 관리하시나요?",
    commentCount: 43,
    viewCount: "9,999+",
  },
  {
    id: 7,
    type: "popular",
    title: "비전공자도 백엔드 준비해도 괜찮을까요?",
    content:
      "Spring Boot 공부를 시작했는데 주변에서는 프론트가 더 낫다고 하네요. 실제로 준비해보신 분들 현실적인 조언 부탁드립니다.",
    commentCount: 37,
    viewCount: 2841,
  },
  {
    id: 8,
    type: "popular",
    title: "첫 인턴 서류 합격률 올린 방법 5가지",
    content:
      "작년엔 거의 다 떨어졌는데 자소서 구조랑 프로젝트 설명 방식 바꾸고 나서 확실히 달라졌어요. 작은 팁들 정리해봤습니다.",
    commentCount: 21,
    viewCount: 1964,
  },
  {
    id: 9,
    type: "popular",
    title: "면접 끝나고 집 오는 길이 제일 허무한 사람 있나요",
    content:
      "끝나고 나면 자꾸 아쉬운 답변만 생각나요. 다음 면접 준비도 해야 하는데 멘탈이 쉽게 안 돌아옵니다.",
    commentCount: 28,
    viewCount: 1327,
  },
  {
    id: 10,
    type: "popular",
    title: "취준할 때 가장 도움됐던 사이트나 서비스 공유해봐요",
    content:
      "저는 일정 관리랑 계획 세우는 게 제일 어려웠는데, 다들 어떤 서비스나 자료를 많이 참고하는지 궁금합니다.",
    commentCount: 31,
    viewCount: 1748,
  },
];

function formatNumber(value: number | string) {
  if (typeof value === "string") return value;
  return value.toLocaleString("ko-KR");
}

function getPopularScore(post: RecommendPost) {
  const numericViewCount =
    typeof post.viewCount === "number" ? post.viewCount : 10000;
  return numericViewCount + post.commentCount * 3;
}

function RecommendCard({
  post,
  activeTab,
  wasDraggedRef,
}: {
  post: RecommendPost;
  activeTab: TabType;
  wasDraggedRef: React.MutableRefObject<boolean>;
}) {
  const isPick = activeTab === "pick";

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (wasDraggedRef.current) {
      e.preventDefault();
      wasDraggedRef.current = false;
    }
  };

  return (
    <Link
      href={`/community/${post.id}`}
      draggable={false}
      onClick={handleClick}
      className="
        flex h-[189px] w-[276px] flex-col
        rounded-[22px] border border-[#dee5f5] bg-white
        px-[24px] pt-[22px] pb-[22px]
        transition-transform duration-300 ease-out
      "
    >
      <span
        className={`inline-flex h-[28px] w-fit items-center rounded-full px-[10px] text-[11px] font-bold leading-none text-white ${
          isPick ? "bg-[#00D3AB]" : "bg-[#FF6363]"
        }`}
      >
        {isPick ? "PICK" : "인기글"}
      </span>

      <h3 className="mt-[18px] overflow-hidden whitespace-nowrap text-ellipsis text-[16px] font-bold leading-[1.35] tracking-[-0.02em] text-[#2A2F45]">
        {post.title}
      </h3>

      <p className="mt-[12px] min-h-[42px] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] text-[14px] leading-[1.5] tracking-[-0.02em] text-[#5A6178]">
        {post.content}
      </p>

      <div className="mt-auto pt-[18px] text-[14px] leading-none text-[#8B93A8]">
        <span>댓글 </span>
        <span className="font-semibold text-[#707991]">
          {formatNumber(post.commentCount)}
        </span>
        <span className="mx-[8px] text-[#CDD3DE]">|</span>
        <span>조회 </span>
        <span className="font-semibold text-[#707991]">
          {formatNumber(post.viewCount)}
        </span>
      </div>
    </Link>
  );
}

export default function RecommendedPostsSection() {
  const [activeTab, setActiveTab] = useState<TabType>("pick");
  const [showLeftPeek, setShowLeftPeek] = useState(false);
  const [showRightPeek, setShowRightPeek] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const isDraggingRef = useRef(false);
  const wasDraggedRef = useRef(false);

  const posts = useMemo(() => {
    const filtered = mockPosts.filter((post) => post.type === activeTab);

    if (activeTab === "popular") {
      return [...filtered]
        .sort((a, b) => getPopularScore(b) - getPopularScore(a))
        .slice(0, MAX_VISIBLE_COUNT);
    }

    return filtered.slice(0, MAX_VISIBLE_COUNT);
  }, [activeTab]);

  const updatePeekState = () => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, clientWidth, scrollWidth } = container;
    const maxScrollLeft = scrollWidth - clientWidth;
    const threshold = 8;

    setShowLeftPeek(scrollLeft > threshold);
    setShowRightPeek(scrollLeft < maxScrollLeft - threshold);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    updatePeekState();

    const handleScroll = () => updatePeekState();
    container.addEventListener("scroll", handleScroll, { passive: true });

    const handleResize = () => updatePeekState();
    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [activeTab, posts.length]);

  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      const container = scrollRef.current;
      if (!container || !isMouseDownRef.current) return;

      const diff = e.clientX - startXRef.current;

      if (!isDraggingRef.current && Math.abs(diff) >= DRAG_THRESHOLD) {
        isDraggingRef.current = true;
        wasDraggedRef.current = true;
      }

      if (isDraggingRef.current) {
        container.scrollLeft = startScrollLeftRef.current - diff;
      }
    };

    const handleWindowMouseUp = () => {
      isMouseDownRef.current = false;

      if (isDraggingRef.current) {
        requestAnimationFrame(() => {
          isDraggingRef.current = false;
        });
      }
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("mouseup", handleWindowMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container) return;

    isMouseDownRef.current = true;
    isDraggingRef.current = false;
    wasDraggedRef.current = false;
    startXRef.current = e.clientX;
    startScrollLeftRef.current = container.scrollLeft;
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    });
  };

  return (
    <section className="w-full">
      <div className="flex items-center justify-between">
        <h2 className="pl-2 text-[22px] font-bold leading-[1.4] tracking-[-0.03em] text-[#1F2D4A]">
          이런 글은 어때요?
        </h2>

        <div className="flex items-center rounded-full bg-[#F5F7FB] p-[4px]">
          <button
            type="button"
            onClick={() => handleTabChange("pick")}
            className={`rounded-full px-[18px] py-[4px] text-[12px] font-bold leading-[24px] transition-all duration-300 ${
              activeTab === "pick"
                ? "bg-[#4B5675] text-white"
                : "bg-transparent text-[#4B5675]"
            }`}
          >
            PICK
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("popular")}
            className={`rounded-full px-[18px] py-[4px] text-[12px] font-bold leading-[24px] transition-all duration-300 ${
              activeTab === "popular"
                ? "bg-[#4B5675] text-white"
                : "bg-transparent text-[#4B5675]"
            }`}
          >
            인기글
          </button>
        </div>
      </div>

      <div className="relative mt-[22px]">
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          className="scrollbar-hide ml-[1px] overflow-x-auto overflow-y-hidden pl-1 cursor-grab active:cursor-grabbing"
          style={{
            WebkitOverflowScrolling: "touch",
            userSelect: "none",
            overscrollBehaviorX: "contain",
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            paddingLeft: `${PEEK}px`,
            paddingRight: `${PEEK}px`,
          }}
        >
          <div
            className="ml-[4px] flex w-max"
            style={{
              gap: `${CARD_GAP}px`,
            }}
          >
            {posts.map((post) => (
              <div
                key={post.id}
                className="shrink-0 transition-transform duration-300 ease-out"
                style={{
                  width: `${CARD_WIDTH + 1}px`,
                  height: `${CARD_HEIGHT + 3}px`,
                  scrollSnapAlign: "start",
                }}
              >
                <RecommendCard
                  post={post}
                  activeTab={activeTab}
                  wasDraggedRef={wasDraggedRef}
                />
              </div>
            ))}
          </div>
        </div>

        <div
          className={`pointer-events-none absolute left-0 top-0 h-full w-[64px] transition-opacity duration-300 ${
            showLeftPeek ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`pointer-events-none absolute right-0 top-0 h-full w-[64px] transition-opacity duration-300 ${
            showRightPeek ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </section>
  );
}


// "use client";

// import Link from "next/link";
// import { useEffect, useMemo, useRef, useState } from "react";

// type TabType = "pick" | "popular";

// type RecommendPost = {
//   id: number;
//   type: TabType;
//   title: string;
//   content: string;
//   commentCount: number;
//   viewCount: number | string;
// };

// const CARD_WIDTH = 272;
// const CARD_HEIGHT = 189;
// const CARD_GAP = 18;
// const PEEK = 46;
// const MAX_VISIBLE_COUNT = 5;
// const DRAG_THRESHOLD = 8;

// const mockPosts: RecommendPost[] = [
//   {
//     id: 1,
//     type: "pick",
//     title: "컴활 1급이랑 SQLD 중에 뭐 먼저 준비하는 게 좋을까요?",
//     content:
//       "방학 동안 자격증 하나는 꼭 따고 싶은데 우선순위를 못 정하겠어요. 개발 직무 기준으로 먼저 준비해본 분들 의견 궁금합니다.",
//     commentCount: 18,
//     viewCount: 782,
//   },
//   {
//     id: 2,
//     type: "pick",
//     title: "한성대 근처에서 SQLD 스터디 같이 하실 분 구해요",
//     content:
//       "주 2회 오프라인으로 기출 풀이랑 개념 정리 같이 할 분 모집합니다. 초보도 괜찮고 꾸준히 하실 분이면 좋겠어요.",
//     commentCount: 12,
//     viewCount: 431,
//   },
//   {
//     id: 3,
//     type: "pick",
//     title: "정보처리기사 필기 3주 합격 후기 공유합니다",
//     content:
//       "비전공자 기준으로 3주 공부해서 붙었어요. 기출 반복이 핵심이었고, 과목별 시간 배분 어떻게 했는지도 같이 적어봤습니다.",
//     commentCount: 26,
//     viewCount: 1542,
//   },
//   {
//     id: 4,
//     type: "pick",
//     title: "Next.js 포트폴리오 만들 때 꼭 넣으면 좋은 것들",
//     content:
//       "프로젝트 개수보다 핵심 기능 설명이 더 중요하더라고요. 실제로 면접에서 질문 많이 받았던 포인트들 정리해봤어요.",
//     commentCount: 9,
//     viewCount: 628,
//   },
//   {
//     id: 5,
//     type: "pick",
//     title: "아침 8시 온라인 모각공 같이 하실 분 있을까요?",
//     content:
//       "줌 켜두고 2시간씩 각자 공부하는 방식입니다. 혼자 하면 흐트러져서 같이 루틴 잡으실 분 있으면 좋겠어요.",
//     commentCount: 14,
//     viewCount: 505,
//   },
//   {
//     id: 6,
//     type: "popular",
//     title: "오늘 공부 6시간 했는데도 왜 이렇게 불안할까요",
//     content:
//       "분명 열심히 했는데도 계속 부족한 것 같고 뒤처지는 느낌이 듭니다. 다들 이런 날 어떻게 멘탈 관리하시나요?",
//     commentCount: 43,
//     viewCount: "9,999+",
//   },
//   {
//     id: 7,
//     type: "popular",
//     title: "비전공자도 백엔드 준비해도 괜찮을까요?",
//     content:
//       "Spring Boot 공부를 시작했는데 주변에서는 프론트가 더 낫다고 하네요. 실제로 준비해보신 분들 현실적인 조언 부탁드립니다.",
//     commentCount: 37,
//     viewCount: 2841,
//   },
//   {
//     id: 8,
//     type: "popular",
//     title: "첫 인턴 서류 합격률 올린 방법 5가지",
//     content:
//       "작년엔 거의 다 떨어졌는데 자소서 구조랑 프로젝트 설명 방식 바꾸고 나서 확실히 달라졌어요. 작은 팁들 정리해봤습니다.",
//     commentCount: 21,
//     viewCount: 1964,
//   },
//   {
//     id: 9,
//     type: "popular",
//     title: "면접 끝나고 집 오는 길이 제일 허무한 사람 있나요",
//     content:
//       "끝나고 나면 자꾸 아쉬운 답변만 생각나요. 다음 면접 준비도 해야 하는데 멘탈이 쉽게 안 돌아옵니다.",
//     commentCount: 28,
//     viewCount: 1327,
//   },
//   {
//     id: 10,
//     type: "popular",
//     title: "취준할 때 가장 도움됐던 사이트나 서비스 공유해봐요",
//     content:
//       "저는 일정 관리랑 계획 세우는 게 제일 어려웠는데, 다들 어떤 서비스나 자료를 많이 참고하는지 궁금합니다.",
//     commentCount: 31,
//     viewCount: 1748,
//   },
// ];

// function formatNumber(value: number | string) {
//   if (typeof value === "string") return value;
//   return value.toLocaleString("ko-KR");
// }

// function getPopularScore(post: RecommendPost) {
//   const numericViewCount =
//     typeof post.viewCount === "number" ? post.viewCount : 10000;
//   return numericViewCount + post.commentCount * 3;
// }

// function RecommendCard({
//   post,
//   activeTab,
//   wasDraggedRef,
// }: {
//   post: RecommendPost;
//   activeTab: TabType;
//   wasDraggedRef: React.MutableRefObject<boolean>;
// }) {
//   const isPick = activeTab === "pick";

//   const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
//     if (wasDraggedRef.current) {
//       e.preventDefault();
//       wasDraggedRef.current = false;
//     }
//   };

//   return (
//     <Link
//       href={`/community/${post.id}`}
//       draggable={false}
//       onClick={handleClick}
//       className="
//         flex h-[189px] w-[272px] flex-col
//         rounded-[22px] border border-[#dee5f5] bg-white
//         px-[24px] pt-[22px] pb-[22px]
//         transition-transform duration-300 ease-out
//       "
//     >
//       <span
//         className={`inline-flex h-[28px] w-fit items-center rounded-full px-[10px] text-[11px] font-bold leading-none text-white ${
//           isPick ? "bg-[#00D3AB]" : "bg-[#FF6363]"
//         }`}
//       >
//         {isPick ? "추천글" : "인기글"}
//       </span>

//       <h3 className="mt-[18px] overflow-hidden whitespace-nowrap text-ellipsis text-[16px] font-bold leading-[1.35] tracking-[-0.02em] text-[#2A2F45]">
//         {post.title}
//       </h3>

//       <p className="mt-[12px] min-h-[42px] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] text-[14px] leading-[1.5] tracking-[-0.02em] text-[#5A6178]">
//         {post.content}
//       </p>

//       <div className="mt-auto pt-[18px] text-[14px] leading-none text-[#8B93A8]">
//         <span>댓글 </span>
//         <span className="font-semibold text-[#707991]">
//           {formatNumber(post.commentCount)}
//         </span>
//         <span className="mx-[8px] text-[#CDD3DE]">|</span>
//         <span>조회 </span>
//         <span className="font-semibold text-[#707991]">
//           {formatNumber(post.viewCount)}
//         </span>
//       </div>
//     </Link>
//   );
// }

// export default function RecommendedPostsSection() {
//   const [activeTab, setActiveTab] = useState<TabType>("pick");
//   const [showLeftPeek, setShowLeftPeek] = useState(false);
//   const [showRightPeek, setShowRightPeek] = useState(true);

//   const scrollRef = useRef<HTMLDivElement>(null);

//   const isMouseDownRef = useRef(false);
//   const startXRef = useRef(0);
//   const startScrollLeftRef = useRef(0);
//   const isDraggingRef = useRef(false);
//   const wasDraggedRef = useRef(false);

//   const posts = useMemo(() => {
//     const filtered = mockPosts.filter((post) => post.type === activeTab);

//     if (activeTab === "popular") {
//       return [...filtered]
//         .sort((a, b) => getPopularScore(b) - getPopularScore(a))
//         .slice(0, MAX_VISIBLE_COUNT);
//     }

//     return filtered.slice(0, MAX_VISIBLE_COUNT);
//   }, [activeTab]);

//   const updatePeekState = () => {
//     const container = scrollRef.current;
//     if (!container) return;

//     const { scrollLeft, clientWidth, scrollWidth } = container;
//     const maxScrollLeft = scrollWidth - clientWidth;
//     const threshold = 8;

//     setShowLeftPeek(scrollLeft > threshold);
//     setShowRightPeek(scrollLeft < maxScrollLeft - threshold);
//   };

//   useEffect(() => {
//     const container = scrollRef.current;
//     if (!container) return;

//     updatePeekState();

//     const handleScroll = () => updatePeekState();
//     container.addEventListener("scroll", handleScroll, { passive: true });

//     const handleResize = () => updatePeekState();
//     window.addEventListener("resize", handleResize);

//     return () => {
//       container.removeEventListener("scroll", handleScroll);
//       window.removeEventListener("resize", handleResize);
//     };
//   }, [activeTab, posts.length]);

//   useEffect(() => {
//     const handleWindowMouseMove = (e: MouseEvent) => {
//       const container = scrollRef.current;
//       if (!container || !isMouseDownRef.current) return;

//       const diff = e.clientX - startXRef.current;

//       if (!isDraggingRef.current && Math.abs(diff) >= DRAG_THRESHOLD) {
//         isDraggingRef.current = true;
//         wasDraggedRef.current = true;
//       }

//       if (isDraggingRef.current) {
//         container.scrollLeft = startScrollLeftRef.current - diff;
//       }
//     };

//     const handleWindowMouseUp = () => {
//       isMouseDownRef.current = false;

//       if (isDraggingRef.current) {
//         requestAnimationFrame(() => {
//           isDraggingRef.current = false;
//         });
//       }
//     };

//     window.addEventListener("mousemove", handleWindowMouseMove);
//     window.addEventListener("mouseup", handleWindowMouseUp);

//     return () => {
//       window.removeEventListener("mousemove", handleWindowMouseMove);
//       window.removeEventListener("mouseup", handleWindowMouseUp);
//     };
//   }, []);

//   const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
//     const container = scrollRef.current;
//     if (!container) return;

//     isMouseDownRef.current = true;
//     isDraggingRef.current = false;
//     wasDraggedRef.current = false;
//     startXRef.current = e.clientX;
//     startScrollLeftRef.current = container.scrollLeft;
//   };

//   const handleTabChange = (tab: TabType) => {
//     setActiveTab(tab);

//     requestAnimationFrame(() => {
//       scrollRef.current?.scrollTo({
//         left: 0,
//         behavior: "smooth",
//       });
//     });
//   };

//   return (
//     <section className="w-full">
//       <div className="flex items-center justify-between">
//         <h2 className="pl-2 text-[22px] font-bold leading-[1.4] tracking-[-0.03em] text-[#1F2D4A]">
//           이런 글은 어때요?
//         </h2>

//         <div className="flex items-center rounded-full bg-[#F5F7FB] p-[4px]">
//           <button
//             type="button"
//             onClick={() => handleTabChange("pick")}
//             className={`rounded-full px-[18px] py-[4px] text-[12px] font-bold leading-[24px] transition-all duration-300 ${
//               activeTab === "pick"
//                 ? "bg-[#4B5675] text-white"
//                 : "bg-transparent text-[#4B5675]"
//             }`}
//           >
//             추천글
//           </button>

//           <button
//             type="button"
//             onClick={() => handleTabChange("popular")}
//             className={`rounded-full px-[18px] py-[4px] text-[12px] font-bold leading-[24px] transition-all duration-300 ${
//               activeTab === "popular"
//                 ? "bg-[#4B5675] text-white"
//                 : "bg-transparent text-[#4B5675]"
//             }`}
//           >
//             인기글
//           </button>
//         </div>
//       </div>

//       <div className="mt-[22px] rounded-[28px] bg-[#F5F7FB] px-[22px] py-[20px]">
//         <div className="relative">
//           <div
//             ref={scrollRef}
//             onMouseDown={handleMouseDown}
//             className="scrollbar-hide overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing"
//             style={{
//               WebkitOverflowScrolling: "touch",
//               userSelect: "none",
//               overscrollBehaviorX: "contain",
//               scrollSnapType: "x mandatory",
//               scrollBehavior: "smooth",
//               paddingLeft: `${PEEK}px`,
//               paddingRight: `${PEEK}px`,
//             }}
//           >
//             <div
//               className="flex w-max"
//               style={{
//                 gap: `${CARD_GAP}px`,
//               }}
//             >
//               {posts.map((post) => (
//                 <div
//                   key={post.id}
//                   className="shrink-0 transition-transform duration-300 ease-out"
//                   style={{
//                     width: `${CARD_WIDTH}px`,
//                     height: `${CARD_HEIGHT + 3}px`,
//                     scrollSnapAlign: "start",
//                   }}
//                 >
//                   <RecommendCard
//                     post={post}
//                     activeTab={activeTab}
//                     wasDraggedRef={wasDraggedRef}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div
//             className={`pointer-events-none absolute left-0 top-0 h-full w-[64px] transition-opacity duration-300 ${
//               showLeftPeek ? "opacity-100" : "opacity-0"
//             }`}
//           />
//           <div
//             className={`pointer-events-none absolute right-0 top-0 h-full w-[64px] transition-opacity duration-300 ${
//               showRightPeek ? "opacity-100" : "opacity-0"
//             }`}
//           />
//         </div>
//       </div>
//     </section>
//   );
// }