import {axiosInstance} from "../axios/axiosInstance";

// 좋아요 누르기
export const likePost = async (userId: number, postId: number): Promise<string> => {
  const response = await axiosInstance.post("/likes", null, {
    params: { userId, postId },
  });
  return response.data;
};

// 좋아요 수 조회
export const getLikeCount = async (postId: number): Promise<number> => {
  const response = await axiosInstance.get("/likes/count", {
    params: { postId },
  });
  return response.data;
};

// 좋아요 여부 확인
export const checkLiked = async (userId: number, postId: number): Promise<boolean> => {
  const response = await axiosInstance.get("/likes/check", {
    params: { userId, postId },
  });
  return response.data;
};