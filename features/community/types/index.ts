export type BoardType = "FREE" | "STUDY";

export type StudyStatus = "RECRUITING" | "CLOSED" | null;

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
}

export interface CreatePostRequest {
  title: string;
  content: string;
  userId: number;
  boardType: BoardType;
  category: string;
  studyStatus: StudyStatus;
}

export interface UpdatePostRequest {
  title: string;
  content: string;
  userId: number;
  boardType: BoardType;
  category: string;
  studyStatus: StudyStatus;
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
  userId: number;
  postId: number;
}

export interface UpdateCommentRequest {
  content: string;
  userId: number;
  postId: number;
}