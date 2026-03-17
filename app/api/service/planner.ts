import { axiosInstance } from "../axios/axiosInstance";
import type { PlannerResponse, CheckDailyPlanResponse } from "@/types/planner";

export const getPlannerByExamTaskId = async (
  examTaskId: number,
): Promise<PlannerResponse> => {
  const { data } = await axiosInstance.get(`plans/${examTaskId}`);
  return data;
};

export const checkDailyPlan = async (
  dailyPlanId: number,
): Promise<CheckDailyPlanResponse> => {
  const { data } = await axiosInstance.patch(
    `/api/plans/daily/${dailyPlanId}/check`,
  );
  return data;
};
