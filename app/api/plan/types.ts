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
  weeklySchedule: Record<string, number>;
  skillLevel: string;
  personalStory: string;
}

export interface PlanCheckResponse {
  dailyPlanId: number;
  isCompleted: boolean;
  message: string;
}

export interface PlanTab {
  examTaskId: number;
  taskName: string;
}

export interface PlanDeleteResponse {
  examTaskId: number;
  message: string;
}
