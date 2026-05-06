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
  status: string | null;
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
  message: string;
}

export interface PlanMigrateRequest {
  dailyPlanId: number;
  targetDate: string;
}

export interface PlanMigrateResponse {
  message: string;
  targetDate: string;
}

export interface PlanSettingsResponse {
  examTaskId: number;
  certificationName: string;
  examDate: string;
  skillLevel: string;
  personalStory: string;
  weeklySchedule: Record<string, number>;
}

export interface PlanRedistributeRequest {
  examTaskId: number;
  newExamDate: string;
  weeklySchedule: Record<string, number>;
}

export interface RedistributedDailyPlan {
  id: number;
  studyDate: string;
  isCompleted: boolean;
  dayNumber: number;
  topic: string;
  description: string;
  estimatedHours: number;
  isRest: boolean;
}

export interface RedistributedWeeklyPlan {
  id: number;
  weekNumber: number;
  weeklyGoal: string;
  dailyPlans: RedistributedDailyPlan[];
}
