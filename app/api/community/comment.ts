import {axiosInstance} from "../axios/axiosInstance";

import type { Comment, CreateCommentRequest, UpdateCommentRequest } from "./types";

// 댓글 작성
export const createComment = async (data: CreateCommentRequest): Promise<Comment> => {
  const response = await axiosInstance.post("/comments", data);
  return response.data;
};

// 댓글 목록 조회
export const getComments = async (postId: number): Promise<Comment[]> => {
  const response = await axiosInstance.get("/comments", {
    params: { postId },
  });
  return response.data;
};

// 댓글 수정
export const updateComment = async (
  commentId: number,
  data: UpdateCommentRequest
): Promise<Comment> => {
  const response = await axiosInstance.put(`/comments/${commentId}`, data);
  return response.data;
};

// 댓글 삭제
export const deleteComment = async (commentId: number): Promise<string> => {
  const response = await axiosInstance.delete(`/comments/${commentId}`);
  return response.data;
};