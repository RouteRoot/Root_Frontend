export type DailyPlan = {
  dailyPlanId: number;
  studyDate: string;
  completed: boolean;
  dayNumber: number;
  topic: string;
  description: string;
  estimatedHours: number;
  rest: boolean;
};

export type WeeklyPlan = {
  weeklyPlansId?: number;
  weekNumber?: number;
  weeklyGoal?: string;
  dailyPlans: DailyPlan[];
};

export type PlannerResponse = {
  targetExam: string;
  totalWeeks: number;
  weeklyPlans: WeeklyPlan[];
};

export type CheckDailyPlanResponse = {
  dailyPlanId: number;
  isCompleted?: boolean;
  completed?: boolean;
  message: string;
};
