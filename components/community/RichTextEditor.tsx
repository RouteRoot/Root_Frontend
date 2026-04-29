"use client";

import {
  Bold,
  Highlighter,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Palette,
  Quote,
  Smile,
  Type,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

type ToolButtonProps = {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
};

const EMOJIS = [
  "\u{1F600}",
  "\u{1F44D}",
  "\u{1F525}",
  "\u{1F389}",
  "\u{1F4AA}",
  "\u{1F4DA}",
  "\u{1F4AF}",
  "\u{2728}",
];

function runCommand(command: string, value?: string) {
  document.execCommand(command, false, value);
}

function stripDangerousHtml(html: string) {
  if (typeof window === "undefined") return html;

  const template = document.createElement("template");
  template.innerHTML = html;

  template.content
    .querySelectorAll("script, iframe, object, embed, form, input, button")
    .forEach((node) => node.remove());

  template.content.querySelectorAll("*").forEach((node) => {
    [...node.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim().toLowerCase();

      if (name.startsWith("on")) node.removeAttribute(attr.name);
      if (
        (name === "href" || name === "src") &&
        value.startsWith("javascript:")
      ) {
        node.removeAttribute(attr.name);
      }
    });
  });

  return template.innerHTML;
}

function ToolButton({ label, onClick, children }: ToolButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-md text-[#7B8798] transition-colors hover:bg-[#F3F6FA] hover:text-[#333333]"
    >
      {children}
    </button>
  );
}

export function sanitizeRichText(html: string) {
  return stripDangerousHtml(html);
}

export function getRichTextPlainText(html: string) {
  if (typeof window === "undefined") {
    return html.replace(/<[^>]*>/g, "").trim();
  }

  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content.textContent?.trim() ?? "";
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "내용을 입력하세요",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [emojiOpen, setEmojiOpen] = useState(false);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    if (editor.innerHTML !== value) {
      editor.innerHTML = value;
    }
  }, [value]);

  const emitChange = () => {
    const html = editorRef.current?.innerHTML ?? "";
    onChange(sanitizeRichText(html));
  };

  const applyCommand = (command: string, commandValue?: string) => {
    editorRef.current?.focus();
    runCommand(command, commandValue);
    emitChange();
  };

  const applyLink = () => {
    const url = window.prompt("링크 URL을 입력하세요");
    if (!url?.trim()) return;
    applyCommand("createLink", url.trim());
  };

  return (
    <div className="w-full">
      <div className="mb-2 flex min-h-14 flex-wrap items-center gap-1 border-b border-[#E5E8EB] py-2">
        <ToolButton label="굵게" onClick={() => applyCommand("bold")}>
          <Bold className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="기울임" onClick={() => applyCommand("italic")}>
          <Italic className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="밑줄" onClick={() => applyCommand("underline")}>
          <span className="text-[14px] font-medium leading-none underline underline-offset-2">
            U
          </span>
        </ToolButton>

        <span className="mx-1 h-5 w-px bg-[#E1E6EE]" />

        <label
          className="flex h-8 items-center gap-1 rounded-md px-2 text-[#7B8798] transition-colors hover:bg-[#F3F6FA] hover:text-[#333333]"
          title="글자 크기"
        >
          <Type className="h-4 w-4" />
          <select
            defaultValue=""
            onChange={(event) => {
              if (!event.target.value) return;
              applyCommand("fontSize", event.target.value);
              event.target.value = "";
            }}
            className="bg-transparent text-[12px] font-semibold outline-none"
            aria-label="글자 크기"
          >
            <option value="" disabled>
              크기
            </option>
            <option value="3">본문</option>
            <option value="4">중간</option>
            <option value="5">크게</option>
          </select>
        </label>

        <label
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[#7B8798] transition-colors hover:bg-[#F3F6FA] hover:text-[#333333]"
          title="글자 색"
        >
          <Palette className="h-4 w-4" />
          <input
            type="color"
            className="sr-only"
            onChange={(event) => applyCommand("foreColor", event.target.value)}
            aria-label="글자 색"
          />
        </label>
        <label
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[#7B8798] transition-colors hover:bg-[#F3F6FA] hover:text-[#333333]"
          title="배경 색"
        >
          <Highlighter className="h-4 w-4" />
          <input
            type="color"
            className="sr-only"
            onChange={(event) => applyCommand("hiliteColor", event.target.value)}
            aria-label="배경 색"
          />
        </label>

        <span className="mx-1 h-5 w-px bg-[#E1E6EE]" />

        <ToolButton
          label="글머리 목록"
          onClick={() => applyCommand("insertUnorderedList")}
        >
          <List className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="번호 목록"
          onClick={() => applyCommand("insertOrderedList")}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="인용"
          onClick={() => applyCommand("formatBlock", "blockquote")}
        >
          <Quote className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="링크" onClick={applyLink}>
          <LinkIcon className="h-4 w-4" />
        </ToolButton>

        <div className="relative">
          <ToolButton
            label="이모티콘"
            onClick={() => setEmojiOpen((open) => !open)}
          >
            <Smile className="h-4 w-4" />
          </ToolButton>
          {emojiOpen && (
            <div className="absolute left-0 top-10 z-20 grid grid-cols-4 gap-1 rounded-lg border border-[#E5E8EB] bg-white p-2 shadow-[0_8px_24px_rgba(15,23,42,0.10)]">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    applyCommand("insertText", emoji);
                    setEmojiOpen(false);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-[18px] hover:bg-[#F3F6FA]"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={emitChange}
        onBlur={emitChange}
        className="rich-text-editor min-h-80 w-full bg-transparent py-1 text-[17px] leading-[1.8] text-[#333333] outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-[#B8C0CC]"
      />
    </div>
  );
}
