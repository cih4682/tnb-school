"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Post {
  id: string;
  title: string;
  category: string;
  author_name: string;
  created_at: string;
}

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase
      .from("posts")
      .select("id, title, category, author_name, created_at")
      .order("created_at", { ascending: false });
    setPosts(data || []);
  }

  async function handleDelete(id: string) {
    if (!confirm("이 게시글을 삭제하시겠습니까? 댓글도 함께 삭제됩니다.")) return;
    await supabase.from("posts").delete().eq("id", id);
    load();
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold">게시판 관리</h1>
      <p className="mt-2 text-sm text-slate-500">부적절한 글을 삭제할 수 있습니다.</p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50">
            <tr>
              <th className="px-4 py-3 font-semibold">제목</th>
              <th className="hidden px-4 py-3 font-semibold sm:table-cell">카테고리</th>
              <th className="hidden px-4 py-3 font-semibold md:table-cell">작성자</th>
              <th className="px-4 py-3 font-semibold">날짜</th>
              <th className="px-4 py-3 font-semibold">액션</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {posts.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="max-w-[200px] truncate px-4 py-3 font-medium">{p.title}</td>
                <td className="hidden px-4 py-3 text-slate-500 sm:table-cell">{p.category}</td>
                <td className="hidden px-4 py-3 text-slate-500 md:table-cell">{p.author_name}</td>
                <td className="px-4 py-3 text-slate-400">{formatDate(p.created_at)}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(p.id)} className="text-xs text-red-400 hover:text-red-600">
                    삭제
                  </button>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-400">게시글이 없어요.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
