import Link from "next/link";
import { CalendarCheck, ChevronRight, MessageSquareText } from "lucide-react";

type CertificateReview = {
  id: number;
  certificateName: string;
  title: string;
  passedAt: string;
  category: string;
  accent: string;
};

const REVIEWS: CertificateReview[] = [
  {
    id: 1,
    certificateName: "정보처리기사",
    title: "비전공자 기준 필기 3주 합격 후기와 실기 준비 순서",
    passedAt: "2026.04.19",
    category: "IT/개발",
    accent: "#4876EF",
  },
  {
    id: 2,
    certificateName: "컴퓨터활용능력 1급",
    title: "엑셀 함수와 액세스 실기에서 시간을 줄였던 풀이 루틴",
    passedAt: "2026.03.16",
    category: "사무/ OA",
    accent: "#14B8A6",
  },
  {
    id: 3,
    certificateName: "SQLD",
    title: "기출 반복으로 개념을 잡은 SQLD 합격 후기와 데이터 직무 활용법",
    passedAt: "2026.02.23",
    category: "데이터",
    accent: "#7C3AED",
  },
  {
    id: 4,
    certificateName: "한국사능력검정시험",
    title: "심화 1급 합격자가 정리한 회독 방식과 시험 전날 체크리스트",
    passedAt: "2026.01.27",
    category: "교양/공통",
    accent: "#F59E0B",
  },
  {
    id: 5,
    certificateName: "전기기사",
    title: "직장 병행으로 준비한 전기기사 필기 공부량과 과목별 우선순위",
    passedAt: "2025.12.08",
    category: "전기/설비",
    accent: "#0EA5E9",
  },
  {
    id: 6,
    certificateName: "빅데이터분석기사",
    title: "통계 개념이 약해도 따라간 빅분기 실기 준비 방법",
    passedAt: "2025.11.24",
    category: "데이터",
    accent: "#8B5CF6",
  },
];

function ReviewCard({ review }: { review: CertificateReview }) {
  return (
    <article>
      <div className="mb-3">
        <p className="text-[15px] font-semibold tracking-tight text-[#333333]">
          {review.certificateName}
        </p>
      </div>

      <div className="relative rounded-[9px] border border-[#EBEBEB] bg-white px-7 py-7 transition-colors duration-150 hover:border-[#D0D7E3]">
        <span className="block h-8 text-[54px] font-black leading-none text-[#E0E5EB]">
          “
        </span>

        <h3 className="mt-4 line-clamp-2 min-h-15 text-[20px] font-semibold leading-[1.5] tracking-tight text-[#333333]">
          {review.title}
        </h3>

        <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-medium text-[#94A3B8]">
          <span>{review.category}</span>
          <span>·</span>
          <span>합격일</span>
          <span>{review.passedAt}</span>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-2">
          <Link
            href={`/community?keyword=${encodeURIComponent(review.certificateName)}`}
            className="flex h-12 items-center justify-center gap-1.5 rounded-[8px] bg-[#F8F9FA] px-3 text-center text-[14px] font-semibold text-[#575757] transition-colors hover:bg-[#EEF4FF] hover:text-[#4876EF]"
          >
            <MessageSquareText className="h-4 w-4 text-[#94A3B8]" />
            합격후기 보러가기
          </Link>
          <Link
            href={`/certificate/search?keyword=${encodeURIComponent(review.certificateName)}`}
            className="flex h-12 items-center justify-center gap-1.5 rounded-[8px] bg-[#F8F9FA] px-3 text-center text-[14px] font-semibold text-[#575757] transition-colors hover:bg-[#EEF4FF] hover:text-[#4876EF]"
          >
            <CalendarCheck className="h-4 w-4 text-[#94A3B8]" />
            올해 시험 일정 확인
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function DashboardCertificateReviewSection() {
  return (
    <section className="mt-16">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[16px] font-medium tracking-tight text-[#94A3B8]">
            합격자가 직접 말하는
          </p>
          <h2 className="mt-1 text-[22px] font-semibold tracking-tight text-[#333333]">
            &quot;자격증 후기와 활용 방법&quot;
          </h2>
        </div>

        <Link
          href="/community"
          className="flex items-center gap-0.5 pb-1 text-[16px] font-medium text-[#94A3B8] transition-colors hover:text-[#4876EF]"
        >
          더보기
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-7 lg:grid-cols-2">
        {REVIEWS.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
