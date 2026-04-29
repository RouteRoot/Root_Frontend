import {axiosInstance} from "../axios/axiosInstance";

import type {
  BoardType,
  CreatePostRequest,
  Post,
  PostPage,
  PostSort,
  StudyStatus,
  UpdatePostRequest,
} from "./types";

type GetPostsParams = {
  boardType?: BoardType;
  sort?: PostSort;
  page?: number;
  size?: number;
};

function toPostFormData(data: CreatePostRequest | UpdatePostRequest) {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("content", data.content);
  formData.append("boardType", data.boardType);
  formData.append("category", data.category);

  if (data.studyStatus) {
    formData.append("studyStatus", data.studyStatus);
  }

  return formData;
}

// 게시글 작성
export const createPost = async (data: CreatePostRequest): Promise<Post> => {
  const response = await axiosInstance.post("/posts", toPostFormData(data));
  return response.data;
};

// 게시글 목록 조회
export const getPosts = async ({
  boardType,
  sort = "latest",
  page = 0,
  size = 6,
}: GetPostsParams = {}): Promise<PostPage> => {
  const response = await axiosInstance.get("/posts", {
    params: { boardType, sort, page, size },
  });
  return response.data;
};

// 스터디 게시글 조회
export const getStudyPosts = async (
  status: Exclude<StudyStatus, null>,
  sort: PostSort = "latest"
): Promise<Post[]> => {
  const response = await axiosInstance.get("/posts/study", {
    params: { status, sort },
  });
  return response.data;
};

// 인기 게시글 조회
export const getPopularPosts = async (limit = 5): Promise<Post[]> => {
  const response = await axiosInstance.get("/posts/popular", {
    params: { limit },
  });
  return response.data;
};

// 내가 작성한 게시글 조회
export const getMyPosts = async (): Promise<Post[]> => {
  const response = await axiosInstance.get("/posts/my");
  return response.data;
};

// 게시글 상세 조회
export const getPostDetail = async (postId: number): Promise<Post> => {
  const response = await axiosInstance.get(`/posts/${postId}`);
  return response.data;
};

// 게시글 수정
export const updatePost = async (postId: number, data: UpdatePostRequest): Promise<Post> => {
  const response = await axiosInstance.put(`/posts/${postId}`, toPostFormData(data));
  return response.data;
};

// 게시글 삭제
export const deletePost = async (postId: number): Promise<string> => {
  const response = await axiosInstance.delete(`/posts/${postId}`);
  return response.data;
};
