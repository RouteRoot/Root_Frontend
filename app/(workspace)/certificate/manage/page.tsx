"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  addCertificateSchedule,
  createCertificateManual,
  deleteCertificate,
  deleteCertificateSchedule,
  fetchAllCertificateSchedules,
  fetchExternalCertificates,
  getAllCertificates,
  getCertificateDetail,
  patchCertificate,
  patchCertificateSchedule,
  searchCertificates,
  testFetchCertificateSchedules,
} from "@/app/api/certificate/certificate";
import type {
  CertificateDetail,
  CertificateMutationPayload,
  CertificateSchedulePayload,
  CertificateSearchItem,
} from "@/app/api/certificate/types";
import { uploadPostImage } from "@/app/api/community/image";
import { hasMeaningfulCertificateDescription } from "@/components/certificate/certificateDescription";
import RichTextEditor from "@/components/community/RichTextEditor";

type CertificateForm = {
  examCode: string;
  examName: string;
  examGroup: string;
  examType: string;
  prerequisiteId: string;
  category: string;
  organization: string;
  description: string;
  officialUrl: string;
  isActive: boolean;
};

type ScheduleForm = {
  scheduleId: string;
  round: string;
  docRegStart: string;
  docRegEnd: string;
  docExamStart: string;
  docPassDate: string;
  pracRegStart: string;
  pracRegEnd: string;
  pracExamStart: string;
  pracPassDate: string;
};

const emptyCertificateForm: CertificateForm = {
  examCode: "",
  examName: "",
  examGroup: "",
  examType: "",
  prerequisiteId: "",
  category: "",
  organization: "",
  description: "",
  officialUrl: "",
  isActive: true,
};

const emptyScheduleForm: ScheduleForm = {
  scheduleId: "",
  round: "",
  docRegStart: "",
  docRegEnd: "",
  docExamStart: "",
  docPassDate: "",
  pracRegStart: "",
  pracRegEnd: "",
  pracExamStart: "",
  pracPassDate: "",
};

function optional(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function getRequestErrorMessage(error: unknown) {
  const status =
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "status" in error.response
      ? error.response.status
      : undefined;

  if (status === 403) {
    return "권한이 없어 저장/수정 요청이 막혔습니다. 백엔드 보안 설정에서 자격증 관리 API를 허용해야 합니다.";
  }

  if (status === 401) {
    return "로그인이 필요하거나 토큰이 만료되었습니다.";
  }

  if (status === 500) {
    return "서버 오류가 발생했습니다. 백엔드 로그를 확인해주세요.";
  }

  return "요청 처리에 실패했습니다.";
}

function toCertificatePayload(form: CertificateForm): CertificateMutationPayload {
  return {
    examCode: optional(form.examCode),
    examName: optional(form.examName),
    examGroup: optional(form.examGroup),
    examType: optional(form.examType),
    prerequisiteId: form.prerequisiteId
      ? Number(form.prerequisiteId)
      : undefined,
    category: optional(form.category),
    organization: optional(form.organization),
    description: optional(form.description),
    officialUrl: optional(form.officialUrl),
    isActive: form.isActive,
  };
}

function toSchedulePayload(form: ScheduleForm): CertificateSchedulePayload {
  return {
    round: optional(form.round),
    docRegStart: optional(form.docRegStart),
    docRegEnd: optional(form.docRegEnd),
    docExamStart: optional(form.docExamStart),
    docPassDate: optional(form.docPassDate),
    pracRegStart: optional(form.pracRegStart),
    pracRegEnd: optional(form.pracRegEnd),
    pracExamStart: optional(form.pracExamStart),
    pracPassDate: optional(form.pracPassDate),
  };
}

function toCertificateForm(data: CertificateDetail): CertificateForm {
  return {
    examCode: data.examCode,
    examName: data.examName,
    examGroup: data.examGroup ?? "",
    examType: data.examType ?? "",
    prerequisiteId: data.prerequisiteId ? String(data.prerequisiteId) : "",
    category: data.category ?? "",
    organization: data.organization ?? "",
    description: data.description ?? "",
    officialUrl: data.officialUrl ?? "",
    isActive: data.isActive,
  };
}

function hasMeaningfulDescription(description: string | null) {
  const htmlAware = hasMeaningfulCertificateDescription(description);
  if (description !== "__legacy__") return htmlAware;

  const normalized = description
    ?.replace(/\s+/g, " ")
    .replace(/[.。·ㆍ-]/g, "")
    .trim();

  if (!normalized) return false;

  const placeholders = [
    "설명",
    "설명없음",
    "정보없음",
    "자격증설명",
    "시험설명",
    "미등록",
    "없음",
    "null",
    "NULL",
  ];

  if (placeholders.includes(normalized)) return false;
  return normalized.length >= 100;
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium text-[#667085]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 h-11 w-full rounded-lg border border-[#DDE2EA] bg-white px-3 text-[14px] text-[#333333] outline-none transition-colors placeholder:text-[#B8C0CC] focus:border-[#4876EF]"
      />
    </label>
  );
}

function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "blue" | "muted";
}) {
  const toneClass =
    tone === "blue"
      ? "bg-[#F8FAFF] text-[#4876EF]"
      : tone === "muted"
        ? "bg-[#F7F9FB] text-[#7B8798]"
        : "bg-white text-[#333333]";

  return (
    <div className={`rounded-lg border border-[#E5E8EB] px-4 py-3 ${toneClass}`}>
      <p className="text-[12px] font-medium text-[#8A94A6]">{label}</p>
      <p className="mt-1 text-[22px] font-bold">{value}</p>
    </div>
  );
}

function Section({
  title,
  children,
  noBorder = false,
}: {
  title: string;
  children: ReactNode;
  noBorder?: boolean;
}) {
  return (
    <section
      className={`mt-6 ${noBorder ? "" : "rounded-lg border border-[#E5E8EB] bg-white p-5"}`}
    >
      <h2 className="text-[18px] font-semibold text-[#333333]">{title}</h2>
      {children}
    </section>
  );
}

export default function CertificateManagePage() {
  const [lookupCode, setLookupCode] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<CertificateSearchItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [certificate, setCertificate] = useState<CertificateDetail | null>(null);
  const [certificateForm, setCertificateForm] =
    useState<CertificateForm>(emptyCertificateForm);
  const [scheduleForm, setScheduleForm] =
    useState<ScheduleForm>(emptyScheduleForm);
  const [message, setMessage] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [externalCollectStatus, setExternalCollectStatus] = useState<
    "idle" | "collecting" | "done"
  >("idle");
  const [totalCount, setTotalCount] = useState(0);
  const [withDescriptionCount, setWithDescriptionCount] = useState(0);

  const activeExamCode = certificateForm.examCode.trim() || lookupCode.trim();
  const withoutDescriptionCount = totalCount - withDescriptionCount;

  const updateCertificateForm = <K extends keyof CertificateForm>(
    key: K,
    value: CertificateForm[K]
  ) => {
    setCertificateForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateScheduleForm = <K extends keyof ScheduleForm>(
    key: K,
    value: ScheduleForm[K]
  ) => {
    setScheduleForm((prev) => ({ ...prev, [key]: value }));
  };

  const refreshDescriptionStats = async () => {
    const page = await getAllCertificates();
    const described = page.content.filter((item) =>
      hasMeaningfulDescription(item.description)
    ).length;

    setTotalCount(page.totalElements);
    setWithDescriptionCount(described);
  };

  useEffect(() => {
    refreshDescriptionStats().catch(() => {
      setTotalCount(0);
      setWithDescriptionCount(0);
    });
  }, []);

  const runAction = async (action: () => Promise<void>) => {
    try {
      setIsWorking(true);
      setMessage("");
      await action();
    } catch (error) {
      setMessage(getRequestErrorMessage(error));
    } finally {
      setIsWorking(false);
    }
  };

  const loadCertificate = async (examCode: string) => {
    const code = examCode.trim();
    if (!code) {
      setMessage("불러올 자격증 코드를 입력해주세요.");
      return;
    }

    const data = await getCertificateDetail(code);
    setCertificate(data);
    setCertificateForm(toCertificateForm(data));
    setLookupCode(data.examCode);
    setMessage("자격증 정보를 불러왔습니다.");
  };

  const handleSearch = () =>
    runAction(async () => {
      const keyword = searchKeyword.trim();
      if (!keyword) {
        setSearchResults([]);
        setMessage("검색어를 입력해주세요.");
        return;
      }

      setIsSearching(true);
      try {
        const page = await searchCertificates(keyword, 0, 50);
        setSearchResults(page.content);
        setMessage(`${page.totalElements}개의 자격증을 찾았습니다.`);
      } finally {
        setIsSearching(false);
      }
    });

  const handleLoad = () =>
    runAction(async () => {
      await loadCertificate(lookupCode);
    });

  const handleSave = () =>
    runAction(async () => {
      if (!certificateForm.examCode.trim() || !certificateForm.examName.trim()) {
        setMessage("자격증 코드와 자격증명은 필수입니다.");
        return;
      }

      const data = await createCertificateManual(
        toCertificatePayload(certificateForm)
      );
      setCertificate(data);
      setCertificateForm(toCertificateForm(data));
      setLookupCode(data.examCode);
      await refreshDescriptionStats();
      setMessage("자격증 정보를 저장했습니다.");
    });

  const handlePatch = () =>
    runAction(async () => {
      if (!activeExamCode) {
        setMessage("수정할 자격증 코드를 입력해주세요.");
        return;
      }

      const data = await patchCertificate(
        activeExamCode,
        toCertificatePayload(certificateForm)
      );
      setCertificate(data);
      setCertificateForm(toCertificateForm(data));
      setLookupCode(data.examCode);
      await refreshDescriptionStats();
      setMessage("자격증 정보를 부분 수정했습니다.");
    });

  const handleDelete = () =>
    runAction(async () => {
      if (!activeExamCode) {
        setMessage("삭제할 자격증 코드를 입력해주세요.");
        return;
      }

      if (!window.confirm(`${activeExamCode} 자격증을 삭제할까요?`)) return;

      await deleteCertificate(activeExamCode);
      setCertificate(null);
      setCertificateForm(emptyCertificateForm);
      setLookupCode("");
      await refreshDescriptionStats();
      setMessage("자격증 정보를 삭제했습니다.");
    });

  const handleAddSchedule = () =>
    runAction(async () => {
      if (!activeExamCode) {
        setMessage("일정을 추가할 자격증 코드를 먼저 입력해주세요.");
        return;
      }

      await addCertificateSchedule(activeExamCode, toSchedulePayload(scheduleForm));
      const data = await getCertificateDetail(activeExamCode);
      setCertificate(data);
      setScheduleForm(emptyScheduleForm);
      setMessage("시험 일정을 추가했습니다.");
    });

  const handlePatchSchedule = () =>
    runAction(async () => {
      const scheduleId = Number(scheduleForm.scheduleId);
      if (!scheduleId) {
        setMessage("수정할 일정 ID를 입력해주세요.");
        return;
      }

      await patchCertificateSchedule(scheduleId, toSchedulePayload(scheduleForm));
      if (activeExamCode) {
        const data = await getCertificateDetail(activeExamCode);
        setCertificate(data);
      }
      setMessage("시험 일정을 수정했습니다.");
    });

  const handleDeleteSchedule = () =>
    runAction(async () => {
      const scheduleId = Number(scheduleForm.scheduleId);
      if (!scheduleId) {
        setMessage("삭제할 일정 ID를 입력해주세요.");
        return;
      }

      if (!window.confirm(`일정 ID ${scheduleId}를 삭제할까요?`)) return;

      await deleteCertificateSchedule(scheduleId);
      if (activeExamCode) {
        const data = await getCertificateDetail(activeExamCode);
        setCertificate(data);
      }
      setScheduleForm(emptyScheduleForm);
      setMessage("시험 일정을 삭제했습니다.");
    });

  return (
    <div className="mx-auto mt-8 w-full max-w-265.5">
      <div className="border-b border-[#E5E8EB] pb-6">
        <h1 className="text-[28px] font-bold tracking-tight text-[#333333]">
          자격증 데이터 관리
        </h1>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard label="전체 자격증" value={totalCount} />
          <StatCard
            label="설명 있음"
            value={withDescriptionCount}
            tone="blue"
          />
          <StatCard
            label="설명 없음"
            value={withoutDescriptionCount}
            tone="muted"
          />
        </div>
      </div>

      {message && (
        <div className="mt-5 rounded-lg bg-[#F8FAFF] px-4 py-3 text-[14px] font-medium text-[#4876EF]">
          {message}
        </div>
      )}

      <Section title="자격증 조회">
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
          <input
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSearch();
            }}
            placeholder="자격증명, 분야, 기관 검색"
            className="h-11 min-w-0 rounded-lg border border-[#DDE2EA] px-3 text-[14px] outline-none focus:border-[#4876EF]"
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={isWorking || isSearching}
            className="h-11 rounded-lg bg-[#4876EF] px-5 text-[14px] font-semibold text-white transition-colors disabled:bg-[#DDE7FF] hover:enabled:bg-[#3F68D8]"
          >
            검색
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="mt-4 max-h-72 overflow-y-auto rounded-lg border border-[#E5E8EB]">
            {searchResults.map((item) => (
              <button
                key={item.examCode}
                type="button"
                onClick={() =>
                  runAction(async () => {
                    await loadCertificate(item.examCode);
                  })
                }
                className="flex w-full items-start justify-between gap-4 border-b border-[#F1F3F6] px-4 py-3 text-left last:border-b-0 hover:bg-[#F8FAFF]"
              >
                <span className="min-w-0">
                  <span className="block truncate text-[14px] font-medium text-[#333333]">
                    {item.examName}
                  </span>
                  <span className="mt-1 block truncate text-[12px] text-[#8A94A6]">
                    {item.examCode} ·{" "}
                    {[item.category, item.organization].filter(Boolean).join(" · ") ||
                      "정보 없음"}
                  </span>
                </span>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[12px] font-medium ${
                    hasMeaningfulDescription(item.description)
                      ? "bg-[#EEF3FF] text-[#4876EF]"
                      : "bg-[#F3F6FA] text-[#98A2B3]"
                  }`}
                >
                  {hasMeaningfulDescription(item.description)
                    ? "설명 있음"
                    : "설명 없음"}
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-3">
          <input
            value={lookupCode}
            onChange={(event) => setLookupCode(event.target.value)}
            placeholder="코드로 바로 불러오기"
            className="h-11 min-w-0 flex-1 rounded-lg border border-[#DDE2EA] px-3 text-[14px] outline-none focus:border-[#4876EF]"
          />
          <button
            type="button"
            onClick={handleLoad}
            disabled={isWorking}
            className="h-11 rounded-lg border border-[#DDE2EA] px-5 text-[14px] font-semibold text-[#667085] transition-colors hover:border-[#B8C0CC]"
          >
            불러오기
          </button>
        </div>
      </Section>

      <Section title="기본 정보 입력" noBorder>
        <div className="mt-1 flex justify-end">
          <label className="flex items-center gap-2 text-[13px] font-medium text-[#667085]">
            <input
              type="checkbox"
              checked={certificateForm.isActive}
              onChange={(event) =>
                updateCertificateForm("isActive", event.target.checked)
              }
            />
            활성화
          </label>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextInput
            label="자격증 코드"
            value={certificateForm.examCode}
            onChange={(value) => updateCertificateForm("examCode", value)}
          />
          <TextInput
            label="자격증명"
            value={certificateForm.examName}
            onChange={(value) => updateCertificateForm("examName", value)}
          />
          <TextInput
            label="그룹"
            value={certificateForm.examGroup}
            onChange={(value) => updateCertificateForm("examGroup", value)}
            placeholder="기사, 기능사 등"
          />
          <TextInput
            label="시험 유형"
            value={certificateForm.examType}
            onChange={(value) => updateCertificateForm("examType", value)}
            placeholder="필기 / 실기 / 단일"
          />
          <TextInput
            label="분야"
            value={certificateForm.category}
            onChange={(value) => updateCertificateForm("category", value)}
          />
          <TextInput
            label="주관 기관"
            value={certificateForm.organization}
            onChange={(value) => updateCertificateForm("organization", value)}
          />
          <TextInput
            label="선수 시험 ID"
            value={certificateForm.prerequisiteId}
            onChange={(value) => updateCertificateForm("prerequisiteId", value)}
            type="number"
          />
          <TextInput
            label="공식 URL"
            value={certificateForm.officialUrl}
            onChange={(value) => updateCertificateForm("officialUrl", value)}
          />
        </div>

        <div className="mt-4">
          <span className="text-[13px] font-medium text-[#667085]">설명</span>
          <div className="mt-2">
            <RichTextEditor
              value={certificateForm.description}
              onChange={(value) =>
                updateCertificateForm("description", value)
              }
              placeholder="상세 페이지에 표시할 설명을 입력해주세요."
              onImageUpload={async (file) => {
                const result = await uploadPostImage(file);
                return result.imageUrl;
              }}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={isWorking}
            className="h-10 rounded-lg bg-[#4876EF] px-4 text-[14px] font-semibold text-white disabled:bg-[#DDE7FF]"
          >
            생성/전체 저장
          </button>
          <button
            type="button"
            onClick={handlePatch}
            disabled={isWorking}
            className="h-10 rounded-lg border border-[#DDE2EA] px-4 text-[14px] font-semibold text-[#667085]"
          >
            부분 수정
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isWorking}
            className="h-10 rounded-lg border border-[#FCA5A5] px-4 text-[14px] font-semibold text-[#EF4444]"
          >
            삭제
          </button>
        </div>
      </Section>

      <Section title="시험 일정 입력">
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextInput
            label="일정 ID"
            value={scheduleForm.scheduleId}
            onChange={(value) => updateScheduleForm("scheduleId", value)}
            placeholder="수정/삭제할 때만 입력"
            type="number"
          />
          <TextInput
            label="회차"
            value={scheduleForm.round}
            onChange={(value) => updateScheduleForm("round", value)}
          />
          <TextInput
            label="필기 접수 시작"
            value={scheduleForm.docRegStart}
            onChange={(value) => updateScheduleForm("docRegStart", value)}
            type="date"
          />
          <TextInput
            label="필기 접수 종료"
            value={scheduleForm.docRegEnd}
            onChange={(value) => updateScheduleForm("docRegEnd", value)}
            type="date"
          />
          <TextInput
            label="필기 시험"
            value={scheduleForm.docExamStart}
            onChange={(value) => updateScheduleForm("docExamStart", value)}
            type="date"
          />
          <TextInput
            label="필기 발표"
            value={scheduleForm.docPassDate}
            onChange={(value) => updateScheduleForm("docPassDate", value)}
            type="date"
          />
          <TextInput
            label="실기 접수 시작"
            value={scheduleForm.pracRegStart}
            onChange={(value) => updateScheduleForm("pracRegStart", value)}
            type="date"
          />
          <TextInput
            label="실기 접수 종료"
            value={scheduleForm.pracRegEnd}
            onChange={(value) => updateScheduleForm("pracRegEnd", value)}
            type="date"
          />
          <TextInput
            label="실기 시험"
            value={scheduleForm.pracExamStart}
            onChange={(value) => updateScheduleForm("pracExamStart", value)}
            type="date"
          />
          <TextInput
            label="실기 발표"
            value={scheduleForm.pracPassDate}
            onChange={(value) => updateScheduleForm("pracPassDate", value)}
            type="date"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleAddSchedule}
            disabled={isWorking}
            className="h-10 rounded-lg bg-[#4876EF] px-4 text-[14px] font-semibold text-white disabled:bg-[#DDE7FF]"
          >
            일정 추가
          </button>
          <button
            type="button"
            onClick={handlePatchSchedule}
            disabled={isWorking}
            className="h-10 rounded-lg border border-[#DDE2EA] px-4 text-[14px] font-semibold text-[#667085]"
          >
            일정 수정
          </button>
          <button
            type="button"
            onClick={handleDeleteSchedule}
            disabled={isWorking}
            className="h-10 rounded-lg border border-[#FCA5A5] px-4 text-[14px] font-semibold text-[#EF4444]"
          >
            일정 삭제
          </button>
        </div>

        {certificate?.schedules?.length ? (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#EEF2F7] text-[12px] font-semibold text-[#8A94A6]">
                  <th className="py-3 pr-4">ID</th>
                  <th className="px-4 py-3">회차</th>
                  <th className="px-4 py-3">필기 시험</th>
                  <th className="px-4 py-3">실기 시험</th>
                </tr>
              </thead>
              <tbody>
                {certificate.schedules.map((schedule) => (
                  <tr
                    key={schedule.id}
                    className="border-b border-[#F1F3F6] text-[13px] text-[#575757]"
                  >
                    <td className="py-3 pr-4 font-medium text-[#333333]">
                      {schedule.id}
                    </td>
                    <td className="px-4 py-3">{schedule.round || "-"}</td>
                    <td className="px-4 py-3">{schedule.docExamStart || "-"}</td>
                    <td className="px-4 py-3">{schedule.pracExamStart || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Section>

      <Section title="외부 데이터 수집">
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              runAction(async () => {
                setExternalCollectStatus("collecting");
                const examResult = await fetchExternalCertificates();
                const scheduleResult = await fetchAllCertificateSchedules();
                await refreshDescriptionStats();
                setExternalCollectStatus("done");
                setMessage(`${examResult} ${scheduleResult}`);
              })
            }
            disabled={isWorking}
            className="h-10 rounded-lg border border-[#DDE2EA] px-4 text-[14px] font-semibold text-[#667085] disabled:bg-[#F3F6FA]"
          >
            {externalCollectStatus === "collecting"
              ? "수집 중..."
              : externalCollectStatus === "done"
                ? "수집 완료"
                : "자격증/일정 데이터 수집"}
          </button>
          <button
            type="button"
            onClick={() =>
              runAction(async () => {
                if (!activeExamCode) {
                  setMessage("일정을 수집할 자격증 코드를 입력해주세요.");
                  return;
                }
                const result = await testFetchCertificateSchedules(activeExamCode);
                setMessage(result);
              })
            }
            disabled={isWorking}
            className="h-10 rounded-lg border border-[#DDE2EA] px-4 text-[14px] font-semibold text-[#667085]"
          >
            현재 자격증 일정 수집
          </button>
          <button
            type="button"
            onClick={() =>
              runAction(async () => {
                const result = await fetchAllCertificateSchedules();
                setMessage(result);
              })
            }
            disabled={isWorking}
            className="h-10 rounded-lg border border-[#DDE2EA] px-4 text-[14px] font-semibold text-[#667085]"
          >
            전체 일정 수집
          </button>
        </div>
      </Section>
    </div>
  );
}
