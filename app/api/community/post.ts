import {axiosInstance} from "../axios/axiosInstance";

import type { Post, CreatePostRequest, UpdatePostRequest, BoardType, StudyStatus } from "./types";

// 게시글 작성
export const createPost = async (data: CreatePostRequest): Promise<Post> => {
  const response = await axiosInstance.post("/posts", data);
  return response.data;
};

// 게시글 목록 조회 (예: FREE)
export const getPosts = async (boardType: BoardType): Promise<Post[]> => {
  const response = await axiosInstance.get("/posts", {
    params: { boardType },
  });
  return response.data;
};

// 스터디 게시글 조회
export const getStudyPosts = async (status: Exclude<StudyStatus, null>): Promise<Post[]> => {
  const response = await axiosInstance.get("/posts/study", {
    params: { status },
  });
  return response.data;
};

// 게시글 상세 조회
export const getPostDetail = async (postId: number): Promise<Post> => {
  const response = await axiosInstance.get(`/posts/${postId}`);
  return response.data;
};

// 게시글 수정
export const updatePost = async (postId: number, data: UpdatePostRequest): Promise<Post> => {
  const response = await axiosInstance.put(`/posts/${postId}`, data);
  return response.data;
};

// 게시글 삭제
export const deletePost = async (postId: number): Promise<string> => {
  const response = await axiosInstance.delete(`/posts/${postId}`);
  return response.data;
};