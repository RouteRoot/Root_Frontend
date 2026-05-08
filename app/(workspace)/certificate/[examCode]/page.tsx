"use client";

import { ArrowLeft, CheckCircle2, ExternalLink } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getCertificateDetail } from "@/app/api/certificate/certificate";
import type { CertificateDetail } from "@/app/api/certificate/types";
import { sanitizeRichText } from "@/components/community/RichTextEditor";

function formatDate(date: string | null) {
  if (!date) return "-";
  return date;
}

export default function CertificateDetailPage() {
  const params = useParams<{ examCode: string }>();
  const router = useRouter();
  const examCode = decodeURIComponent(String(params.examCode ?? ""));

  const [certificate, setCertificate] = useState<CertificateDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadCertificate() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const data = await getCertificateDetail(examCode);
        if (mounted) setCertificate(data);
      } catch {
        if (mounted) {
          setCertificate(null);
          setErrorMessage("자격증 정보를 불러오지 못했습니다.");
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    if (examCode) loadCertificate();

    return () => {
      mounted = false;
    };
  }, [examCode]);

  const sanitizedDescription = useMemo(
    () =>
      certificate?.description ? sanitizeRichText(certificate.description) : "",
    [certificate]
  );

  if (isLoading) {
    return (
      <div className="mx-auto mt-8 w-full max-w-[1062px] animate-pulse">
        <div className="h-5 w-24 rounded bg-[#EEF2F7]" />
        <div className="mt-8 h-10 w-2/3 rounded bg-[#EEF2F7]" />
        <div className="mt-4 h-4 w-full rounded bg-[#F3F6FA]" />
        <div className="mt-10 h-80 rounded-lg bg-[#F3F6FA]" />
      </div>
    );
  }

  if (!certificate || errorMessage) {
    return (
      <div className="mx-auto mt-8 w-full max-w-[1062px] py-16 text-center">
        <p className="text-[15px] font-medium text-[#7B8798]">
          {errorMessage || "자격증 정보가 없습니다."}
        </p>
        <button
          type="button"
          onClick={() => router.back()}
          className="mt-5 text-[14px] font-semibold text-[#4876EF]"
        >
          이전으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 w-full max-w-[1062px]">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#8A94A6] transition-colors hover:text-[#4876EF]"
      >
        <ArrowLeft className="h-4 w-4" />
        검색 결과로 돌아가기
      </button>

      <section className="mt-7 border-b border-[#E5E8EB] pb-9">
        <div className="flex flex-wrap items-center gap-2">
          {certificate.category && (
            <span className="rounded-sm bg-[#F5F7FA] px-2.5 py-1 text-[12px] font-normal text-[#7B8798]">
              {certificate.category}
            </span>
          )}
          {certificate.examGroup && (
            <span className="rounded-sm bg-[#EEF3FF] px-2.5 py-1 text-[12px] font-normal text-[#4876EF]">
              {certificate.examGroup}
            </span>
          )}
          <span
            className={`rounded-sm px-2.5 py-1 text-[12px] font-normal ${
              certificate.isActive
                ? "bg-[#ECFDF5] text-[#059669]"
                : "bg-[#F3F4F6] text-[#8A94A6]"
            }`}
          >
            {certificate.isActive ? "운영 중" : "비활성"}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-x-4 gap-y-2">
          <h1 className="text-[32px] font-bold tracking-tight text-[#333333]">
            {certificate.examName}
          </h1>
          <div className="flex flex-wrap items-center gap-2 pb-1 text-[13px] text-[#7B8798]">
            <span>{certificate.examType || "유형 정보 없음"}</span>
            <span className="h-3 w-px bg-[#DDE2EA]" />
            <span>{certificate.organization || "기관 정보 없음"}</span>
          </div>
        </div>

        {sanitizedDescription ? (
          <div
            className="rich-text-content mt-4 overflow-x-auto pb-2 text-[15px] leading-[1.8] text-[#667085]"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />
        ) : (
          <p className="mt-4 max-w-175 text-[15px] leading-[1.8] text-[#667085]">
            자격증 설명이 아직 등록되지 않았습니다. 시험 일정과 주관 기관
            정보를 확인해보세요.
          </p>
        )}
      </section>

      <section className="mt-9">
        <div className="flex items-end justify-between border-b border-[#DDE2EA] pb-4">
          <h2 className="text-[18px] font-semibold text-[#333333]">
            시험 일정
          </h2>
          <div className="flex items-end gap-3">
            <span className="text-[13px] font-medium text-[#8A94A6]">
              {certificate.schedules.length}개 일정
            </span>
            {certificate.officialUrl && (
              <a
                href={certificate.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 items-center gap-1.5 rounded-lg border border-[#DDE2EA] px-4 text-[13px] font-semibold text-[#667085] transition-colors hover:border-[#B8C0CC] hover:text-[#333333]"
              >
                공식 사이트
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>

        {certificate.schedules.length === 0 ? (
          <div className="py-16 text-center text-[14px] text-[#98A2B3]">
            등록된 시험 일정이 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#EEF2F7] text-[12px] font-semibold text-[#8A94A6]">
                  <th className="py-4 pr-4">회차</th>
                  <th className="px-4 py-4">필기 접수</th>
                  <th className="px-4 py-4">필기 시험</th>
                  <th className="px-4 py-4">필기 발표</th>
                  <th className="px-4 py-4">실기 접수</th>
                  <th className="px-4 py-4">실기 시험</th>
                  <th className="py-4 pl-4">실기 발표</th>
                </tr>
              </thead>
              <tbody>
                {certificate.schedules.map((schedule) => (
                  <tr
                    key={schedule.id}
                    className="border-b border-[#F1F3F6] text-[13px] text-[#575757]"
                  >
                    <td className="py-4 pr-4 font-medium text-[#333333]">
                      {schedule.round || "일정 정보"}
                    </td>
                    <td className="px-4 py-4">
                      {formatDate(schedule.docRegStart)} -{" "}
                      {formatDate(schedule.docRegEnd)}
                    </td>
                    <td className="px-4 py-4">
                      {formatDate(schedule.docExamStart)}
                    </td>
                    <td className="px-4 py-4">
                      {formatDate(schedule.docPassDate)}
                    </td>
                    <td className="px-4 py-4">
                      {formatDate(schedule.pracRegStart)} -{" "}
                      {formatDate(schedule.pracRegEnd)}
                    </td>
                    <td className="px-4 py-4">
                      {formatDate(schedule.pracExamStart)}
                    </td>
                    <td className="py-4 pl-4">
                      {formatDate(schedule.pracPassDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="mt-6 rounded-lg bg-[#F8FAFF] p-5">
        <div className="flex gap-3">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#4876EF]" />
          <p className="text-[13px] leading-[1.7] text-[#667085]">
            시험 일정은 기관 공지에 따라 변경될 수 있어요. 접수 전 공식
            사이트에서 최종 일정을 한 번 더 확인해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
