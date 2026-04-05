import { axiosInstance } from "../axios/axiosInstance";

export type ExamSchedule = {
  round: string;
  docExamStart?: string;
  docDday?: number;
  pracExamStart?: string;
  pracDday?: number;
};

export type ExamSearchItem = {
  examName: string;
  schedules: ExamSchedule[];
};

export const searchCertificates = async (
  keyword: string
): Promise<ExamSearchItem[]> => {
  const res = await axiosInstance.get("/exams/search", {
    params: { keyword },
  });

  return res.data;
};