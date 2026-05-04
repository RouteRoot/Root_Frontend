"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Info, Loader2, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getPostDetail, updatePost } from "@/app/api/community/post";
import { uploadPostImage } from "@/app/api/community/image";
import type { BoardType, StudyStatus } from "@/app/api/community/types";
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
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const postId = Number(params.id);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [guideOpen, setGuideOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function loadPost() {
      try {
        const post = await getPostDetail(postId);
        const matchedCategory = CATEGORY_OPTIONS.find(
          (opt) => opt.label === post.category
        );
        setCategory(matchedCategory?.label ?? "");
        setTitle(post.title);
        setContent(post.content.trim());
      } catch {
        setErrorMessage("寃뚯떆湲??遺덈윭?ㅼ? 紐삵뻽?댁슂.");
      } finally {
        setIsLoading(false);
      }
    }

    if (Number.isFinite(postId)) loadPost();
  }, [postId]);

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
    !isSubmitting;

  const handleSubmit = async () => {
    if (!selectedCategory || !canSubmit) return;

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await updatePost(postId, {
        title: title.trim(),
        content: content.trim(),
        boardType: selectedCategory.boardType,
        category: selectedCategory.label,
        studyStatus: selectedCategory.studyStatus,
      });

      router.push(`/community/${postId}`);
    } catch {
      setErrorMessage("寃뚯떆湲 ?섏젙???ㅽ뙣?덉뼱?? ?좎떆 ???ㅼ떆 ?쒕룄?댁＜?몄슂.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-185 flex-col pb-28 pt-12">
        <div className="h-5 w-24 animate-pulse rounded bg-[#EEF2F7]" />
        <div className="mt-10 h-12 animate-pulse rounded-lg bg-[#EEF2F7]" />
        <div className="mt-3 h-12 animate-pulse rounded-lg bg-[#F3F6FA]" />
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-185 flex-col pb-28 pt-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[17px] font-black tracking-tight text-[#4876EF]">
            BBURI
          </span>
          <span className="text-[15px] font-medium text-[#7B8798]">
            而ㅻ??덊떚 湲 ?섏젙
          </span>
        </div>

        <button
          type="button"
          onClick={() => setGuideOpen(true)}
          className="flex items-center gap-1.5 text-[13px] font-semibold text-[#8A94A6] transition-colors hover:text-[#4876EF]"
        >
          ?댁슜 媛?대뱶
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
                <span className="text-[15px] font-normal text-[#B8C0CC]">移댄뀒怨좊━ ?좏깮</span>
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
            placeholder="?쒕ぉ???낅젰?댁＜?몄슂"
            className="h-12 rounded-lg border border-[#DDE2EA] bg-white px-4 text-[15px] font-medium text-[#333333] outline-none transition-colors placeholder:text-[#B8C0CC] focus:border-[#4876EF]"
          />
        </div>

        <div className="mt-6 border-t border-[#E5E8EB]">
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="怨듭쑀?섍퀬 ?띠? ?댁빞湲곌? ?덈굹??"
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
        <div className="mx-auto flex h-18 w-full max-w-185 items-center justify-end">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push(`/community/${postId}`)}
              className="flex h-12 w-20 items-center justify-center rounded-lg border border-[#DDE2EA] text-[15px] font-bold text-[#7B8798] transition-colors hover:bg-[#F3F6FA]"
            >
              痍⑥냼
            </button>
            <div className="flex items-center gap-4">
              <span className="text-[15px] font-semibold text-[#9AA3B2]">
                {plainContent.length}/{MAX_CONTENT_LENGTH}
              </span>
              <button
                type="button"
                disabled={!canSubmit}
                onClick={handleSubmit}
                className="flex h-12 w-28 items-center justify-center rounded-lg bg-[#4876EF] text-[15px] font-bold text-white transition-colors disabled:bg-[#DDE7FF] hover:enabled:bg-[#3F68D8]"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "?섏젙?섍린"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {guideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="community-edit-guide-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setGuideOpen(false);
          }}
        >
          <div className="w-full max-w-130 rounded-2xl border border-[#E5E8EB] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.14)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[13px] font-semibold text-[#4876EF]">而ㅻ??덊떚</p>
                <h2
                  id="community-edit-guide-title"
                  className="mt-1 text-[20px] font-semibold tracking-tight text-[#333333]"
                >
                  湲?곌린 ?댁슜 媛?대뱶
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setGuideOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#94A3B8] transition-colors hover:bg-[#F3F6FA] hover:text-[#333333]"
                aria-label="?댁슜 媛?대뱶 ?リ린"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 space-y-5 text-[14px] leading-[1.75] text-[#575757]">
              <section>
                <h3 className="font-semibold text-[#333333]">1. 移댄뀒怨좊━瑜?癒쇱? ?좏깮?댁＜?몄슂</h3>
                <p className="mt-1">?먯쑀, ?ㅽ꽣??紐⑥쭛, ?먭꺽利??꾧린, 吏덈Ц/怨좊?, ?뺣낫怨듭쑀 以?湲 ?깃꺽??媛??媛源뚯슫 移댄뀒怨좊━瑜??좏깮?섎㈃ ?ㅻⅨ ?ъ슜?먭? ???쎄쾶 湲??李얠쓣 ???덉뼱??</p>
              </section>
              <section>
                <h3 className="font-semibold text-[#333333]">2. ?쒕ぉ? ?듭떖??蹂댁씠寃??묒꽦?댁＜?몄슂</h3>
                <p className="mt-1">?덈? ?ㅼ뼱 SQLD 2二??⑷꺽 ?꾧린, 而댄솢 1湲??ㅺ린 ?⑥닔 吏덈Ц泥섎읆 ?먭꺽利앸챸怨??곹솴???④퍡 ?곸쑝硫??듬?怨?議고쉶媛 ?????댁뼱吏묐땲??</p>
              </section>
              <section>
                <h3 className="font-semibold text-[#333333]">3. 媛쒖씤?뺣낫? 誘쇨컧???뺣낫???쒖쇅?댁＜?몄슂</h3>
                <p className="mt-1">?꾪솕踰덊샇, ?대찓?? ?ㅻ챸, ?숆탳/?뚯궗 ?대??먮즺, ?쒗뿕 臾몄젣 ?먮Ц ??怨듦컻?섎㈃ 怨ㅻ????뺣낫???묒꽦?섏? ?딅뒗 寃껋씠 醫뗭븘??</p>
              </section>
              <section>
                <h3 className="font-semibold text-[#333333]">4. ?대?吏 泥⑤? ???뺤씤?댁＜?몄슂</h3>
                <p className="mt-1">?대?吏?먮뒗 媛쒖씤?뺣낫, ?섑뿕??踰덊샇, 寃곗젣 ?댁뿭, ?뚯궗 臾몄꽌媛 蹂댁씠吏 ?딅룄濡?媛?ㅼ＜?몄슂.</p>
              </section>
              <section>
                <h3 className="font-semibold text-[#333333]">5. 광고와 비방 글은 제한될 수 있어요</h3>
                <p className="mt-1">臾닿????띾낫, 諛섎났 寃뚯떆, ?뱀젙??鍮꾨갑, ?먯삤 ?쒗쁽, ?덉쐞 ?뺣낫??愿由ъ옄 ?뺤씤 ???④? ?먮뒗 ??젣?????덉뒿?덈떎.</p>
              </section>
            </div>

            <button
              type="button"
              onClick={() => setGuideOpen(false)}
              className="mt-7 h-11 w-full rounded-lg bg-[#4876EF] text-[14px] font-semibold text-white transition-colors hover:bg-[#3F68D8]"
            >
              ?뺤씤?덉뼱??            </button>
          </div>
        </div>
      )}
    </main>
  );
}
