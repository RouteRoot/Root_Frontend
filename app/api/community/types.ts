export type BoardType = "FREE" | "STUDY";

export type StudyStatus = "RECRUITING" | "CLOSED" | null;

export type PostSort = "latest" | "popular" | string;

export interface Post {
  postId: number;
  author: string;
  title: string;
  content: string;
  boardType: BoardType;
  category: string;
  studyStatus: StudyStatus;
  createdAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  boardType: BoardType;
  category: string;
  studyStatus: StudyStatus;
}

export interface UpdatePostRequest {
  title: string;
  content: string;
  boardType: BoardType;
  category: string;
  studyStatus: StudyStatus;
}

export interface PostPage {
  content: Post[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface Comment {
  commentId: number;
  author: string;
  content: string;
  createdAt: string;
  postId: number;
}

export interface CreateCommentRequest {
  content: string;
  postId: number;
}

export interface UpdateCommentRequest {
  content: string;
  postId: number;
}
