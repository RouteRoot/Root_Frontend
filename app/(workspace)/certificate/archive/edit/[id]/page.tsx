"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  getArchivePostDetail,
  updateArchivePost,
} from "@/app/api/archive/archive";
import type { ArchiveBoardType } from "@/app/api/archive/types";
import { uploadPostImage } from "@/app/api/community/image";
import CertificateWikiSubNav from "@/components/certificate/CertificateWikiSubNav";
import { useWikiEditorAccess } from "@/components/certificate/useWikiEditorAccess";
import RichTextEditor, {
  getRichTextPlainText,
} from "@/components/community/RichTextEditor";

type ArchiveCategoryOption = {
  label: string;
  boardType: ArchiveBoardType;
};

const CATEGORY_OPTIONS: ArchiveCategoryOption[] = [
  { label: "입문자 추천", boardType: "RECOMMAND" },
  { label: "자격증 분석", boardType: "CERT_ANALYSIS" },
  { label: "직무 분석", boardType: "JOB_ANALYSIS" },
  { label: "시험 정보", boardType: "EXAM_INFO" },
  { label: "공부법", boardType: "STUDY_METHOD" },
  { label: "합격 전략", boardType: "PASS_STRATEGY" },
  { label: "취업 전략", boardType: "JOB_STRATEGY" },
  { label: "전문가 인사이트", boardType: "EXPERT_INSIGHT" },
];

type ArchiveEditDraft = {
  boardType: ArchiveBoardType;
  title: string;
  content: string;
};

export default function ArchiveEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const postId = Number(params.id);
  const { isChecking, isEditor } = useWikiEditorAccess();
  const [draft, setDraft] = useState<ArchiveEditDraft>({
    boardType: "RECOMMAND",
    title: "",
    content: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!Number.isFinite(postId) || postId <= 0) {
      setErrorMessage("잘못된 아카이브 주소입니다.");
      setIsLoading(false);
      return;
    }

    let mounted = true;

    async function load() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const post = await getArchivePostDetail(postId);

        if (!mounted) return;
        setDraft({
          boardType: post.boardType,
          title: post.title,
          content: post.content,
        });
      } catch {
        if (!mounted) return;
        setErrorMessage("아카이브 글을 불러오지 못했습니다.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [postId]);

  const selectedCategory = useMemo(
    () =>
      CATEGORY_OPTIONS.find((option) => option.boardType === draft.boardType) ??
      CATEGORY_OPTIONS[0],
    [draft.boardType]
  );

  const plainContent = useMemo(
    () => getRichTextPlainText(draft.content),
    [draft.content]
  );

  const canSubmit =
    draft.title.trim().length > 0 && plainContent.length > 0 && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const updated = await updateArchivePost(postId, {
        title: draft.title.trim(),
        content: draft.content.trim(),
        boardType: draft.boardType,
        category: selectedCategory.label,
      });

      router.push(`/certificate/archive/${updated.postId}`);
    } catch {
      setErrorMessage("아카이브 글 수정에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isChecking || isLoading) {
    return (
      <div>
        <CertificateWikiSubNav />
        <main className="mx-auto w-full max-w-265.5 pb-28 pt-14">
          <div className="h-5 w-28 animate-pulse rounded bg-[#EEF2F7]" />
          <div className="mt-10 h-12 animate-pulse rounded-[8px] bg-[#EEF2F7]" />
          <div className="mt-3 h-12 animate-pulse rounded-[8px] bg-[#F3F6FA]" />
          <div className="mt-8 h-80 animate-pulse rounded-[8px] bg-[#F8FAFC]" />
        </main>
      </div>
    );
  }

  if (!isEditor) {
    return (
      <div>
        <CertificateWikiSubNav />
        <main className="mx-auto w-full max-w-265.5 py-24 text-center">
          <p className="text-[16px] font-medium text-[#333333]">
            뿌리 에디터만 아카이브를 수정할 수 있어요.
          </p>
          <button
            type="button"
            onClick={() => router.push(`/certificate/archive/${postId}`)}
            className="mt-6 h-10 rounded-[8px] border border-[#DDE2EA] px-5 text-[14px] font-medium text-[#667085] transition-colors hover:border-[#BFD0FF] hover:text-[#4876EF]"
          >
            상세로 돌아가기
          </button>
        </main>
      </div>
    );
  }

  return (
    <div>
      <CertificateWikiSubNav />
      <main className="mx-auto flex min-h-[calc(100vh-180px)] w-full max-w-265.5 flex-col pb-28 pt-12">
        <section>
          <div className="grid grid-cols-[220px_minmax(0,1fr)] gap-3">
            <div className="relative">
              <select
                value={draft.boardType}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    boardType: event.target.value as ArchiveBoardType,
                  }))
                }
                className="h-12 w-full appearance-none rounded-lg border border-[#DDE2EA] bg-white pl-4 pr-10 text-[15px] font-normal text-[#333333] outline-none transition-colors focus:border-[#4876EF]"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.boardType} value={option.boardType}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA3B2]" />
            </div>

            <input
              value={draft.title}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              placeholder="제목을 입력해주세요"
              className="h-12 rounded-[8px] border border-[#DDE2EA] bg-white px-4 text-[15px] font-medium text-[#333333] outline-none transition-colors placeholder:text-[#B8C0CC] focus:border-[#4876EF]"
            />
          </div>

          <div className="mt-6 border-t border-[#E5E8EB]">
            <RichTextEditor
              value={draft.content}
              onChange={(nextContent) =>
                setDraft((current) => ({
                  ...current,
                  content: nextContent,
                }))
              }
              placeholder="아카이브 내용을 작성해주세요."
              onImageUpload={async (file) => {
                const result = await uploadPostImage(file);
                return result.imageUrl;
              }}
            />
          </div>

          {errorMessage && (
            <p className="mt-4 text-[13px] font-medium text-[#EF4444]">
              {errorMessage}
            </p>
          )}
        </section>

        <div className="fixed inset-x-0 bottom-0 border-t border-[#E5E8EB] bg-white">
          <div className="mx-auto flex h-18 w-full max-w-265.5 items-center justify-end">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push(`/certificate/archive/${postId}`)}
                className="h-11 rounded-[8px] border border-[#DDE2EA] px-5 text-[14px] font-medium text-[#667085] transition-colors hover:bg-[#F8FAFC]"
              >
                취소
              </button>
              <button
                type="button"
                disabled={!canSubmit}
                onClick={handleSubmit}
                className="inline-flex h-11 min-w-24 items-center justify-center rounded-[8px] bg-[#4876EF] px-5 text-[14px] font-semibold text-white transition-colors disabled:bg-[#DDE7FF] hover:enabled:bg-[#3F68D8]"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "수정하기"
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
