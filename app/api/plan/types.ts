export interface DailyPlan {
  dailyPlanId: number;
  studyDate: string;
  isCompleted: boolean;
  dayNumber: number;
  topic: string;
  description: string;
  estimatedHours: number;
  isRest: boolean;
}

export interface WeeklyPlan {
  weeklyPlanId: number;
  weekNumber: number;
  weeklyGoal: string;
  dailyPlans: DailyPlan[];
}

export interface PlanResponse {
  examTaskId: number;
  taskName: string;
  totalWeeks: number;
  weeklyPlans: WeeklyPlan[];
}

export interface PlanGenerateRequest {
  examTaskId: number;
  examDate: string;
  certificationName: string;
  daily: number;
  weekly: number;
  skillLevel: string;
}

export interface PlanCheckResponse {
  dailyPlanId: number;
  isCompleted: boolean;
  message: string;
}

/** 새로 추가: 플랜 탭 목록 */
export interface PlanTab {
  examTaskId: number;
  taskName: string;
}