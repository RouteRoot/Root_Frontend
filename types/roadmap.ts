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

export type RoadmapTask = {
  taskId: number;
  taskName: string;
  description: string;
  status: string;
};

export type RoadmapPhase = {
  phaseId: number;
  phaseNumber: number;
  phaseTitle: string;
  estimatedWeeks: number;
  tasks: RoadmapTask[];
};

export type RoadmapDetailResponse = {
  roadmapId: number;
  phases: RoadmapPhase[];
};