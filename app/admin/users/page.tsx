"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TIERS, getTier } from "@/data/tiers";

interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  created_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Profile | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    // 가입자 명단은 auth.users 가 진실원천이다. profiles 만 읽으면
    // 프로필 행이 안 생긴 가입자가 누락되므로 서버 API 로 병합 조회한다.
    const { data: { session } } = await supabase.auth.getSession();
    const uRes = await fetch("/api/admin/list-users", {
      method: "POST",
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    if (uRes.ok) {
      const uJson = await uRes.json();
      setUsers(uJson.users || []);
    } else {
      // service key 미설정 등으로 API 실패 시 profiles 직접 조회로 폴백 (빈 화면 회귀 방지)
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      setUsers(data || []);
    }
  }

  async function changeTier(userId: string, plan: string) {
    await supabase.from("profiles").update({ plan }).eq("user_id", userId);
    setUsers(users.map((u) => u.user_id === userId ? { ...u, plan } : u));
    if (selected?.user_id === userId) setSelected({ ...selected, plan });
  }

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  async function confirmDelete() {
    if (!deleteTarget) return;
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/admin/delete-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ userId: deleteTarget }),
    });
    if (res.ok) {
      setUsers(users.filter((u) => u.user_id !== deleteTarget));
      if (selected?.user_id === deleteTarget) setSelected(null);
    } else {
      alert("삭제에 실패했습니다.");
    }
    setDeleteTarget(null);
  }

  const filtered = search
    ? users.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        (u.email || "").toLowerCase().includes(search.toLowerCase())
      )
    : users;

  return (
    <div>
      <h1 className="text-2xl font-extrabold">사용자 관리</h1>
      <p className="mt-1 text-sm text-slate-400">
        모든 가입자는 전체 앱을 사용할 수 있어요. 등급은 후원에 대한 감사 표시입니다.
      </p>

      <div className="mt-6 flex gap-4">
        {/* 좌: 사용자 목록 */}
        <div className="flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름 또는 이메일 검색..."
            className="mb-4 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400"
          />

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="max-h-[600px] overflow-y-auto divide-y divide-slate-50">
              {filtered.map((u) => {
                const t = getTier(u.plan);
                return (
                  <button
                    key={u.id}
                    onClick={() => setSelected(u)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${
                      selected?.user_id === u.user_id ? "bg-slate-50" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{u.name}</p>
                      <p className="truncate text-xs text-slate-400">{u.email}</p>
                    </div>
                    <span className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-medium ${t.chip}`}>
                      {t.badge && t.emoji ? `${t.emoji} ` : ""}{t.label}
                    </span>
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p className="py-10 text-center text-sm text-slate-400">사용자가 없어요.</p>
              )}
            </div>
          </div>
        </div>

        {/* 우: 선택된 사용자 상세 */}
        <div className="w-[360px] shrink-0">
          {selected ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold">{selected.name}</h2>
                  <p className="text-sm text-slate-400">{selected.email}</p>
                </div>
                <button
                  onClick={() => setDeleteTarget(selected.user_id)}
                  className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-500 transition hover:bg-red-50"
                >
                  삭제
                </button>
              </div>

              <div className="mt-4">
                <label className="mb-1 block text-xs font-semibold text-slate-500">후원 등급</label>
                <select
                  value={getTier(selected.plan).value}
                  onChange={(e) => changeTier(selected.user_id, e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none"
                >
                  {TIERS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.badge && t.emoji ? `${t.emoji} ` : ""}{t.label}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-slate-400">
                  후원이 확인되면 등급을 올려주세요. 앱 사용에는 영향을 주지 않아요.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-[400px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white">
              <p className="text-sm text-slate-400">사용자를 선택하세요</p>
            </div>
          )}
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <svg className="h-7 w-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">사용자를 삭제하시겠습니까?</h3>
              <p className="mt-2 text-sm text-slate-500">프로필이 삭제됩니다.<br/>이 작업은 되돌릴 수 없습니다.</p>
            </div>
            <div className="flex border-t border-slate-100">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-4 text-sm font-medium text-slate-500 transition hover:bg-slate-50"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 border-l border-slate-100 py-4 text-sm font-semibold text-red-500 transition hover:bg-red-50"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
