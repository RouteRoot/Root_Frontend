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
  console.log("====================================");
  console.log("[API 함수 진입] searchCertificates");
  console.log("전달받은 keyword:", keyword);
  console.log("axios baseURL:", axiosInstance.defaults.baseURL);
  console.log("요청 URL: /exams/search");
  console.log("요청 params:", { keyword });
  console.log("====================================");

  const res = await axiosInstance.get("/exams/search", {
    params: { keyword },
  });

  console.log("====================================");
  console.log("[API 함수 응답]");
  console.log("status:", res.status);
  console.log("response.data:", res.data);
  console.log("====================================");

  return res.data;
};