import { axiosInstance } from "../axios/axiosInstance";
import { RoadmapResponse } from "@/types/roadmap";

export const getRoadmapById = async (roadmapId: number) => {
  const res = await axiosInstance.get<RoadmapResponse>(
    `/roadmaps/${roadmapId}`,
  );
  return res.data;
};
