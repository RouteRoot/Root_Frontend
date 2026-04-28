import { axiosInstance } from "../axios/axiosInstance";
import type {
  RoadmapResponse,
  RoadmapGenerateRequest,
  RoadmapGenerateResponse,
} from "./types";

// 조회
export const getRoadmapByToken = async (): Promise<RoadmapResponse> => {
  const res = await axiosInstance.get<RoadmapResponse>(`/roadmaps/`);
  console.log("getRoadmapByToken response:", res.data);
  return res.data;
};

// 자격증 완료 처리
export const completeTask = async (examTaskId: number): Promise<void> => {
  await axiosInstance.patch(`/roadmaps/tasks/${examTaskId}/complete`);
};

// 생성
export const generateRoadmap = async (
  data: RoadmapGenerateRequest,
): Promise<RoadmapGenerateResponse> => {
  const res = await axiosInstance.post<RoadmapGenerateResponse>(
    "/roadmaps/generate",
    data,
  );
  return res.data;
};
