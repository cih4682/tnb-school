"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

const CATEGORIES = ["전체", "자유", "수업팁", "생기부", "자료공유"];

interface Post {
  id: string;
  title: string;
  category: string;
  author_name: string;
  view_count: number;
  created_at: string;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState("전체");
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [category]);

  async function fetchPosts() {
    setLoading(true);
    let query = supabase
      .from("posts")
      .select("id, title, category, author_name, view_count, created_at")
      .order("created_at", { ascending: false });

    if (category !== "전체") {
      query = query.eq("category", category);
    }

    const { data } = await query;
    setPosts(data || []);
    setLoading(false);
  }

  const filtered = search
    ? posts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    : posts;

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="bg-slate-900 pb-16 pt-24">
        <div className="mx-auto max-w-4xl px-6">
          <Link href="/" className="text-sm text-white/50 hover:text-white/80">
            ← 홈으로
          </Link>
          <h1 className="mt-4 text-3xl font-extrabold text-white md:text-4xl">
            커뮤니티
          </h1>
          <p className="mt-2 text-white/50">
            선생님들과 수업 팁, 자료, 노하우를 나눠보세요
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* 카테고리 + 검색 + 글쓰기 */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 overflow-x-auto rounded-full border border-slate-200 p-1">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  category === c
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="검색..."
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-slate-400"
            />
            {user && (
              <Link
                href="/community/write"
                className="whitespace-nowrap rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                글쓰기
              </Link>
            )}
          </div>
        </div>

        {/* 글 목록 */}
        <div className="mt-8">
          {loading ? (
            <p className="py-20 text-center text-slate-400">불러오는 중...</p>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-slate-400">아직 게시글이 없어요.</p>
              {user && (
                <Link
                  href="/community/write"
                  className="mt-4 inline-block text-sm font-semibold text-slate-900 underline"
                >
                  첫 번째 글을 작성해 보세요 →
                </Link>
              )}
              {!user && (
                <Link
                  href="/login"
                  className="mt-4 inline-block text-sm font-semibold text-slate-900 underline"
                >
                  로그인하고 글을 작성해 보세요 →
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((post) => (
                <Link
                  key={post.id}
                  href={`/community/${post.id}`}
                  className="flex items-center gap-4 py-4 transition hover:bg-slate-50 rounded-lg px-2 -mx-2"
                >
                  <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    {post.category}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {post.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {post.author_name} · {formatDate(post.created_at)} · 조회 {post.view_count}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
