export type CommunityPost = {
  id: string;
  title: string;
  category: string;
  author: string;
  content: string;
  preview: string;
  createdAt: string;
  likes: number;
  comments: number;
  views: number;
  tags: string[];
};

export const communityPosts: CommunityPost[] = [
  {
    id: "1",
    title: "SQLD 한 달 안에 합격한 공부 루틴 공유",
    category: "합격후기",
    author: "민서",
    content:
      "SQLD를 준비하면서 데이터 모델링, 기본 SQL, 활용 SQL을 4주로 나눠서 공부했어요. 1주차는 개념 정리, 2주차는 SELECT/WHERE/GROUP BY, 3주차는 JOIN과 서브쿼리, 4주차는 기출 위주로 돌렸습니다. 오답노트를 따로 만들었던 게 가장 도움이 됐어요.",
    preview:
      "4주로 나눠서 개념 → 기본 SQL → 활용 SQL → 기출 순으로 공부했어요.",
    createdAt: "2026.03.18",
    likes: 24,
    comments: 8,
    views: 312,
    tags: ["SQLD", "데이터베이스", "합격후기"],
  },
  {
    id: "2",
    title: "정보처리기사 필기 과목별 공부 순서 추천",
    category: "질문",
    author: "root_user",
    content:
      "정보처리기사 필기를 준비하려고 하는데 소프트웨어 설계부터 보는 게 좋을지, 데이터베이스부터 보는 게 좋을지 고민입니다. 비전공자 기준으로 추천해주실 분 있나요?",
    preview:
      "비전공자 기준으로 정보처리기사 필기 과목 공부 순서 추천 부탁드립니다.",
    createdAt: "2026.03.17",
    likes: 11,
    comments: 15,
    views: 198,
    tags: ["정보처리기사", "필기", "질문"],
  },
  {
    id: "3",
    title: "ADsP 통계 파트 너무 어려운데 어떻게 공부했어요?",
    category: "자유",
    author: "data_beginner",
    content:
      "ADsP 공부 중인데 통계 부분에서 막히네요. 평균, 분산은 괜찮은데 회귀나 가설검정 쪽이 어렵습니다. 다들 어떻게 공부했는지 궁금합니다.",
    preview: "통계 파트 특히 회귀, 가설검정 부분 공부법이 궁금해요.",
    createdAt: "2026.03.16",
    likes: 9,
    comments: 21,
    views: 155,
    tags: ["ADsP", "통계", "공부법"],
  },
  {
    id: "4",
    title: "컴활 1급 실기 독학 가능한가요?",
    category: "질문",
    author: "office_starter",
    content:
      "컴활 1급 실기를 독학으로 준비할 수 있을지 고민입니다. 함수, 매크로, 액세스까지 범위가 넓어서 어디부터 시작해야 할지 모르겠어요.",
    preview: "컴활 1급 실기 독학 루트나 강의 추천 부탁드려요.",
    createdAt: "2026.03.15",
    likes: 7,
    comments: 12,
    views: 144,
    tags: ["컴활1급", "실기", "독학"],
  },
];
