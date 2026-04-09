"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Editor } from "@/components/Editor";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

const CATEGORIES = ["자유", "수업팁", "생기부", "자료공유"];

export default function WritePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("자유");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
      }
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !user) return;

    setSubmitting(true);

    const authorName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "익명";

    const { data, error } = await supabase
      .from("posts")
      .insert({
        title: title.trim(),
        content,
        category,
        author_id: user.id,
        author_name: authorName,
      })
      .select("id")
      .single();

    setSubmitting(false);

    if (error) {
      alert("글 작성에 실패했습니다: " + error.message);
      return;
    }

    router.push(`/community/${data.id}`);
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-900 pb-16 pt-24">
        <div className="mx-auto max-w-3xl px-6">
          <Link
            href="/community"
            className="text-sm text-white/50 hover:text-white/80"
          >
            ← 커뮤니티로
          </Link>
          <h1 className="mt-4 text-2xl font-extrabold text-white">글쓰기</h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 카테고리 */}
          <div>
            <label className="mb-2 block text-sm font-semibold">카테고리</label>
            <div className="flex gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    category === c
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* 제목 */}
          <div>
            <label className="mb-2 block text-sm font-semibold">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
              required
            />
          </div>

          {/* 에디터 */}
          <div>
            <label className="mb-2 block text-sm font-semibold">내용</label>
            <Editor onChange={setContent} />
          </div>

          {/* 제출 */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting || !title.trim() || !content.trim()}
              className="rounded-xl bg-slate-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-30"
            >
              {submitting ? "등록 중..." : "등록하기"}
            </button>
            <Link
              href="/community"
              className="rounded-xl border border-slate-200 px-8 py-3 text-sm font-medium text-slate-500 transition hover:border-slate-300"
            >
              취소
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
