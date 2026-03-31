import { axiosInstance } from "../axios/axiosInstance";
import type {
  PlanGenerateRequest,
  PlanResponse,
  PlanCheckResponse,
  PlanTab,
} from "./types";

// 플랜 생성
export async function generatePlan(
  payload: PlanGenerateRequest
): Promise<PlanResponse> {
  const response = await axiosInstance.post("/plans", payload);
  return response.data;
  
}

// 플랜 탭 목록 조회
export async function getPlanTabs(): Promise<PlanTab[]> {
  const response = await axiosInstance.get("/plans/tabs");
  return response.data;
}

// examTaskId로 플랜 상세 조회
export async function getPlanByExamTaskId(
  examTaskId: number
): Promise<PlanResponse> {
  const response = await axiosInstance.get(`/plans/${examTaskId}`);
  return response.data;
}

// 일일 계획 체크/체크해제
export async function checkDailyPlan(
  dailyPlanId: number
): Promise<PlanCheckResponse> {
  console.log("planApi checkDailyPlan:", dailyPlanId);
  console.log("axios baseURL:", axiosInstance.defaults.baseURL);

  const response = await axiosInstance.patch(
    `/plans/daily/${dailyPlanId}/check`
  );

  return response.data;
}