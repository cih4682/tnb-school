"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { supabase } from "@/lib/supabase";
import { useRef } from "react";

interface Props {
  content?: string;
  onChange?: (html: string) => void;
  editable?: boolean;
}

export function Editor({ content = "", onChange, editable = true }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "내용을 입력하세요..." }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none min-h-[300px] px-4 py-3 outline-none focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  async function handleImageUpload() {
    fileRef.current?.click();
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const ext = file.name.split(".").pop();
    const path = `community/${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from("images").upload(path, file);
    if (error) {
      alert("이미지 업로드에 실패했습니다.");
      return;
    }

    const { data } = supabase.storage.from("images").getPublicUrl(path);
    editor.chain().focus().setImage({ src: data.publicUrl }).run();
    e.target.value = "";
  }

  if (!editable) {
    return (
      <div className="prose prose-slate max-w-none">
        <EditorContent editor={editor} />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      {/* 툴바 */}
      <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 px-3 py-2">
        <ToolBtn
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          label="B"
          className="font-bold"
        />
        <ToolBtn
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          label="I"
          className="italic"
        />
        <ToolBtn
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          label="S"
          className="line-through"
        />
        <div className="mx-1 w-px bg-slate-200" />
        <ToolBtn
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          label="H2"
        />
        <ToolBtn
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          label="H3"
        />
        <div className="mx-1 w-px bg-slate-200" />
        <ToolBtn
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          label="•"
        />
        <ToolBtn
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          label="1."
        />
        <div className="mx-1 w-px bg-slate-200" />
        <ToolBtn
          active={false}
          onClick={() => {
            const url = window.prompt("링크 URL을 입력하세요:");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          label="🔗"
        />
        <ToolBtn active={false} onClick={handleImageUpload} label="🖼️" />
      </div>

      <EditorContent editor={editor} />

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
}

function ToolBtn({
  active,
  onClick,
  label,
  className = "",
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-8 min-w-[32px] items-center justify-center rounded-lg px-2 text-sm transition ${
        active
          ? "bg-slate-900 text-white"
          : "text-slate-600 hover:bg-slate-200"
      } ${className}`}
    >
      {label}
    </button>
  );
}
