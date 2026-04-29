import Link from "next/link";
import { Heart, MessageCircle, ChevronRight } from "lucide-react";

type CommunityPost = {
  id: number;
  category: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
};

const MOCK_POSTS: CommunityPost[] = [
  {
    id: 1,
    category: "질문/고민",
    title: "컴활 1급 먼저 할까요, SQLD 먼저 할까요?",
    content:
      "취업 준비 시작한 4학년입니다. 방학 동안 자격증 하나는 꼭 따고 싶은데 컴활 1급이 나을지 SQLD가 나을지 고민입니다.",
    author: "루트새싹",
    createdAt: "2026-07-08",
    likeCount: 4,
    commentCount: 7,
    viewCount: 128,
  },
  {
    id: 3,
    category: "자격증 후기",
    title: "정보처리기사 필기 3주 합격 후기 남겨요",
    content:
      "비전공자 기준으로 3주 동안 공부해서 필기 합격했습니다. CBT 기출 반복, 마지막 주는 틀린 문제만 모아서 봤어요.",
    author: "합격한감자",
    createdAt: "2026-07-07",
    likeCount: 21,
    commentCount: 15,
    viewCount: 603,
  },
  {
    id: 5,
    category: "정보공유",
    title: "2026 하반기 공채 일정 정리해봤어요",
    content:
      "IT/개발 직무 기준으로 주요 기업 하반기 공채 일정을 표로 정리해봤습니다. 서류 시작 시점, 코테 여부까지 같이 적어뒀어요.",
    author: "캘린더장인",
    createdAt: "2026-07-06",
    likeCount: 18,
    commentCount: 5,
    viewCount: 421,
  },
  {
    id: 8,
    category: "자격증 후기",
    title: "첫 인턴 서류 합격률 올린 방법 5가지",
    content:
      "작년에는 서류를 거의 다 떨어졌는데, 자소서 구조와 경험 정리 방식을 바꾼 뒤로 합격률이 꽤 올라갔어요.",
    author: "서류통과자",
    createdAt: "2026-07-05",
    likeCount: 25,
    commentCount: 8,
    viewCount: 514,
  },
];


function PostCard({ post }: { post: CommunityPost }) {
  return (
    <Link href={`/community/${post.id}`} className="group block h-full">
      <article className="flex h-full flex-col rounded-[9px] border border-[#EBEBEB] bg-white px-5 py-5 transition-colors duration-150 hover:border-[#D0D7E3]">

        {/* 본문 영역 */}
        <div className="flex-1">
          <p className="line-clamp-2 text-[16px] font-semibold leading-[1.55] tracking-tight text-[#575757]">
            {post.title}
          </p>
          <p className="mt-2 line-clamp-3 text-[16px] leading-[1.65] text-[#777777]">
            {post.content}
          </p>
        </div>

        {/* 하단 통계 */}
        <div className="mt-5 flex items-center text-[12px] text-[#999999]">
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            {post.likeCount}
          </span>
          <span className="mx-2 text-[#DDDDDD]">|</span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5" />
            {post.commentCount}
          </span>
          <span className="ml-auto">조회 {post.viewCount.toLocaleString()}</span>
        </div>
      </article>
    </Link>
  );
}

export default function DashboardCommunitySection() {
  return (
    <section className="mt-8">
      {/* 헤더 */}
      <div className="mb-5 flex items-center justify-between">
        <p className="text-[22px] font-semibold font-black tracking-tight text-[#333333]">
          커뮤니티 인기글
        </p>
        <Link
          href="/community"
          className="flex items-center gap-0.5 text-[16px] font-medium text-[#94A3B8] transition-colors hover:text-[#4876EF]"
        >
          더보기
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* 4열 카드 그리드 */}
      <div className="grid grid-cols-4 gap-4">
        {MOCK_POSTS.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
