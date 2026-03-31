import {axiosInstance} from "../axios/axiosInstance";

// 스크랩 등록
export const scrapPost = async (userId: number, postId: number): Promise<string> => {
  const response = await axiosInstance.post("/scraps", null, {
    params: { userId, postId },
  });
  return response.data;
};

// 스크랩 수 조회
export const getScrapCount = async (postId: number): Promise<number> => {
  const response = await axiosInstance.get("/scraps/count", {
    params: { postId },
  });
  return response.data;
};

// 스크랩 여부 확인
export const checkScrapped = async (userId: number, postId: number): Promise<boolean> => {
  const response = await axiosInstance.get("/scraps/check", {
    params: { userId, postId },
  });
  return response.data;
};

// 내 스크랩 목록 조회
export const getMyScraps = async (userId: number): Promise<number[]> => {
  const response = await axiosInstance.get("/scraps", {
    params: { userId },
  });
  return response.data;
};