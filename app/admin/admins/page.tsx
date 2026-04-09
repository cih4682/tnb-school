"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: string;
}

const MAX_ADMINS = 3;

export default function AdminAdmins() {
  const [admins, setAdmins] = useState<Profile[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setCurrentUserId(user.id);

    const { data: all } = await supabase.from("profiles").select("*").order("created_at");
    if (all) {
      setAdmins(all.filter((p) => p.role === "admin"));
      setUsers(all.filter((p) => p.role === "user"));
    }
  }

  async function grantAdmin(userId: string) {
    if (admins.length >= MAX_ADMINS) {
      alert(`관리자는 최대 ${MAX_ADMINS}명까지 지정할 수 있습니다.`);
      return;
    }
    await supabase.from("profiles").update({ role: "admin" }).eq("user_id", userId);
    load();
  }

  async function revokeAdmin(userId: string) {
    if (userId === currentUserId) {
      alert("본인의 관리자 권한은 해제할 수 없습니다.");
      return;
    }
    await supabase.from("profiles").update({ role: "user" }).eq("user_id", userId);
    load();
  }

  const filtered = search
    ? users.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        (u.email || "").toLowerCase().includes(search.toLowerCase())
      )
    : users;

  return (
    <div>
      <h1 className="text-2xl font-extrabold">관리자 관리</h1>
      <p className="mt-2 text-sm text-slate-500">최대 {MAX_ADMINS}명까지 관리자를 지정할 수 있습니다.</p>

      {/* 현재 관리자 */}
      <div className="mt-8">
        <h2 className="text-sm font-bold text-slate-700">현재 관리자 ({admins.length}/{MAX_ADMINS})</h2>
        <div className="mt-3 space-y-2">
          {admins.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-3"
            >
              <div>
                <p className="text-sm font-semibold">{a.name}</p>
                <p className="text-xs text-slate-400">{a.email}</p>
              </div>
              {a.user_id === currentUserId ? (
                <span className="text-xs text-slate-400">나 (해제불가)</span>
              ) : (
                <button
                  onClick={() => revokeAdmin(a.user_id)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
                >
                  해제
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 관리자 추가 */}
      {admins.length < MAX_ADMINS && (
        <div className="mt-10">
          <h2 className="text-sm font-bold text-slate-700">회원 중 관리자 추가</h2>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름 또는 이메일 검색..."
            className="mt-3 w-full max-w-md rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400"
          />
          <div className="mt-3 max-h-[300px] space-y-1 overflow-y-auto">
            {filtered.slice(0, 20).map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-5 py-3"
              >
                <div>
                  <p className="text-sm font-semibold">{u.name}</p>
                  <p className="text-xs text-slate-400">{u.email}</p>
                </div>
                <button
                  onClick={() => grantAdmin(u.user_id)}
                  className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                >
                  관리자 지정
                </button>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-400">검색 결과가 없어요.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
