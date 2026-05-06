export type ArchiveBoardType =
  | "RECOMMAND"
  | "CERT_ANALYSIS"
  | "JOB_ANALYSIS"
  | "EXAM_INFO"
  | "STUDY_METHOD"
  | "PASS_STRATEGY"
  | "JOB_STRATEGY"
  | "EXPERT_INSIGHT";

export type ArchiveSort = "latest" | "popular";

export interface ArchivePost {
  postId: number;
  title: string;
  content: string;
  author: string;
  boardType: ArchiveBoardType;
  category: string;
  studyStatus: null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

export interface ArchivePostPage {
  content: ArchivePost[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ArchivePostRequest {
  title: string;
  content: string;
  boardType: ArchiveBoardType;
  category: string;
}

export type ArchivePostUpdateRequest = ArchivePostRequest;
