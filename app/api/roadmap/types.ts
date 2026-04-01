export type RoadmapFormData = {
  educationStatus: string;
  grade: number;
  major: string;
  hope: string;
  isMajorRelated: boolean;
  career: number;
  daily: number;
  weekly: number;
  mylevel: string;
  target: string;
};

export type RoadmapGenerateRequest = RoadmapFormData;

export type RoadmapGenerateResponse = {
  message: string;
  roadmapId: number;
};

export type TaskStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export type Task = {
  taskId: number;
  taskName: string;
  description: string;
  status: TaskStatus;
};

export type Phase = {
  phaseId: number;
  phaseNumber: number | null;
  phaseTitle: string;
  estimatedWeeks: number;
  tasks: Task[];
};

export type RoadmapResponse = {
  roadmapId: number;
  daily: number;
  weekly: number;
  mylevel: string;
  phases: Phase[];
};
export type RoadmapUpdateRequest = RoadmapFormData;
