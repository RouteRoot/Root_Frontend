"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadPostImage } from "@/app/api/community/image";
import CertificateWikiSubNav from "@/components/certificate/CertificateWikiSubNav";
import { useWikiEditorAccess } from "@/components/certificate/useWikiEditorAccess";
import RichTextEditor, {
  getRichTextPlainText,
} from "@/components/community/RichTextEditor";

const DRAFT_KEY = "bburi:wiki:draft";

type WikiDraft = {
  category: string;
  title: string;
  content: string;
};

export default function CertificateWikiWritePage() {
  const router = useRouter();
  const { isChecking, isEditor } = useWikiEditorAccess();
  const [draft, setDraft] = useState<WikiDraft>(() => {
    if (typeof window === "undefined") {
      return { category: "", title: "", content: "" };
    }

    const rawDraft = localStorage.getItem(DRAFT_KEY);
    if (!rawDraft) return { category: "", title: "", content: "" };

    try {
      const savedDraft = JSON.parse(rawDraft) as Partial<WikiDraft>;
      return {
        category: savedDraft.category ?? "",
        title: savedDraft.title ?? "",
        content: savedDraft.content ?? "",
      };
    } catch {
      localStorage.removeItem(DRAFT_KEY);
      return { category: "", title: "", content: "" };
    }
  });
  const [savedAt, setSavedAt] = useState("");

  const plainContent = useMemo(
    () => getRichTextPlainText(draft.content),
    [draft.content]
  );
  const canSaveDraft = draft.title.trim().length > 0 || plainContent.length > 0;

  const handleSaveDraft = () => {
    const nextDraft: WikiDraft = {
      category: draft.category.trim(),
      title: draft.title.trim(),
      content: draft.content.trim(),
    };

    localStorage.setItem(DRAFT_KEY, JSON.stringify(nextDraft));
    setSavedAt(
      new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  if (isChecking) {
    return (
      <div>
        <CertificateWikiSubNav />
        <main className="mx-auto w-full max-w-185 pb-28 pt-14">
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
        <main className="mx-auto w-full max-w-185 py-24 text-center">
          <p className="text-[16px] font-medium text-[#333333]">
            bburi 에디터만 위키를 작성할 수 있어요.
          </p>
          <p className="mt-2 text-[13px] text-[#8A94A6]">
            현재 계정의 닉네임이 bburi 에디터인지 확인해주세요.
          </p>
          <button
            type="button"
            onClick={() => router.push("/certificate/wiki")}
            className="mt-6 h-10 rounded-[8px] border border-[#DDE2EA] px-5 text-[14px] font-medium text-[#667085] transition-colors hover:border-[#BFD0FF] hover:text-[#4876EF]"
          >
            위키로 돌아가기
          </button>
        </main>
      </div>
    );
  }

  return (
    <div>
      <CertificateWikiSubNav />
      <main className="mx-auto flex min-h-[calc(100vh-180px)] w-full max-w-185 flex-col pb-28 pt-12">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-medium text-[#4876EF]">
              bburi Wiki
            </p>
            <h1 className="mt-1 text-[22px] font-semibold tracking-[-0.03em] text-[#333333]">
              위키 작성
            </h1>
          </div>

          <p className="text-[13px] text-[#8A94A6]">
            저장 API 연결 전까지는 임시 저장만 가능합니다.
          </p>
        </div>

        <section className="mt-10">
          <div className="grid grid-cols-[220px_minmax(0,1fr)] gap-3">
            <input
              value={draft.category}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  category: event.target.value,
                }))
              }
              placeholder="카테고리"
              className="h-12 rounded-[8px] border border-[#DDE2EA] bg-white px-4 text-[15px] font-normal text-[#333333] outline-none transition-colors placeholder:text-[#B8C0CC] focus:border-[#4876EF]"
            />
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
              placeholder="위키 내용을 작성해주세요."
              onImageUpload={async (file) => {
                const result = await uploadPostImage(file);
                return result.imageUrl;
              }}
            />
          </div>
        </section>

        <div className="fixed inset-x-0 bottom-0 border-t border-[#E5E8EB] bg-white">
          <div className="mx-auto flex h-18 w-full max-w-185 items-center justify-between">
            <span className="text-[13px] text-[#8A94A6]">
              {savedAt ? `${savedAt} 임시 저장됨` : "작성 중인 글은 이 브라우저에만 임시 저장됩니다."}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/certificate/wiki")}
                className="h-11 rounded-[8px] border border-[#DDE2EA] px-5 text-[14px] font-medium text-[#667085] transition-colors hover:bg-[#F8FAFC]"
              >
                취소
              </button>
              <button
                type="button"
                disabled={!canSaveDraft}
                onClick={handleSaveDraft}
                className="inline-flex h-11 min-w-24 items-center justify-center rounded-[8px] bg-[#4876EF] px-5 text-[14px] font-semibold text-white transition-colors disabled:bg-[#DDE7FF] hover:enabled:bg-[#3F68D8]"
              >
                임시 저장
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
