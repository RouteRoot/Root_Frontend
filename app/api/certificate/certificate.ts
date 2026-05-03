import { axiosInstance } from "../axios/axiosInstance";
import type {
  CertificateDetail,
  CertificateMutationPayload,
  CertificateSchedule,
  CertificateSchedulePayload,
  CertificateSearchItem,
} from "./types";

export type {
  CertificateDetail,
  CertificateMutationPayload,
  CertificateSchedule,
  CertificateSchedulePayload,
  CertificateScheduleSummary,
  CertificateSearchItem,
  ExamDetail,
  ExamMutationPayload,
  ExamSchedule,
  ExamSchedulePayload,
  ExamScheduleSummary,
  ExamSearchItem,
} from "./types";

export async function searchCertificates(
  keyword: string
): Promise<CertificateSearchItem[]> {
  if (!keyword.trim()) return [];

  const response = await axiosInstance.get<CertificateSearchItem[]>(
    "/exams/search",
    {
      params: { keyword: keyword.trim() },
    }
  );

  return response.data;
}

export async function getCertificateDetail(
  examCode: string
): Promise<CertificateDetail> {
  const response = await axiosInstance.get<CertificateDetail>(
    `/exams/${examCode}`
  );

  return response.data;
}

export async function getAllCertificates(): Promise<CertificateDetail[]> {
  const response = await axiosInstance.get<CertificateDetail[]>("/exams/all");

  return response.data;
}

export async function createCertificateManual(
  payload: CertificateMutationPayload
): Promise<CertificateDetail> {
  const response = await axiosInstance.post<CertificateDetail>(
    "/exams/manual",
    payload
  );

  return response.data;
}

export async function patchCertificate(
  examCode: string,
  payload: CertificateMutationPayload
): Promise<CertificateDetail> {
  const response = await axiosInstance.patch<CertificateDetail>(
    `/exams/${examCode}`,
    payload
  );

  return response.data;
}

export async function deleteCertificate(examCode: string): Promise<string> {
  const response = await axiosInstance.delete<string>(`/exams/${examCode}`);

  return response.data;
}

export async function addCertificateSchedule(
  examCode: string,
  payload: CertificateSchedulePayload
): Promise<CertificateSchedule> {
  const response = await axiosInstance.post<CertificateSchedule>(
    `/exams/${examCode}/schedules`,
    payload
  );

  return response.data;
}

export async function patchCertificateSchedule(
  scheduleId: number,
  payload: CertificateSchedulePayload
): Promise<CertificateSchedule> {
  const response = await axiosInstance.patch<CertificateSchedule>(
    `/exams/schedules/${scheduleId}`,
    payload
  );

  return response.data;
}

export async function deleteCertificateSchedule(
  scheduleId: number
): Promise<string> {
  const response = await axiosInstance.delete<string>(
    `/exams/schedules/${scheduleId}`
  );

  return response.data;
}

export async function fetchExternalCertificates(): Promise<string> {
  const response = await axiosInstance.get<string>("/exams/fetch-external");

  return response.data;
}

export async function testFetchCertificateSchedules(
  examCode: string
): Promise<string> {
  const response = await axiosInstance.get<string>("/exams/test-fetch", {
    params: { examCode },
  });

  return response.data;
}

export async function fetchAllCertificateSchedules(): Promise<string> {
  const response = await axiosInstance.get<string>("/exams/test-fetch-all");

  return response.data;
}

export const searchExams = searchCertificates;
export const getExamDetail = getCertificateDetail;
export const getAllExams = getAllCertificates;
export const createExamManual = createCertificateManual;
export const patchExam = patchCertificate;
export const deleteExam = deleteCertificate;
export const addExamSchedule = addCertificateSchedule;
export const patchExamSchedule = patchCertificateSchedule;
export const deleteExamSchedule = deleteCertificateSchedule;
export const fetchExternalExams = fetchExternalCertificates;
export const testFetchExamSchedules = testFetchCertificateSchedules;
export const fetchAllExamSchedules = fetchAllCertificateSchedules;
