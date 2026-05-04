"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ImageIcon, Info, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPost } from "@/app/api/community/post";
import { uploadPostImage } from "@/app/api/community/image";
import type { BoardType, StudyStatus } from "@/app/api/community/types";
import AuthenticatedImage from "@/components/community/AuthenticatedImage";
import RichTextEditor, {
  getRichTextPlainText,
} from "@/components/community/RichTextEditor";

type CategoryOption = {
  label: string;
  boardType: BoardType;
  studyStatus: StudyStatus;
  emoji: string;
  color: string;
  bg: string;
};

const MAX_CONTENT_LENGTH = 2000;

const CATEGORY_OPTIONS: CategoryOption[] = [
  { label: "뿌리 PICK", boardType: "FREE", studyStatus: null, emoji: "⭐", color: "text-[#4876EF]", bg: "bg-[#EEF3FF]" },
  { label: "자유", boardType: "FREE", studyStatus: null, emoji: "💬", color: "text-[#10B981]", bg: "bg-[#ECFDF5]" },
  { label: "스터디 모집", boardType: "STUDY", studyStatus: "RECRUITING", emoji: "📚", color: "text-[#F59E0B]", bg: "bg-[#FFFBEB]" },
  { label: "자격증 후기", boardType: "FREE", studyStatus: null, emoji: "🏆", color: "text-[#8B5CF6]", bg: "bg-[#F5F3FF]" },
  { label: "질문/고민", boardType: "FREE", studyStatus: null, emoji: "🙋", color: "text-[#EF4444]", bg: "bg-[#FEF2F2]" },
  { label: "정보공유", boardType: "FREE", studyStatus: null, emoji: "📢", color: "text-[#0EA5E9]", bg: "bg-[#F0F9FF]" },
];

export default function Page() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedCategory = useMemo(
    () => CATEGORY_OPTIONS.find((option) => option.label === category),
    [category]
  );
  const plainContent = getRichTextPlainText(content);

  const canSubmit =
    Boolean(selectedCategory) &&
    title.trim().length > 0 &&
    plainContent.length > 0 &&
    plainContent.length <= MAX_CONTENT_LENGTH &&
    !isSubmitting &&
    !isUploading;

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setErrorMessage("");
      const result = await uploadPostImage(file);
      setImageUrl(result.imageUrl);
    } catch {
      setErrorMessage("이미지 업로드에 실패했어요.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!selectedCategory || !canSubmit) return;

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const contentWithImage = imageUrl
        ? `${content.trim()}\n\n<img src="${imageUrl}" alt="" />`
        : content.trim();

      const post = await createPost({
        title: title.trim(),
        content: contentWithImage,
        boardType: selectedCategory.boardType,
        category: selectedCategory.label,
        studyStatus: selectedCategory.studyStatus,
      });

      router.push(`/community/${post.postId}`);
    } catch {
      setErrorMessage("게시글 작성에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-185 flex-col pb-28 pt-16">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[17px] font-black tracking-tight text-[#4876EF]">
            BBURI
          </span>
          <span className="text-[15px] font-medium text-[#7B8798]">
            커뮤니티 글쓰기
          </span>
        </div>

        <button
          type="button"
          onClick={() => setGuideOpen(true)}
          className="flex items-center gap-1.5 text-[13px] font-semibold text-[#8A94A6] transition-colors hover:text-[#4876EF]"
        >
          이용 가이드
          <Info className="h-3.5 w-3.5" />
        </button>
      </div>

      <section className="mt-12">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[240px_minmax(0,1fr)]">
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className={`flex h-12 w-full items-center justify-between rounded-lg border bg-white px-4 text-[15px] font-medium outline-none transition-colors ${dropdownOpen ? "border-[#4876EF]" : "border-[#DDE2EA]"}`}
            >
              {selectedCategory ? (
                <span className="text-[15px] font-medium text-[#333333]">
                  {selectedCategory.label}
                </span>
              ) : (
                <span className="text-[15px] font-normal text-[#B8C0CC]">카테고리 선택</span>
              )}
              <ChevronDown className={`h-4 w-4 text-[#B3BBC8] transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 top-[calc(100%+6px)] z-20 w-full overflow-hidden rounded-xl border border-[#E5E8EB] bg-white shadow-[0_8px_32px_rgba(15,23,42,0.10)]">
                <div className="p-1.5">
                  {CATEGORY_OPTIONS.map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => {
                        setCategory(option.label);
                        setDropdownOpen(false);
                      }}
                      className={`flex w-full items-center rounded-lg px-5 py-2.5 text-[16px] text-[#323438] transition-colors hover:bg-[#F3F6FA] ${category === option.label ? "bg-[#F3F6FA]" : ""}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="제목을 입력해주세요"
            className="h-12 rounded-lg border border-[#DDE2EA] bg-white px-4 text-[15px] font-medium text-[#333333] outline-none transition-colors placeholder:text-[#B8C0CC] focus:border-[#4876EF]"
          />
        </div>

        <div className="mt-6 border-t border-[#E5E8EB]">
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="공유하고 싶은 이야기가 있나요?"
          />
        </div>

        {imageUrl && (
          <div className="mt-4 overflow-hidden rounded-lg border border-[#E5E8EB] bg-[#F8F9FA]">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-[13px] font-medium text-[#667085]">
                이미지가 첨부되었습니다.
              </span>
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="text-[#94A3B8] transition-colors hover:text-[#667085]"
                aria-label="이미지 제거"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <AuthenticatedImage
              src={imageUrl}
              alt=""
              className="max-h-80 w-full border-t border-[#E5E8EB] object-contain"
            />
          </div>
        )}

        {errorMessage && (
          <p className="mt-4 text-[13px] font-medium text-[#EF4444]">
            {errorMessage}
          </p>
        )}
      </section>

      <div className="fixed inset-x-0 bottom-0 border-t border-[#E5E8EB] bg-white">
        <div className="mx-auto flex h-18 w-full max-w-185 items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-[15px] font-semibold text-[#7B8798] transition-colors hover:text-[#4876EF]"
            >
              <ImageIcon className="h-4.5 w-4.5" />
              이미지
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="flex items-center gap-9">
            <span className="text-[15px] font-semibold text-[#9AA3B2]">
              {plainContent.length}/{MAX_CONTENT_LENGTH}
            </span>
            <button
              type="button"
              disabled={!canSubmit}
              onClick={handleSubmit}
              className="flex h-12 w-28 items-center justify-center rounded-lg bg-[#4876EF] text-[15px] font-bold text-white transition-colors disabled:bg-[#DDE7FF] disabled:text-white hover:enabled:bg-[#3F68D8]"
            >
              {isSubmitting || isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "작성하기"
              )}
            </button>
          </div>
        </div>
      </div>

      {guideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="community-write-guide-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setGuideOpen(false);
          }}
        >
          <div className="w-full max-w-130 rounded-2xl border border-[#E5E8EB] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.14)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[13px] font-semibold text-[#4876EF]">
                  커뮤니티
                </p>
                <h2
                  id="community-write-guide-title"
                  className="mt-1 text-[20px] font-semibold tracking-tight text-[#333333]"
                >
                  글쓰기 이용 가이드
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setGuideOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#94A3B8] transition-colors hover:bg-[#F3F6FA] hover:text-[#333333]"
                aria-label="이용 가이드 닫기"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 space-y-5 text-[14px] leading-[1.75] text-[#575757]">
              <section>
                <h3 className="font-semibold text-[#333333]">
                  1. 카테고리를 먼저 선택해주세요
                </h3>
                <p className="mt-1">
                  자유, 스터디 모집, 자격증 후기, 질문/고민, 정보공유 중 글
                  성격에 가장 가까운 카테고리를 선택하면 다른 사용자가 더 쉽게
                  글을 찾을 수 있어요.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-[#333333]">
                  2. 제목은 핵심이 보이게 작성해주세요
                </h3>
                <p className="mt-1">
                  예를 들어 “SQLD 2주 합격 후기”, “컴활 1급 실기 함수 질문”
                  처럼 자격증명과 상황을 함께 적으면 답변과 조회가 더 잘
                  이어집니다.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-[#333333]">
                  3. 개인정보와 민감한 정보는 제외해주세요
                </h3>
                <p className="mt-1">
                  전화번호, 이메일, 실명, 학교/회사 내부자료, 시험 문제 원문 등
                  공개되면 곤란한 정보는 작성하지 않는 것이 좋아요.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-[#333333]">
                  4. 이미지 첨부 전 확인해주세요
                </h3>
                <p className="mt-1">
                  이미지에는 개인정보, 수험표 번호, 결제 내역, 회사 문서가
                  보이지 않도록 가려주세요. 첨부한 이미지는 게시글 본문에 함께
                  표시됩니다.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-[#333333]">
                  5. 광고와 비방 글은 제한될 수 있어요
                </h3>
                <p className="mt-1">
                  무관한 홍보, 반복 게시, 특정인 비방, 혐오 표현, 허위 정보는
                  관리자 확인 후 숨김 또는 삭제될 수 있습니다.
                </p>
              </section>
            </div>

            <button
              type="button"
              onClick={() => setGuideOpen(false)}
              className="mt-7 h-11 w-full rounded-lg bg-[#4876EF] text-[14px] font-semibold text-white transition-colors hover:bg-[#3F68D8]"
            >
              확인했어요
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
