"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  created_at: string;
}

interface ManagedApp {
  id: string;
  name: string;
  category: string;
}

const PLANS = [
  { value: "free", label: "FREE" },
  { value: "basic", label: "BASIC" },
  { value: "pro", label: "PRO" },
  { value: "team", label: "TEAM" },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [apps, setApps] = useState<ManagedApp[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Profile | null>(null);
  const [userAppIds, setUserAppIds] = useState<Set<string>>(new Set());

  useEffect(() => { load(); }, []);

  async function load() {
    const [u, a] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("managed_apps").select("id, name, category").order("sort_order"),
    ]);
    setUsers(u.data || []);
    setApps(a.data || []);
  }

  async function selectUser(user: Profile) {
    setSelected(user);
    const { data } = await supabase
      .from("user_apps")
      .select("app_id")
      .eq("user_id", user.user_id);
    setUserAppIds(new Set((data || []).map((d) => d.app_id)));
  }

  async function toggleApp(appId: string) {
    if (!selected) return;
    const newSet = new Set(userAppIds);

    if (newSet.has(appId)) {
      await supabase.from("user_apps").delete().match({ user_id: selected.user_id, app_id: appId });
      newSet.delete(appId);
    } else {
      await supabase.from("user_apps").insert({ user_id: selected.user_id, app_id: appId });
      newSet.add(appId);
    }
    setUserAppIds(newSet);
  }

  async function changePlan(userId: string, plan: string) {
    await supabase.from("profiles").update({ plan }).eq("user_id", userId);
    setUsers(users.map((u) => u.user_id === userId ? { ...u, plan } : u));
    if (selected?.user_id === userId) setSelected({ ...selected, plan });
  }

  async function grantAll() {
    if (!selected) return;
    for (const app of apps) {
      if (!userAppIds.has(app.id)) {
        await supabase.from("user_apps").insert({ user_id: selected.user_id, app_id: app.id });
      }
    }
    setUserAppIds(new Set(apps.map((a) => a.id)));
  }

  async function revokeAll() {
    if (!selected) return;
    await supabase.from("user_apps").delete().eq("user_id", selected.user_id);
    setUserAppIds(new Set());
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
              {filtered.map((u) => (
                <button
                  key={u.id}
                  onClick={() => selectUser(u)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${
                    selected?.user_id === u.user_id ? "bg-slate-50" : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{u.name}</p>
                    <p className="truncate text-xs text-slate-400">{u.email}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    u.plan === "team" ? "bg-amber-50 text-amber-600" :
                    u.plan === "pro" ? "bg-purple-50 text-purple-600" :
                    u.plan === "basic" ? "bg-blue-50 text-blue-600" :
                    "bg-slate-100 text-slate-500"
                  }`}>
                    {PLANS.find((p) => p.value === u.plan)?.label}
                  </span>
                </button>
              ))}
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
              <h2 className="text-lg font-bold">{selected.name}</h2>
              <p className="text-sm text-slate-400">{selected.email}</p>

              <div className="mt-4">
                <label className="mb-1 block text-xs font-semibold text-slate-500">플랜</label>
                <select
                  value={selected.plan}
                  onChange={(e) => changePlan(selected.user_id, e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none"
                >
                  {PLANS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-500">앱 권한 ({userAppIds.size}/{apps.length})</p>
                  <div className="flex gap-2">
                    <button onClick={grantAll} className="text-[10px] text-blue-500 hover:underline">전체 ON</button>
                    <button onClick={revokeAll} className="text-[10px] text-red-400 hover:underline">전체 OFF</button>
                  </div>
                </div>

                <div className="mt-3 max-h-[400px] space-y-1 overflow-y-auto">
                  {apps.map((app) => {
                    const granted = userAppIds.has(app.id);
                    return (
                      <button
                        key={app.id}
                        onClick={() => toggleApp(app.id)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                          granted ? "bg-emerald-50" : "hover:bg-slate-50"
                        }`}
                      >
                        <div>
                          <span className="font-medium">{app.name}</span>
                          <span className="ml-2 text-xs text-slate-400">{app.category}</span>
                        </div>
                        <span className={`text-xs font-bold ${granted ? "text-emerald-600" : "text-slate-300"}`}>
                          {granted ? "ON" : "OFF"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-[400px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white">
              <p className="text-sm text-slate-400">사용자를 선택하세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
