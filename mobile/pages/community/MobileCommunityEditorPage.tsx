"use client";

import type { BoardType, StudyStatus } from "@/app/api/community/types";
import RichTextEditor from "@/components/community/RichTextEditor";
import { Info, Loader2, X } from "lucide-react";
import { useState } from "react";

export type MobileCommunityCategoryOption = {
  label: string;
  boardType: BoardType;
  studyStatus: StudyStatus;
  emoji: string;
  color: string;
  bg: string;
};

type MobileCommunityEditorPageProps = {
  mode: "write" | "edit";
  category: string;
  title: string;
  content: string;
  categoryOptions: MobileCommunityCategoryOption[];
  plainContentLength: number;
  maxContentLength: number;
  canSubmit: boolean;
  isSubmitting: boolean;
  errorMessage?: string;
  onCategoryChange: (category: string) => void;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onImageUpload: (file: File) => Promise<string>;
  onSubmit: () => void;
  onCancel?: () => void;
};

const guideItems = [
  {
    title: "카테고리를 먼저 선택해주세요",
    body: "글 성격에 맞는 카테고리를 고르면 다른 사용자가 더 쉽게 찾을 수 있어요.",
  },
  {
    title: "제목은 핵심이 보이게 작성해주세요",
    body: "자격증명, 상황, 질문 포인트를 짧게 담으면 답변과 조회가 더 잘 이어집니다.",
  },
  {
    title: "개인정보와 민감한 정보는 제외해주세요",
    body: "전화번호, 이메일, 수험번호, 결제 내역, 회사 문서 등은 공개하지 않는 것이 좋아요.",
  },
];

export function MobileCommunityEditorSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[430px] flex-col gap-3 pb-24">
      <div className="h-6 w-32 animate-pulse rounded bg-[#EEF2F7]" />
      <div className="h-24 animate-pulse rounded-[8px] bg-white" />
      <div className="h-12 animate-pulse rounded-[8px] bg-white" />
      <div className="h-80 animate-pulse rounded-[8px] bg-white" />
    </div>
  );
}

export function MobileCommunityEditorAccessDenied({
  onBack,
}: {
  onBack: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-[430px] pb-8">
      <div className="rounded-[8px] border border-[#E5E8EB] bg-white px-5 py-10 text-center">
        <p className="text-[15px] font-semibold text-[#252A32]">
          수정 권한이 없어요.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-5 min-h-10 rounded-[8px] bg-[#4876EF] px-4 text-[13px] font-semibold text-white"
        >
          게시글로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default function MobileCommunityEditorPage({
  mode,
  category,
  title,
  content,
  categoryOptions,
  plainContentLength,
  maxContentLength,
  canSubmit,
  isSubmitting,
  errorMessage,
  onCategoryChange,
  onTitleChange,
  onContentChange,
  onImageUpload,
  onSubmit,
  onCancel,
}: MobileCommunityEditorPageProps) {
  const [guideOpen, setGuideOpen] = useState(false);
  const isEdit = mode === "edit";

  return (
    <div className="mx-auto flex w-full max-w-[430px] flex-col gap-4 pb-[7.5rem]">
      <section className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[12px] font-semibold text-[#4876EF]">커뮤니티</p>
            <h1 className="mt-1 text-[20px] font-semibold tracking-tight text-[#252A32]">
              {isEdit ? "글 수정하기" : "글 작성하기"}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            className="flex min-h-9 items-center gap-1.5 rounded-[8px] border border-[#E5E8EB] px-3 text-[12px] font-medium text-[#667085]"
          >
            <Info className="h-3.5 w-3.5" />
            가이드
          </button>
        </div>
      </section>

      <section className="rounded-[8px] border border-[#E5E8EB] bg-white px-4 py-4">
        <p className="text-[13px] font-semibold text-[#252A32]">카테고리</p>
        <div className="mt-3 flex snap-x gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categoryOptions.map((option) => {
            const active = category === option.label;

            return (
              <button
                key={option.label}
                type="button"
                onClick={() => onCategoryChange(option.label)}
                className={`min-h-10 shrink-0 snap-start rounded-[8px] border px-3 text-[12px] font-semibold ${
                  active
                    ? "border-[#4876EF] bg-[#EEF4FF] text-[#4876EF]"
                    : "border-[#E5E8EB] bg-white text-[#667085]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <label className="mt-4 block">
          <span className="text-[13px] font-semibold text-[#252A32]">제목</span>
          <input
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="제목을 입력해주세요"
            className="mt-2 h-12 w-full rounded-[8px] border border-[#E5E8EB] bg-[#F7F9FB] px-3 text-[14px] font-medium text-[#252A32] outline-none placeholder:text-[#A0AEC0] focus:border-[#4876EF]"
          />
        </label>
      </section>

      <section className="overflow-hidden rounded-[8px] border border-[#E5E8EB] bg-white">
        <div className="border-b border-[#E5E8EB] px-4 py-3">
          <p className="text-[13px] font-semibold text-[#252A32]">본문</p>
        </div>
        <div className="px-3 pb-3 [&_.rich-text-editor]:min-h-[220px] [&_.rich-text-editor]:py-3 [&_.rich-text-editor]:text-[15px] [&_.rich-text-editor]:leading-[1.7] [&_.sticky]:static [&_.sticky]:mb-1 [&_.sticky]:min-h-0 [&_.sticky]:py-2">
          <RichTextEditor
            value={content}
            onChange={onContentChange}
            placeholder="공유하고 싶은 이야기가 있나요?"
            onImageUpload={onImageUpload}
          />
        </div>
      </section>

      {errorMessage && (
        <p className="px-1 text-[12px] font-medium text-[#EF4444]">
          {errorMessage}
        </p>
      )}

      <div className="fixed inset-x-0 bottom-[calc(3.75rem+env(safe-area-inset-bottom))] z-[80] border-t border-[#E5E8EB] bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex w-full max-w-[430px] items-center gap-3">
          <span
            className={`shrink-0 text-[12px] font-semibold ${
              plainContentLength > maxContentLength
                ? "text-[#EF4444]"
                : "text-[#8A94A6]"
            }`}
          >
            {plainContentLength}/{maxContentLength}
          </span>
          {isEdit && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="min-h-11 rounded-[8px] border border-[#E5E8EB] px-4 text-[13px] font-semibold text-[#667085]"
            >
              취소
            </button>
          )}
          <button
            type="button"
            disabled={!canSubmit}
            onClick={onSubmit}
            className="flex min-h-11 flex-1 items-center justify-center rounded-[8px] bg-[#4876EF] text-[14px] font-semibold text-white disabled:bg-[#CBD8FF]"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isEdit ? (
              "수정하기"
            ) : (
              "작성하기"
            )}
          </button>
        </div>
      </div>

      {guideOpen && (
        <div
          className="fixed inset-0 z-[130] flex items-end bg-black/35 px-3 pb-3"
          role="dialog"
          aria-modal="true"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setGuideOpen(false);
          }}
        >
          <div className="w-full rounded-[8px] bg-white px-4 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[17px] font-semibold text-[#252A32]">
                글쓰기 가이드
              </h2>
              <button
                type="button"
                onClick={() => setGuideOpen(false)}
                className="flex h-8 w-8 items-center justify-center text-[#667085]"
                aria-label="가이드 닫기"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {guideItems.map((item, index) => (
                <section key={item.title} className="rounded-[8px] bg-[#F7F9FB] px-3 py-3">
                  <h3 className="text-[13px] font-semibold text-[#252A32]">
                    {index + 1}. {item.title}
                  </h3>
                  <p className="mt-1 text-[12px] leading-[1.55] text-[#667085]">
                    {item.body}
                  </p>
                </section>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setGuideOpen(false)}
              className="mt-4 min-h-11 w-full rounded-[8px] bg-[#4876EF] text-[14px] font-semibold text-white"
            >
              확인했어요
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
