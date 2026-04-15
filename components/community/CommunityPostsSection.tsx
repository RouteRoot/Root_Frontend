"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type CommunityCategory =
  | "전체"
  | "자유"
  | "스터디 모집"
  | "자격증 후기"
  | "질문/고민"
  | "정보공유";

type SortType = "최신순" | "인기순";

type CommunityPost = {
  id: number;
  category: Exclude<CommunityCategory, "전체">;
  title: string;
  content: string;
  author: string;
  profileImage: string;
  badge?: string;
  createdAt: string; // yyyy-mm-dd
  likeCount: number;
  commentCount: number;
  viewCount: number;
};

const CATEGORY_TABS: CommunityCategory[] = [
  "전체",
  "자유",
  "스터디 모집",
  "자격증 후기",
  "질문/고민",
  "정보공유",
];

const SORT_OPTIONS: SortType[] = ["최신순", "인기순"];

const MOCK_POSTS: CommunityPost[] = [
  {
    id: 1,
    category: "질문/고민",
    title: "컴활 1급 먼저 할까요, SQLD 먼저 할까요?",
    content:
      "취업 준비 시작한 4학년입니다. 방학 동안 자격증 하나는 꼭 따고 싶은데 컴활 1급이 나을지 SQLD가 나을지 고민입니다. 개발 직무 생각 중인데 우선순위 어떻게 두셨는지 궁금해요.",
    author: "루트새싹",
    profileImage: "/bubu11.png",
    badge: "자격증",
    createdAt: "2026-07-08",
    likeCount: 4,
    commentCount: 7,
    viewCount: 128,
  },
  {
    id: 2,
    category: "스터디 모집",
    title: "한성대 근처 SQLD 스터디 모집합니다",
    content:
      "주 2회 오프라인으로 SQLD 기출 풀이와 개념 정리 같이 하실 분 구해요. 장소는 학교 근처 카페 예정이고, 7월 말 시험 목표로 진행하려고 합니다. 초보도 괜찮아요.",
    author: "데이터뿌리",
    profileImage: "/bubu11.png",
    badge: "스터디",
    createdAt: "2026-07-08",
    likeCount: 9,
    commentCount: 12,
    viewCount: 244,
  },
  {
    id: 3,
    category: "자격증 후기",
    title: "정보처리기사 필기 3주 합격 후기 남겨요",
    content:
      "비전공자 기준으로 3주 동안 공부해서 필기 합격했습니다. 처음 1주는 이론 전체 흐름 잡고, 2주차부터는 CBT 기출 반복, 마지막 주는 틀린 문제만 모아서 봤어요. 과목별로 시간 배분한 방법도 적어볼게요.",
    author: "합격한감자",
    profileImage: "/bubu11.png",
    badge: "후기",
    createdAt: "2026-07-07",
    likeCount: 21,
    commentCount: 15,
    viewCount: 603,
  },
  {
    id: 4,
    category: "자유",
    title: "다들 방학 루틴 어떻게 지키고 있어요?",
    content:
      "계획은 엄청 세우는데 며칠 지나면 자꾸 흐트러지네요. 아침형으로 바꾸고 싶은데 쉽지 않아요. 뿌리 쓰는 분들은 하루 공부 루틴 어떻게 잡고 있는지 궁금합니다.",
    author: "민트모카",
    profileImage: "/bubu11.png",
    createdAt: "2026-07-07",
    likeCount: 6,
    commentCount: 11,
    viewCount: 187,
  },
  {
    id: 5,
    category: "정보공유",
    title: "2026 하반기 공채 일정 정리해봤어요",
    content:
      "IT/개발 직무 기준으로 주요 기업 하반기 공채 일정을 표로 정리해봤습니다. 서류 시작 시점, 코테 여부, 자소서 문항 개수까지 같이 적어뒀어요. 준비하시는 분들 참고하시면 좋을 것 같아요.",
    author: "캘린더장인",
    profileImage: "/bubu11.png",
    badge: "일정",
    createdAt: "2026-07-06",
    likeCount: 18,
    commentCount: 5,
    viewCount: 421,
  },
  {
    id: 6,
    category: "질문/고민",
    title: "포트폴리오에 클론코딩 프로젝트 넣어도 될까요?",
    content:
      "기능은 직접 구현했는데 디자인이나 기획은 원본 서비스를 참고한 상태입니다. 이런 프로젝트를 포트폴리오에 넣어도 괜찮은지, 넣는다면 어떤 식으로 설명해야 덜 마이너스일지 고민입니다.",
    author: "프론트꿈나무",
    profileImage: "/bubu11.png",
    badge: "포폴",
    createdAt: "2026-07-06",
    likeCount: 5,
    commentCount: 9,
    viewCount: 212,
  },
  {
    id: 7,
    category: "스터디 모집",
    title: "React 프로젝트 스터디 팀원 구합니다",
    content:
      "Next.js 기반으로 작은 프로젝트 같이 만들 분 구해요. 매주 진행 상황 공유하고, 단순 강의 듣기보다 실제로 배포까지 해보는 목표입니다. 프론트엔드 취준생이면 같이 성장하기 좋을 것 같아요.",
    author: "리액트새싹",
    profileImage: "/bubu11.png",
    badge: "프로젝트",
    createdAt: "2026-07-05",
    likeCount: 14,
    commentCount: 17,
    viewCount: 336,
  },
  {
    id: 8,
    category: "자격증 후기",
    title: "첫 인턴 서류 합격률 올린 방법 5가지",
    content:
      "작년에는 서류를 거의 다 떨어졌는데, 올해는 자소서 구조를 바꾸고 프로젝트 경험을 정리하는 방식 바꾼 뒤로 합격률이 꽤 올라갔어요. 특히 경험을 숫자로 바꿔 쓰는 게 효과 컸습니다.",
    author: "서류통과자",
    profileImage: "/bubu11.png",
    badge: "자소서",
    createdAt: "2026-07-05",
    likeCount: 25,
    commentCount: 8,
    viewCount: 514,
  },
  {
    id: 9,
    category: "자유",
    title: "오늘 공부 6시간 했는데도 왜 불안할까요",
    content:
      "분명 어제보다 많이 했는데도 계속 내가 늦은 것 같고 부족한 것 같아요. 주변이 다 잘하는 것처럼 느껴져서 괜히 마음이 조급해집니다. 비슷한 마음 들 때 다들 어떻게 다잡나요?",
    author: "밤샘러",
    profileImage: "/bubu11.png",
    createdAt: "2026-07-04",
    likeCount: 12,
    commentCount: 19,
    viewCount: 291,
  },
  {
    id: 10,
    category: "정보공유",
    title: "코테 준비 사이트 장단점 정리",
    content:
      "백준, 프로그래머스, 리트코드 각각 장단점 정리해봤어요. 단계별로 어디부터 시작하면 좋은지랑, 초반에 문제 고를 때 기준도 같이 적었습니다. 코테 입문하는 분들 참고하시면 도움 될 것 같아요.",
    author: "알고리즘메모",
    profileImage: "/bubu11.png",
    badge: "코테",
    createdAt: "2026-07-04",
    likeCount: 16,
    commentCount: 6,
    viewCount: 388,
  },
  {
    id: 11,
    category: "질문/고민",
    title: "비전공자도 백엔드 가능할까요?",
    content:
      "최근에 Spring Boot 공부를 시작했는데, 주변에서는 프론트가 더 낫지 않냐는 말도 많이 들어서 고민입니다. 비전공자 기준으로 백엔드 쪽 준비하신 분들 조언 듣고 싶어요.",
    author: "늦깎이개발러",
    profileImage: "/bubu11.png",
    badge: "진로",
    createdAt: "2026-07-03",
    likeCount: 8,
    commentCount: 13,
    viewCount: 267,
  },
  {
    id: 12,
    category: "자격증 후기",
    title: "컴활 1급 실기 한 번에 붙은 공부 순서 공유",
    content:
      "처음부터 기출만 돌리지 말고 기능 하나씩 익힌 뒤 문제형으로 넘어가는 게 훨씬 빨랐습니다. 특히 엑셀 함수 파트는 암기보다 직접 손으로 반복하는 게 중요했어요.",
    author: "엑셀왕",
    profileImage: "/bubu11.png",
    badge: "자격증",
    createdAt: "2026-07-03",
    likeCount: 19,
    commentCount: 4,
    viewCount: 347,
  },
  {
    id: 13,
    category: "스터디 모집",
    title: "매일 아침 8시 온라인 모각공 하실 분",
    content:
      "줌 켜두고 2시간씩 각자 공부하는 모각공입니다. 꾸준함이 목표라 분위기만 같이 잡아갈 분이면 좋아요. 출석 체크 있고, 너무 빡세진 않게 편하게 운영하려고 합니다.",
    author: "아침루틴",
    profileImage: "/bubu11.png",
    badge: "모각공",
    createdAt: "2026-07-02",
    likeCount: 11,
    commentCount: 10,
    viewCount: 223,
  },
  {
    id: 14,
    category: "자유",
    title: "면접 끝나고 집 오는 길이 제일 허무하네요",
    content:
      "준비한 답변은 다 했는데 돌아오는 길에 자꾸 아쉬운 말들만 생각나요. 다음 면접에서는 더 잘하고 싶은데, 끝나고 멘탈 관리 어떻게 해야 하는지 궁금합니다.",
    author: "집가는길",
    profileImage: "/bubu11.png",
    createdAt: "2026-07-02",
    likeCount: 7,
    commentCount: 6,
    viewCount: 154,
  },
  {
    id: 15,
    category: "정보공유",
    title: "신입 개발자 포트폴리오에서 자주 보이는 실수",
    content:
      "프로젝트 수가 많다고 무조건 좋은 게 아니라, 핵심 구현과 본인 기여도가 더 잘 보여야 하더라고요. 최근 여러 포트폴리오 보면서 공통적으로 아쉬웠던 부분들 정리해봤습니다.",
    author: "포폴리뷰어",
    profileImage: "/bubu11.png",
    badge: "포폴",
    createdAt: "2026-07-01",
    likeCount: 23,
    commentCount: 9,
    viewCount: 472,
  },
  {
    id: 16,
    category: "자격증 후기",
    title: "중소기업 첫 취업 후 느낀 점 솔직 후기",
    content:
      "처음 취업하고 나면 무조건 대기업만 생각했을 때와 다르게 배울 수 있는 점도 많았습니다. 물론 아쉬운 점도 있었고요. 첫 회사 고를 때 제가 놓쳤던 기준들을 공유합니다.",
    author: "첫회사후기",
    profileImage: "/bubu11.png",
    badge: "취업",
    createdAt: "2026-06-30",
    likeCount: 17,
    commentCount: 12,
    viewCount: 395,
  },
];

function formatDateToDot(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();

  return `${y}.${m}.${d}`;
}

function formatNumber(value: number) {
  return value.toLocaleString("ko-KR");
}

function getPopularScore(post: CommunityPost) {
  return post.likeCount * 3 + post.commentCount * 5 + post.viewCount;
}

function CommunityPostCard({ post }: { post: CommunityPost }) {
  return (
    <Link href={`/community/${post.id}`} className="block">
      <article
        className="
          min-h-[170px] rounded-[22px] border border-[#E3E8F2] bg-white
          px-8 py-7 transition-colors duration-200 hover:border-[#D5DCEC]
        "
      >
        <div className="flex h-full flex-col justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {/* {post.badge && (
                <span className="inline-flex h-[22px] items-center rounded-full bg-[#EEF2FF] px-[10px] text-[11px] font-semibold text-[#4F46E5]">
                  {post.badge}
                </span>
              )} */}
            </div>

            <h3 className="mt-[6px] line-clamp-1 text-[17px] font-bold leading-[1.35] tracking-[-0.02em] text-[#292E41]">
              {post.title}
            </h3>

            <p className="mt-[10px] line-clamp-2 text-[15px] leading-[1.6] tracking-[-0.02em] text-[#475067]">
              {post.content}
            </p>
          </div>

          <div className="mt-5 flex items-end justify-between gap-4">
            <div className="flex min-w-0 items-center gap-[8px]">
              <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-[#EEF2FF]">
                <Image
                  src={post.profileImage}
                  alt={post.author}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 mt-1 flex flex-wrap items-center text-[13px] leading-none tracking-[-0.01em]">
                <span className="font-bold text-[#292E41]">{post.author}</span>
                <span className="mx-[6px] text-[#B8C2D1]">·</span>
                <span className="text-[#6B768B]">
                  {formatDateToDot(post.createdAt)}
                </span>
              </div>
            </div>

            <div className="shrink-0 text-[12px] leading-none text-[#6B768B]">
              <span>좋아요 {formatNumber(post.likeCount)}</span>
              <span className="mx-[6px] text-[#B8C2D1]">|</span>
              <span>댓글 {formatNumber(post.commentCount)}</span>
              <span className="mx-[6px] text-[#B8C2D1]">|</span>
              <span>조회 {formatNumber(post.viewCount)}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function CommunityPostsSection() {
  const [selectedCategory, setSelectedCategory] =
    useState<CommunityCategory>("전체");
  const [selectedSort, setSelectedSort] = useState<SortType>("최신순");
  const [visibleCount, setVisibleCount] = useState(6);
  const [sortOpen, setSortOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredPosts = useMemo(() => {
    const categoryFiltered =
      selectedCategory === "전체"
        ? MOCK_POSTS
        : MOCK_POSTS.filter((post) => post.category === selectedCategory);

    const sorted = [...categoryFiltered].sort((a, b) => {
      if (selectedSort === "인기순") {
        return getPopularScore(b) - getPopularScore(a);
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return sorted;
  }, [selectedCategory, selectedSort]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[1280px] pb-20 px-3">
        <h2 className="text-[22px] font-bold leading-none tracking-[-0.03em] text-[#1F2D4A]">
          게시글
        </h2>

        <div className="mt-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {CATEGORY_TABS.map((tab) => {
              const active = selectedCategory === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(tab);
                    setVisibleCount(6);
                  }}
                  className={`
                    rounded-full border bg-white px-[16px] py-[13px]
                    text-[15px] leading-none transition-all duration-200
                    ${
                      active
                        ? "border-[#AEBBD1] font-bold text-[#27344D]"
                        : "border-[#D8E0EC] font-medium text-[#5F6D86] hover:border-[#CBD5E3]"
                    }
                  `}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div ref={dropdownRef} className="relative self-start xl:self-auto">
            <button
              type="button"
              onClick={() => setSortOpen((prev) => !prev)}
              className="
                flex min-w-[50px] items-center justify-between gap-3
                rounded-full font-bold
                text-[13px] font-medium leading-none text-[#27344D]
                transition-colors duration-200 hover:border-[#CBD5E3]
              "
            >
              <span className="font-bold">{selectedSort}</span>
              <ChevronDown
                size={17}
                className={`text-[#8A97AC] transition-transform duration-200 ${
                  sortOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {sortOpen && (
              <div
                className="
                  absolute right-0 top-[calc(100%+10px)] z-20 min-w-[138px]
                  overflow-hidden rounded-[16px] border border-[#E2E8F1] bg-white
                  py-2 shadow-[0_16px_40px_rgba(31,45,74,0.10)]
                "
              >
                {SORT_OPTIONS.map((option) => {
                  const active = selectedSort === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSelectedSort(option);
                        setSortOpen(false);
                        setVisibleCount(6);
                      }}
                      className={`
                        block w-full px-4 py-3 text-left text-[14px]
                        transition-colors duration-150
                        ${
                          active
                            ? "bg-[#F5F8FC] font-semibold text-[#27344D]"
                            : "text-[#5E6B83] hover:bg-[#F8FAFD]"
                        }
                      `}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-[12px]">
          {visiblePosts.map((post) => (
            <CommunityPostCard key={post.id} post={post} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="mt-8 rounded-[22px] border border-[#E3E8F2] bg-white py-16 text-center">
            <p className="text-[15px] text-[#6B768B]">아직 게시글이 없어요.</p>
          </div>
        )}

        {hasMore && (
          <div className="relative mt-10 flex items-center justify-center">
            <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#D7E0EC]" />
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="
                relative z-10 flex items-center gap-2 rounded-full
                border border-[#D8E0EC] bg-white px-10 py-[15px]
                text-[15px] font-medium text-[#36435E]
                transition-colors duration-200 hover:border-[#C7D2E3]
              "
            >
              게시글 더보기
              <ChevronDown size={17} className="text-[#7F8BA0]" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}