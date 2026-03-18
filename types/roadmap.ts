export type RoadmapFormData = {
  major: string;
  hope: string;
  acquired: string;
  status: string;
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
  phases: Phase[];
};

export type RoadmapUpdateRequest = RoadmapFormData;
