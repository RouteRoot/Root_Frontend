import { axiosInstance } from "../axios/axiosInstance";
import type {
  CertificateDetail,
  CertificateMutationPayload,
  CertificatePage,
  CertificateSchedule,
  CertificateSchedulePayload,
  CertificateSearchItem,
} from "./types";

export type {
  CertificateDetail,
  CertificateMutationPayload,
  CertificatePage,
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
  keyword: string,
  page = 0,
  size = 10
): Promise<CertificatePage<CertificateSearchItem>> {
  if (!keyword.trim())
    return { content: [], totalElements: 0, totalPages: 0, size, number: 0, first: true, last: true, empty: true };

  const response = await axiosInstance.get<CertificatePage<CertificateSearchItem>>(
    "/exams/search",
    { params: { keyword: keyword.trim(), page, size } }
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

export async function getAllCertificates(
  page = 0,
  size = 1000
): Promise<CertificatePage<CertificateDetail>> {
  const response = await axiosInstance.get<CertificatePage<CertificateDetail>>(
    "/exams/all",
    { params: { page, size } }
  );

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
