"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ExternalLink,
  Instagram,
  MessageCircle,
  Play,
  X,
} from "lucide-react";
import AboutCompanyModal from "@/components/common/AboutCompanyModal";

type FooterModalKey =
  | "company"
  | "terms"
  | "privacy"
  | "review"
  | "notice"
  | "partnership"
  | "support"
  | "faq"
  | "social";

type FooterModalContent = {
  title: string;
  body: string[];
};

const kakaoOpenChatUrl = "https://open.kakao.com/o/gweuzmti";

const modalContent: Record<FooterModalKey, FooterModalContent> = {
  company: {
    title: "회사소개",
    body: [
      "bburi는 자격증 탐색, 로드맵 설계, 학습 계획 관리를 한곳에서 이어갈 수 있도록 만든 자격증 학습 지원 서비스입니다.",
      "사용자가 필요한 자격증 정보를 더 빠르게 찾고, 오늘 해야 할 학습을 놓치지 않도록 돕는 것을 목표로 합니다.",
      "개발자: 권민서, 김성민, 박준서, 조은",
    ],
  },
  terms: {
    title: "이용약관",
    body: [
      "bburi를 이용하는 사용자는 서비스가 제공하는 자격증 정보, 로드맵, 학습 계획 기능을 개인 학습 목적으로 사용할 수 있습니다.",
      "사용자는 타인의 권리를 침해하거나 서비스 운영을 방해하는 행위를 해서는 안 됩니다.",
      "서비스 내 정보는 학습 편의를 위해 제공되며, 시험 일정과 접수 정보는 반드시 공식 기관 공지를 함께 확인해야 합니다.",
    ],
  },
  privacy: {
    title: "개인정보처리방침",
    body: [
      "bburi는 회원가입, 로그인, 학습 계획 저장, 커뮤니티 이용을 위해 필요한 최소한의 개인정보를 처리합니다.",
      "수집된 정보는 서비스 제공, 사용자 식별, 문의 응대, 서비스 개선 목적으로만 사용됩니다.",
      "사용자는 언제든지 개인정보 열람, 정정, 삭제를 요청할 수 있으며 문의는 카카오톡 오픈채팅방을 통해 접수할 수 있습니다.",
    ],
  },
  review: {
    title: "리뷰 운영 정책",
    body: [
      "리뷰와 커뮤니티 게시글은 자격증 학습 경험을 공유하기 위한 공간입니다.",
      "광고, 혐오, 비방, 허위 정보, 개인정보 노출, 시험 부정행위 유도 내용은 사전 안내 없이 제한될 수 있습니다.",
      "사용자의 실제 학습 경험과 도움이 되는 정보를 중심으로 작성해 주세요.",
    ],
  },
  notice: {
    title: "공지사항",
    body: [
      "bburi의 기능 업데이트, 점검 일정, 서비스 변경 사항은 공지사항을 통해 안내됩니다.",
      "현재 별도 공지 링크는 준비 중이며, 주요 안내는 서비스 화면과 고객 문의 채널을 통해 전달됩니다.",
    ],
  },
  partnership: {
    title: "광고 및 제휴문의",
    body: [
      "자격증 교육, 학습 콘텐츠, 캠퍼스 프로그램, 커뮤니티 협업과 관련된 제휴 제안을 환영합니다.",
      "제휴 문의는 카카오톡 오픈채팅방으로 남겨주시면 운영팀이 확인 후 답변드립니다.",
    ],
  },
  support: {
    title: "고객 문의",
    body: [
      "서비스 이용 중 불편한 점, 오류 제보, 계정 관련 문의는 카카오톡 오픈채팅방으로 접수해 주세요.",
      "문의 시 사용 중인 페이지, 발생 시간, 오류 화면을 함께 알려주시면 더 빠르게 확인할 수 있습니다.",
    ],
  },
  faq: {
    title: "FAQ",
    body: [
      "Q. 자격증 정보는 어디를 기준으로 하나요? A. 공개된 자격증 정보를 바탕으로 제공하며, 최종 일정과 접수 기준은 공식 기관 안내를 확인해야 합니다.",
      "Q. 로드맵과 계획은 수정할 수 있나요? A. 사용자의 학습 상황에 맞게 언제든지 다시 생성하거나 조정할 수 있도록 개선하고 있습니다.",
      "Q. 문의는 어디로 하나요? A. footer의 카카오톡 오픈채팅방 링크를 통해 남겨주세요.",
    ],
  },
  social: {
    title: "소셜 채널",
    body: [
      "bburi의 공식 소셜 채널은 준비 중입니다.",
      "오픈되는 채널은 footer 아이콘과 공지사항을 통해 순차적으로 안내될 예정입니다.",
    ],
  },
};

const footerLinks: { label: string; key: FooterModalKey; href?: string; highlighted?: boolean }[] =
  [
    { label: "회사소개", key: "company" },
    { label: "이용약관", key: "terms", highlighted: true },
    { label: "개인정보처리방침", key: "privacy" },
    { label: "리뷰 운영 정책", key: "review" },
    { label: "공지사항", key: "notice" },
    { label: "광고 및 제휴문의", key: "partnership" },
    { label: "고객 문의", key: "support" },
    { label: "FAQ", key: "faq" },
  ];

export default function Footer() {
  const [activeModal, setActiveModal] = useState<FooterModalKey | null>(null);
  const currentModal = useMemo(
    () => (activeModal && activeModal !== "company" ? modalContent[activeModal] : null),
    [activeModal]
  );
  const isCompanyModalOpen = activeModal === "company";

  useEffect(() => {
    if (!activeModal) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveModal(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModal]);

  return (
    <>
      <footer className="border-t border-[#E1E5EA] bg-white text-[#6B7280]">
        <div className="border-b border-[#E1E5EA]">
          <div className="mx-auto flex min-h-[54px] w-full max-w-265.5 flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-0 md:py-0">
            <nav
              aria-label="footer navigation"
              className="flex flex-wrap items-center gap-y-3 text-[12px] font-normal text-[#344054]"
            >
              {footerLinks.map((item, index) => (
                <span key={item.key} className="flex items-center">
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`transition-colors hover:text-[#4876EF] ${item.highlighted ? "font-bold text-[#4876EF]" : "text-[#344054]"}`}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveModal(item.key)}
                      className={`transition-colors hover:text-[#4876EF] ${item.highlighted ? "font-bold text-[#4876EF]" : "text-[#344054]"}`}
                    >
                      {item.label}
                    </button>
                  )}
                  {index < footerLinks.length - 1 && (
                    <span className="mx-4 h-[10px] w-px bg-[#D9DDE3]" />
                  )}
                </span>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-3 md:justify-end">
              <a
                href={kakaoOpenChatUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="bburi kakao open chat"
                className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-[#C6CBD3] text-white transition-colors hover:bg-[#4876EF]"
              >
                <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={() => setActiveModal("social")}
                aria-label="bburi naver channel"
                className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-[#C6CBD3] text-[10px] font-bold text-white transition-colors hover:bg-[#4876EF]"
              >
                N
              </button>
              <button
                type="button"
                onClick={() => setActiveModal("social")}
                aria-label="bburi instagram"
                className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-[#C6CBD3] text-white transition-colors hover:bg-[#4876EF]"
              >
                <Instagram className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setActiveModal("social")}
                aria-label="bburi youtube"
                className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-[#C6CBD3] text-white transition-colors hover:bg-[#4876EF]"
              >
                <Play className="h-3 w-3 fill-current" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-265.5 flex-col px-4 py-8 md:px-0 md:py-9">
          <div className="space-y-2 text-[12px] leading-6">
            <p className="font-bold text-[#333333]">bburi</p>
            <p className="flex flex-wrap items-center gap-y-1 text-[#6B7280]">
              {[
                "주소 서울특별시 성북구 삼선교로 16길 116 한성대학교",
                "개발자 권민서, 김성민, 박준서, 조은",
                "개인정보보호책임자 권민서",
                "서비스 운영팀 bburi",
              ].map((text) => (
                <span key={text} className="flex items-center">
                  <span>{text}</span>
                  <span className="mx-3 h-[10px] w-px bg-[#D9DDE3]" />
                </span>
              ))}
              <span className="flex items-center">
                고객 문의{" "}
                <a
                  href={kakaoOpenChatUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-1 inline-flex items-center gap-1 text-[#6B7280] underline-offset-2 hover:underline"
                >
                  카카오톡 오픈채팅방
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </span>
            </p>
            <p className="text-[#9AA3AF]">
              © bburi. All rights reserved. 모든 콘텐츠의 무단 전재, 무단 수집,
              재배포 및 AI 학습 이용 금지
            </p>
          </div>
        </div>
      </footer>

      {isCompanyModalOpen && (
        <AboutCompanyModal onClose={() => setActiveModal(null)} />
      )}

      {currentModal && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/30 px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="footer-modal-title"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="max-h-[80vh] w-full max-w-[520px] overflow-hidden rounded-[8px] border border-[#E5E8EF] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EEF1F5] px-6 py-4">
              <h2
                id="footer-modal-title"
                className="text-[17px] font-bold text-[#111827]"
              >
                {currentModal.title}
              </h2>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                aria-label="닫기"
                className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[#667085] transition-colors hover:bg-[#F3F5F8] hover:text-[#111827]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="space-y-4 overflow-y-auto px-6 py-5 text-[14px] leading-7 text-[#596273]">
              {currentModal.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
