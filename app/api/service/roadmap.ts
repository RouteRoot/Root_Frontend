import { axiosInstance } from "../axios/axiosInstance";

import type { RoadmapDetailResponse } from "@/types/roadmap";

export const getRoadmapDetail = async (
  roadmapId: number,
): Promise<RoadmapDetailResponse> => {
  const { data } = await axiosInstance.get(`/roadmaps/${roadmapId}`);
  return data;
};
