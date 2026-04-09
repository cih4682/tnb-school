"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Editor } from "@/components/Editor";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

const CATEGORIES = ["자유", "수업팁", "생기부", "자료공유"];

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("자유");
  const [content, setContent] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);

      supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single()
        .then(({ data: post }) => {
          if (!post || post.author_id !== data.user!.id) {
            router.push("/community");
            return;
          }
          setTitle(post.title);
          setCategory(post.category);
          setContent(post.content);
          setLoaded(true);
        });
    });
  }, [postId, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    const { error } = await supabase
      .from("posts")
      .update({ title: title.trim(), content, category, updated_at: new Date().toISOString() })
      .eq("id", postId);

    setSubmitting(false);
    if (error) {
      alert("수정에 실패했습니다: " + error.message);
      return;
    }
    router.push(`/community/${postId}`);
  }

  if (!loaded) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-900 pb-16 pt-24">
        <div className="mx-auto max-w-3xl px-6">
          <Link href={`/community/${postId}`} className="text-sm text-white/50 hover:text-white/80">
            ← 돌아가기
          </Link>
          <h1 className="mt-4 text-2xl font-extrabold text-white">글 수정</h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <form onSubmit={handleSubmit} className="space-y-6">
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
                      : "border border-slate-200 text-slate-500"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">내용</label>
            <Editor content={content} onChange={setContent} />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-slate-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-30"
            >
              {submitting ? "수정 중..." : "수정 완료"}
            </button>
            <Link
              href={`/community/${postId}`}
              className="rounded-xl border border-slate-200 px-8 py-3 text-sm font-medium text-slate-500"
            >
              취소
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
