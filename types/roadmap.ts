// 생성
export type RoadmapGenerateRequest = {
  userId: number;
  major: string;
  hope: string;
  acquired: string;
  status: string;
  daily: number;
  weekly: number;
  mylevel: string;
  target: string;
};

export type RoadmapGenerateResponse = {
  message: string;
  roadmapId: number;
};

// 조회

export type Task = {
  taskId: number;
  taskName: string;
  description: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
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