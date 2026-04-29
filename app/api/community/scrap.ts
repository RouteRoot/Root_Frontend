import {axiosInstance} from "../axios/axiosInstance";
import type { Post } from "./types";

// 스크랩 토글
export const toggleScrap = async (postId: number): Promise<string> => {
  const response = await axiosInstance.post("/scraps", null, {
    params: { postId },
  });
  return response.data;
};

export const scrapPost = toggleScrap;

// 스크랩 수 조회
export const getScrapCount = async (postId: number): Promise<number> => {
  const response = await axiosInstance.get("/scraps/count", {
    params: { postId },
  });
  return response.data;
};

// 스크랩 여부 확인
export const checkScrapped = async (postId: number): Promise<boolean> => {
  const response = await axiosInstance.get("/scraps/check", {
    params: { postId },
  });
  return response.data;
};

// 내 스크랩 목록 조회
export const getMyScraps = async (): Promise<Post[]> => {
  const response = await axiosInstance.get("/scraps");
  return response.data;
};
