import { axiosInstance } from "../axios/axiosInstance";

export async function generatePlan(payload: {
  examTaskId: number;
  examDate: string;
  certificationName: string;
  daily: number;
  weekly: number;
  skillLevel: string;
}) {
  const response = await axiosInstance.post("/plans", payload);
  return response.data;
}

export async function getPlanByExamTaskId(examTaskId: number) {
  const response = await axiosInstance.get(`/plans/${examTaskId}`);
  return response.data;
}

export async function checkDailyPlan(dailyPlanId: number) {
  console.log("planApi checkDailyPlan:", dailyPlanId);
  console.log("axios baseURL:", axiosInstance.defaults.baseURL);

  const response = await axiosInstance.patch(
    `/plans/daily/${dailyPlanId}/check`
  );

  return response.data;
}