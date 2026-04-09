"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  author_id: string;
  author_name: string;
  view_count: number;
  created_at: string;
}

interface Comment {
  id: string;
  content: string;
  author_id: string;
  author_name: string;
  created_at: string;
}

export function PostDetail({
  post,
  initialComments,
}: {
  post: Post;
  initialComments: Comment[];
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const isAuthor = user?.id === post.author_id;

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function handleDelete() {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await supabase.from("posts").delete().eq("id", post.id);
    router.push("/community");
  }

  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setSubmitting(true);
    const authorName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "익명";

    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id: post.id,
        content: newComment.trim(),
        author_id: user.id,
        author_name: authorName,
      })
      .select()
      .single();

    setSubmitting(false);
    if (!error && data) {
      setComments([...comments, data]);
      setNewComment("");
    }
  }

  async function handleDeleteComment(commentId: string) {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    await supabase.from("comments").delete().eq("id", commentId);
    setComments(comments.filter((c) => c.id !== commentId));
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="bg-slate-900 pb-16 pt-24">
        <div className="mx-auto max-w-3xl px-6">
          <Link
            href="/community"
            className="text-sm text-white/50 hover:text-white/80"
          >
            ← 커뮤니티로
          </Link>
          <div className="mt-4 flex items-center gap-2">
            <span className="rounded-full bg-white/10 px-3 py-0.5 text-xs font-medium text-white/70">
              {post.category}
            </span>
          </div>
          <h1 className="mt-3 text-2xl font-extrabold text-white md:text-3xl">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-white/40">
            <span>{post.author_name}</span>
            <span>{formatDate(post.created_at)}</span>
            <span>조회 {post.view_count}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* 본문 */}
        <article
          className="prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* 수정/삭제 버튼 */}
        {isAuthor && (
          <div className="mt-8 flex gap-2 border-t border-slate-100 pt-6">
            <Link
              href={`/community/${post.id}/edit`}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300"
            >
              수정
            </Link>
            <button
              onClick={handleDelete}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-500 transition hover:border-red-300 hover:bg-red-50"
            >
              삭제
            </button>
          </div>
        )}

        {/* 댓글 영역 */}
        <div className="mt-12 border-t border-slate-100 pt-8">
          <h3 className="text-lg font-bold">댓글 {comments.length}</h3>

          {/* 댓글 목록 */}
          <div className="mt-6 space-y-4">
            {comments.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-slate-100 bg-slate-50 px-5 py-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{c.author_name}</span>
                    <span className="text-xs text-slate-400">
                      {formatDate(c.created_at)}
                    </span>
                  </div>
                  {user?.id === c.author_id && (
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      className="text-xs text-slate-400 hover:text-red-500"
                    >
                      삭제
                    </button>
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-600">{c.content}</p>
              </div>
            ))}
          </div>

          {/* 댓글 작성 */}
          {user ? (
            <form onSubmit={handleCommentSubmit} className="mt-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-30"
                >
                  {submitting ? "등록 중..." : "댓글 등록"}
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
              <p className="text-sm text-slate-500">댓글을 작성하려면 로그인이 필요해요.</p>
              <Link
                href="/login"
                className="mt-2 inline-block text-sm font-semibold text-slate-900 underline"
              >
                로그인하기
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
