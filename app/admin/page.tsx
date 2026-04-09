"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, apps: 0, posts: 0 });

  useEffect(() => {
    async function load() {
      const [u, a, p] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("managed_apps").select("id", { count: "exact", head: true }),
        supabase.from("posts").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        users: u.count || 0,
        apps: a.count || 0,
        posts: p.count || 0,
      });
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-extrabold">관리자 대시보드</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="전체 회원" value={stats.users} />
        <StatCard label="등록된 앱" value={stats.apps} />
        <StatCard label="게시글" value={stats.posts} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <p className="text-xs font-semibold text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-extrabold">{value}</p>
    </div>
  );
}
