"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import FileHandler from "@tiptap/extension-file-handler";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import {
  BackgroundColor,
  Color,
  FontSize,
  TextStyle,
} from "@tiptap/extension-text-style";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Columns3,
  Combine,
  Eraser,
  Heading1,
  Heading2,
  Highlighter,
  ImageIcon,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Palette,
  Quote,
  Redo2,
  Rows3,
  Split,
  Table2,
  Trash2,
  Type,
  Undo2,
} from "lucide-react";

const TableWithWidth = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (el) =>
          (el as HTMLElement).style.width || el.getAttribute("width") || null,
        renderHTML: (attrs) =>
          attrs.width ? { style: `width: ${attrs.width}` } : {},
      },
    };
  },
});

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
};

type ToolButtonProps = {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

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

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function ToolButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: ToolButtonProps) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={label}
      aria-label={label}
      disabled={disabled}
      className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
        active
          ? "bg-[#EEF3FF] text-[#4876EF]"
          : "text-[#7B8798] hover:bg-[#F3F6FA] hover:text-[#333333]"
      }`}
    >
      {children}
    </button>
  );
}

function Separator() {
  return <span className="mx-1 h-5 w-px bg-[#E1E6EE]" />;
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
  placeholder = "내용을 입력하세요.",
  onImageUpload,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageError, setImageError] = useState("");

  const insertImageFiles = async (
    editor: Editor,
    files: File[],
    position?: number
  ) => {
    const imageFiles = files.filter((file) =>
      IMAGE_MIME_TYPES.includes(file.type)
    );
    if (!imageFiles.length) return;

    setIsUploadingImage(true);
    setImageError("");

    try {
      for (const file of imageFiles) {
        const src = onImageUpload
          ? await onImageUpload(file)
          : await fileToDataUrl(file);
        const chain = editor.chain().focus();

        if (typeof position === "number") {
          chain.insertContentAt(position, {
            type: "image",
            attrs: { src, alt: file.name, title: file.name },
          });
        } else {
          chain.setImage({ src, alt: file.name, title: file.name });
        }

        chain.run();
      }
    } catch {
      setImageError("이미지를 본문에 넣지 못했어요.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: false,
      }),
      TextStyle,
      Color,
      BackgroundColor,
      FontSize,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
      }),
      TableWithWidth.configure({
        resizable: true,
        HTMLAttributes: {
          class: "bburi-editor-table",
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-lg",
        },
        resize: {
          enabled: true,
          minWidth: 120,
          minHeight: 80,
          alwaysPreserveAspectRatio: true,
        },
      }),
      FileHandler.configure({
        allowedMimeTypes: IMAGE_MIME_TYPES,
        onPaste: (currentEditor, files) => {
          void insertImageFiles(currentEditor, files);
        },
        onDrop: (currentEditor, files, pos) => {
          void insertImageFiles(currentEditor, files, pos);
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "rich-text-editor tiptap min-h-80 w-full bg-transparent py-4 text-[17px] leading-[1.8] text-[#333333] outline-none",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(sanitizeRichText(currentEditor.getHTML()));
    },
  });

  useEffect(() => {
    if (!editor) return;

    const current = editor.getHTML();
    const next = value || "";

    if (current !== next) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="min-h-80 w-full animate-pulse rounded-lg bg-[#F7F9FB]" />
    );
  }

  const isTableActive = editor.isActive("table");

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("링크 URL을 입력하세요.", previousUrl ?? "");

    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url.trim() })
      .run();
  };

  const uploadSelectedImages = async (files: FileList | null) => {
    if (!files?.length) return;
    await insertImageFiles(editor, Array.from(files));
  };

  return (
    <div className="w-full">
      <div className="sticky top-0 z-10 mb-2 flex min-h-14 flex-wrap items-center gap-1 border-b border-[#E5E8EB] bg-white py-2">
        <ToolButton
          label="실행 취소"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="다시 실행"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo2 className="h-4 w-4" />
        </ToolButton>

        <Separator />

        <ToolButton
          label="제목 1"
          active={editor.isActive("heading", { level: 1 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="제목 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className="h-4 w-4" />
        </ToolButton>

        <label
          className="flex h-8 items-center gap-1 rounded-md px-2 text-[#7B8798] transition-colors hover:bg-[#F3F6FA] hover:text-[#333333]"
          title="글자 크기"
        >
          <Type className="h-4 w-4" />
          <select
            value={
              (editor.getAttributes("textStyle").fontSize as string | undefined) ?? ""
            }
            onChange={(event) => {
              const size = event.target.value;
              if (size) {
                editor.chain().focus().setFontSize(size).run();
              } else {
                editor.chain().focus().unsetFontSize().run();
              }
            }}
            className="w-10 bg-transparent text-[12px] font-semibold outline-none"
            aria-label="글자 크기"
          >
            <option value="">크기</option>
            <option value="12px">12</option>
            <option value="14px">14</option>
            <option value="16px">16</option>
            <option value="18px">18</option>
            <option value="20px">20</option>
            <option value="24px">24</option>
            <option value="28px">28</option>
            <option value="32px">32</option>
            <option value="36px">36</option>
            <option value="48px">48</option>
          </select>
        </label>

        <Separator />

        <ToolButton
          label="굵게"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="기울임"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="밑줄"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <span className="text-[14px] font-medium leading-none underline underline-offset-2">
            U
          </span>
        </ToolButton>

        <label
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[#7B8798] transition-colors hover:bg-[#F3F6FA] hover:text-[#333333]"
          title="글자 색"
        >
          <Palette className="h-4 w-4" />
          <input
            type="color"
            className="sr-only"
            onChange={(event) =>
              editor.chain().focus().setColor(event.target.value).run()
            }
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
            onChange={(event) =>
              editor.chain().focus().setBackgroundColor(event.target.value).run()
            }
            aria-label="배경 색"
          />
        </label>

        <Separator />

        <ToolButton
          label="왼쪽 정렬"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="가운데 정렬"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="오른쪽 정렬"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="h-4 w-4" />
        </ToolButton>

        <Separator />

        <ToolButton
          label="글머리 목록"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="번호 목록"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="인용"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="구분선"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="링크"
          active={editor.isActive("link")}
          onClick={setLink}
        >
          <LinkIcon className="h-4 w-4" />
        </ToolButton>

        <Separator />

        <ToolButton
          label="표 삽입"
          active={isTableActive}
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        >
          <Table2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="행 추가"
          disabled={!isTableActive}
          onClick={() => editor.chain().focus().addRowAfter().run()}
        >
          <Rows3 className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="열 추가"
          disabled={!isTableActive}
          onClick={() => editor.chain().focus().addColumnAfter().run()}
        >
          <Columns3 className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="표 삭제"
          disabled={!isTableActive}
          onClick={() => editor.chain().focus().deleteTable().run()}
        >
          <Trash2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="셀 병합"
          disabled={!editor.can().mergeCells()}
          onClick={() => editor.chain().focus().mergeCells().run()}
        >
          <Combine className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="셀 분할"
          disabled={!editor.can().splitCell()}
          onClick={() => editor.chain().focus().splitCell().run()}
        >
          <Split className="h-4 w-4" />
        </ToolButton>
        <label
          className={`flex h-8 items-center gap-1 rounded-md px-2 transition-colors ${
            isTableActive
              ? "text-[#7B8798] hover:bg-[#F3F6FA] hover:text-[#333333]"
              : "cursor-not-allowed opacity-45"
          }`}
          title="표 너비"
        >
          <select
            disabled={!isTableActive}
            value=""
            onChange={(e) => {
              const w = e.target.value;
              editor
                .chain()
                .focus()
                .updateAttributes("table", { width: w || null })
                .run();
              e.target.value = "";
            }}
            className="bg-transparent text-[12px] font-semibold outline-none"
            aria-label="표 너비"
          >
            <option value="" disabled>너비</option>
            <option value="25%">25%</option>
            <option value="50%">50%</option>
            <option value="75%">75%</option>
            <option value="100%">100%</option>
          </select>
        </label>

        <Separator />

        <ToolButton
          label="이미지"
          disabled={isUploadingImage}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploadingImage ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
        </ToolButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            void uploadSelectedImages(event.target.files);
            event.target.value = "";
          }}
        />

        <ToolButton
          label="서식 지우기"
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().unsetFontSize().run()
          }
        >
          <Eraser className="h-4 w-4" />
        </ToolButton>
      </div>

      <EditorContent editor={editor} />

      {imageError && (
        <p className="mt-2 text-[13px] font-medium text-[#EF4444]">
          {imageError}
        </p>
      )}
    </div>
  );
}
