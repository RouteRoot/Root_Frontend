import { axiosInstance } from "../axios/axiosInstance";
import type {
  PlanGenerateRequest,
  PlanResponse,
  PlanCheckResponse,
  PlanTab,
  PlanDeleteResponse,
  PlanMigrateRequest,
  PlanMigrateResponse,
  PlanSettingsResponse,
  PlanRedistributeRequest,
  RedistributedWeeklyPlan,
  WeeklyPlan,
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

// 플랜 삭제
export async function deletePlan(
  examTaskId: number
): Promise<PlanDeleteResponse> {
  console.log("planApi deletePlan examTaskId:", examTaskId);
  console.log("axios baseURL:", axiosInstance.defaults.baseURL);

  const response = await axiosInstance.delete(`/plans/tasks/${examTaskId}`);
  return response.data;
}

export async function migrateDailyPlan(
  payload: PlanMigrateRequest
): Promise<PlanMigrateResponse> {
  const response = await axiosInstance.post("/plans/daily/migrate", payload);
  return response.data;
}

export async function getPlanSettings(
  examTaskId: number
): Promise<PlanSettingsResponse> {
  const response = await axiosInstance.get(`/plans/settings/${examTaskId}`);
  return response.data;
}

export async function redistributePlan(
  payload: PlanRedistributeRequest
): Promise<WeeklyPlan[]> {
  const response = await axiosInstance.post<RedistributedWeeklyPlan[]>(
    "/plans/redistribute",
    payload
  );

  return response.data.map((week) => ({
    weeklyPlanId: week.id,
    weekNumber: week.weekNumber,
    weeklyGoal: week.weeklyGoal,
    dailyPlans: week.dailyPlans.map((day) => ({
      dailyPlanId: day.id,
      studyDate: day.studyDate,
      isCompleted: day.isCompleted,
      dayNumber: day.dayNumber,
      topic: day.topic,
      description: day.description,
      estimatedHours: day.estimatedHours,
      isRest: day.isRest,
    })),
  }));
}
