import { axiosInstance } from "../axios/axiosInstance";
import type {
  RoadmapResponse,
  RoadmapGenerateRequest,
  RoadmapGenerateResponse,
} from "@/types/roadmap";

// 조회
export const getRoadmapById = async (
  roadmapId: number,
): Promise<RoadmapResponse> => {
  const res = await axiosInstance.get<RoadmapResponse>(
    `/roadmaps/${roadmapId}`,
  );
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
