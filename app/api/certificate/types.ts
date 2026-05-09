export type CertificateScheduleSummary = {
  round: string | null;
  docExamStart: string | null;
  docDDay: number | null;
  pracExamStart: string | null;
  pracDDay: number | null;
};

export type CertificateSearchItem = {
  examCode: string;
  examName: string;
  examGroup: string | null;
  category: string | null;
  organization: string | null;
  description: string | null;
  schedules: CertificateScheduleSummary[];
};

export type CertificateSchedule = {
  id: number;
  round: string | null;
  docRegStart: string | null;
  docRegEnd: string | null;
  docExamStart: string | null;
  docPassDate: string | null;
  pracRegStart: string | null;
  pracRegEnd: string | null;
  pracExamStart: string | null;
  pracPassDate: string | null;
};

export type CertificateDetail = {
  examCode: string;
  examName: string;
  examGroup: string | null;
  examType: string | null;
  prerequisiteId: number | null;
  category: string | null;
  organization: string | null;
  description: string | null;
  officialUrl: string | null;
  isActive: boolean;
  schedules: CertificateSchedule[];
};

export type CertificateMutationPayload = Partial<{
  examCode: string;
  examName: string;
  examGroup: string;
  examType: string;
  prerequisiteId: number;
  category: string;
  organization: string;
  description: string;
  officialUrl: string;
  isActive: boolean;
}>;

export type CertificateSchedulePayload = Partial<{
  round: string;
  docRegStart: string;
  docRegEnd: string;
  docExamStart: string;
  docPassDate: string;
  pracRegStart: string;
  pracRegEnd: string;
  pracExamStart: string;
  pracPassDate: string;
}>;

export type CertificatePage<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};

export type ExamScheduleSummary = CertificateScheduleSummary;
export type ExamSearchItem = CertificateSearchItem;
export type ExamSchedule = CertificateSchedule;
export type ExamDetail = CertificateDetail;
export type ExamMutationPayload = CertificateMutationPayload;
export type ExamSchedulePayload = CertificateSchedulePayload;
