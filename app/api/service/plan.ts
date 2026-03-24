import { axiosInstance } from "../axios/axiosInstance";
import {
  PlanCheckResponse,
  PlanGenerateRequest,
  PlanResponse,
} from "@/types/plan";

export async function generatePlan(
  payload: PlanGenerateRequest,
): Promise<PlanResponse> {
  const response = await axiosInstance.post("/plans", payload);
  return response.data;
}

export async function getPlanByExamTaskId(
  examTaskId: number,
): Promise<PlanResponse> {
  const response = await axiosInstance.get(`/plans/${examTaskId}`);
  return response.data;
}

export async function checkDailyPlan(
  dailyPlanId: number,
): Promise<PlanCheckResponse> {
  const response = await axiosInstance.patch(
    `/plans/daily/${dailyPlanId}/check`,
  );
  return response.data;
}
