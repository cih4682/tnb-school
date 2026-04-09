"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ManagedApp {
  id: string;
  name: string;
  category: string;
  description: string;
  url: string;
  status: string;
  sort_order: number;
}

const CATEGORIES = ["수업 준비", "평가", "학생 관리", "업무 관리", "기타"];
const STATUSES = [
  { value: "active", label: "활성" },
  { value: "inactive", label: "비활성" },
  { value: "coming", label: "준비중" },
];

export default function AdminApps() {
  const [apps, setApps] = useState<ManagedApp[]>([]);
  const [editing, setEditing] = useState<ManagedApp | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("기타");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("active");

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase
      .from("managed_apps")
      .select("*")
      .order("sort_order", { ascending: true });
    setApps(data || []);
  }

  function openForm(app?: ManagedApp) {
    if (app) {
      setEditing(app);
      setName(app.name);
      setCategory(app.category);
      setDescription(app.description);
      setUrl(app.url);
      setStatus(app.status);
    } else {
      setEditing(null);
      setName("");
      setCategory("기타");
      setDescription("");
      setUrl("");
      setStatus("active");
    }
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    if (editing) {
      await supabase
        .from("managed_apps")
        .update({ name, category, description, url, status })
        .eq("id", editing.id);
    } else {
      await supabase
        .from("managed_apps")
        .insert({ name, category, description, url, status, sort_order: apps.length });
    }

    setShowForm(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await supabase.from("managed_apps").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">앱 관리</h1>
        <button
          onClick={() => openForm()}
          className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          + 새 앱 추가
        </button>
      </div>

      {/* 폼 */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 space-y-4"
        >
          <h2 className="font-bold">{editing ? "앱 수정" : "새 앱 추가"}</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">앱 이름 *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400" required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">카테고리</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-500">URL</label>
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://my-app.web.app" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-500">설명</label>
              <input value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">상태</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none">
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              {editing ? "수정 완료" : "등록하기"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 px-5 py-2 text-sm text-slate-500">
              취소
            </button>
          </div>
        </form>
      )}

      {/* 앱 목록 */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50">
            <tr>
              <th className="px-4 py-3 font-semibold">앱 이름</th>
              <th className="hidden px-4 py-3 font-semibold sm:table-cell">카테고리</th>
              <th className="hidden px-4 py-3 font-semibold md:table-cell">URL</th>
              <th className="px-4 py-3 font-semibold">상태</th>
              <th className="px-4 py-3 font-semibold">액션</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {apps.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{app.name}</td>
                <td className="hidden px-4 py-3 text-slate-500 sm:table-cell">{app.category}</td>
                <td className="hidden px-4 py-3 text-slate-400 md:table-cell">
                  <span className="max-w-[200px] truncate block">{app.url || "—"}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    app.status === "active" ? "bg-emerald-50 text-emerald-600" :
                    app.status === "coming" ? "bg-amber-50 text-amber-600" :
                    "bg-slate-100 text-slate-500"
                  }`}>
                    {app.status === "active" ? "활성" : app.status === "coming" ? "준비중" : "비활성"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openForm(app)} className="text-xs text-slate-500 hover:text-slate-900">수정</button>
                    <button onClick={() => handleDelete(app.id)} className="text-xs text-red-400 hover:text-red-600">삭제</button>
                  </div>
                </td>
              </tr>
            ))}
            {apps.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-400">등록된 앱이 없어요.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
