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
