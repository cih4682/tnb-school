"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CATEGORY_GROUPS } from "@/data/rooms";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface ManagedApp {
  id: string;
  name: string;
  category: string;
  description: string;
  long_description: string | null;
  details: string[] | null;
  url: string;
  profile_img: string | null;
  video_url: string | null;
  icon: string | null;
  is_new: boolean | null;
  status: string;
  sort_order: number;
}

interface Resource {
  id: string;
  app_id: string;
  file_name: string;
  storage_path: string;
  file_size: number | null;
  created_at: string;
}

function formatFileSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

const ICONS = [
  "calendar", "slides", "fileText", "circleHelp", "barChart",
  "checkCircle", "chair", "search", "palette", "pen", "compass",
];
const STATUSES = [
  { value: "active", label: "활성" },
  { value: "inactive", label: "비활성" },
  { value: "coming", label: "준비중" },
];

export default function AdminApps() {
  const [apps, setApps] = useState<ManagedApp[]>([]);
  const [editing, setEditing] = useState<ManagedApp | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState<"" | "img" | "video">("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [uploadingResource, setUploadingResource] = useState(false);
  const [deleteResourceTarget, setDeleteResourceTarget] = useState<Resource | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("수업 준비");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [detailsText, setDetailsText] = useState("");
  const [url, setUrl] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [icon, setIcon] = useState("calendar");
  const [isNew, setIsNew] = useState(false);
  const [status, setStatus] = useState("active");

  useEffect(() => {
    load();
  }, []);

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
      setDescription(app.description || "");
      setLongDescription(app.long_description || "");
      setDetailsText((app.details || []).join("\n"));
      setUrl(app.url || "");
      setProfileImg(app.profile_img || "");
      setVideoUrl(app.video_url || "");
      setIcon(app.icon || "calendar");
      setIsNew(!!app.is_new);
      setStatus(app.status);
      loadResources(app.id);
    } else {
      setEditing(null);
      setName("");
      setCategory("수업 준비");
      setDescription("");
      setLongDescription("");
      setDetailsText("");
      setUrl("");
      setProfileImg("");
      setVideoUrl("");
      setIcon("calendar");
      setIsNew(false);
      setStatus("active");
      setResources([]);
    }
    setShowForm(true);
  }

  async function loadResources(appId: string) {
    const { data } = await supabase
      .from("resources")
      .select("*")
      .eq("app_id", appId)
      .order("created_at", { ascending: false });
    setResources(data || []);
  }

  async function uploadResource(file: File) {
    if (!editing) return;
    setUploadingResource(true);
    const path = `${editing.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("resources")
      .upload(path, file, { upsert: false });
    if (error) {
      alert("자료 업로드 실패: " + error.message);
      setUploadingResource(false);
      return;
    }
    const { error: insertError } = await supabase.from("resources").insert({
      app_id: editing.id,
      file_name: file.name,
      storage_path: path,
      file_size: file.size,
    });
    if (insertError) {
      alert("자료 등록 실패: " + insertError.message);
    }
    await loadResources(editing.id);
    setUploadingResource(false);
  }

  async function handleDeleteResource(r: Resource) {
    await supabase.storage.from("resources").remove([r.storage_path]);
    await supabase.from("resources").delete().eq("id", r.id);
    if (editing) loadResources(editing.id);
  }

  async function uploadFile(file: File, kind: "img" | "video") {
    setUploading(kind);
    const ext = file.name.split(".").pop() || "bin";
    const path = `${kind}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage
      .from("app-assets")
      .upload(path, file, { upsert: false });
    if (error) {
      alert("업로드 실패: " + error.message);
      setUploading("");
      return;
    }
    const { data } = supabase.storage.from("app-assets").getPublicUrl(path);
    if (kind === "img") setProfileImg(data.publicUrl);
    else setVideoUrl(data.publicUrl);
    setUploading("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const details = detailsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = {
      name,
      category,
      description,
      long_description: longDescription || null,
      details,
      url,
      profile_img: profileImg || null,
      video_url: videoUrl || null,
      icon: icon || null,
      is_new: isNew,
      status,
    };
    if (editing) {
      await supabase.from("managed_apps").update(payload).eq("id", editing.id);
    } else {
      await supabase
        .from("managed_apps")
        .insert({ ...payload, sort_order: apps.length });
    }
    setShowForm(false);
    load();
  }

  async function handleDelete(id: string) {
    await supabase.from("managed_apps").delete().eq("id", id);
    load();
  }

  const inputCls =
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400";

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
          className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6"
        >
          <h2 className="font-bold">{editing ? "앱 수정" : "새 앱 추가"}</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">앱 이름 *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">카테고리 (→ 방 배정)</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
                {CATEGORY_GROUPS.map((g) => (
                  <optgroup key={g.room} label={g.room}>
                    {g.cats.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* 프로필 이미지 업로드 */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">프로필 이미지</label>
              <div className="flex items-center gap-3">
                {profileImg && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profileImg} alt="" className="h-12 w-12 rounded-lg object-cover" />
                )}
                <label className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
                  {uploading === "img" ? "업로드 중…" : "이미지 선택"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "img")}
                  />
                </label>
                {profileImg && (
                  <button type="button" onClick={() => setProfileImg("")} className="text-xs text-red-400">
                    제거
                  </button>
                )}
              </div>
            </div>

            {/* 설명 영상 업로드 */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">설명 영상</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
                  {uploading === "video" ? "업로드 중…" : videoUrl ? "영상 교체" : "영상 선택"}
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "video")}
                  />
                </label>
                {videoUrl && <span className="truncate text-xs text-emerald-600">영상 있음 ✓</span>}
                {videoUrl && (
                  <button type="button" onClick={() => setVideoUrl("")} className="text-xs text-red-400">
                    제거
                  </button>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-500">한 줄 설명</label>
              <input value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-500">상세 설명 (카드/팝업용)</label>
              <textarea value={longDescription} onChange={(e) => setLongDescription(e.target.value)} rows={2} className={`${inputCls} resize-none`} />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-500">개조식 설명 (한 줄에 하나씩)</label>
              <textarea
                value={detailsText}
                onChange={(e) => setDetailsText(e.target.value)}
                rows={4}
                placeholder={"요일·교시 시간표를 한눈에\n드래그로 자유롭게 이동\n저장하면 언제든 다시 확인"}
                className={`${inputCls} resize-none`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-500">앱 URL</label>
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://my-app.web.app" className={inputCls} />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">아이콘 (이미지 없을 때)</label>
              <select value={icon} onChange={(e) => setIcon(e.target.value)} className={inputCls}>
                {ICONS.map((ic) => (
                  <option key={ic} value={ic}>{ic}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">상태</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 sm:col-span-2">
              <input id="isNew" type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} className="h-4 w-4" />
              <label htmlFor="isNew" className="text-sm text-slate-600">NEW 뱃지 표시</label>
            </div>

            {/* 첨부 자료 (로그인 사용자 다운로드용) */}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-500">첨부 자료 (로그인 사용자만 다운로드 가능)</label>
              {editing ? (
                <div className="space-y-2">
                  {resources.map((r) => (
                    <div key={r.id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm">
                      <span className="truncate">
                        {r.file_name}
                        {r.file_size != null && <span className="ml-2 text-xs text-slate-400">{formatFileSize(r.file_size)}</span>}
                      </span>
                      <button
                        type="button"
                        onClick={() => setDeleteResourceTarget(r)}
                        className="shrink-0 text-xs text-red-400 hover:text-red-600"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                  {resources.length === 0 && <p className="text-xs text-slate-400">등록된 자료가 없어요.</p>}
                  <label className="mt-1 inline-block cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
                    {uploadingResource ? "업로드 중…" : "파일 추가"}
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && uploadResource(e.target.files[0])}
                    />
                  </label>
                </div>
              ) : (
                <p className="text-xs text-slate-400">앱을 먼저 등록한 뒤 "수정"에서 자료를 추가할 수 있어요.</p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!!uploading}
              className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >
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
                <td className="px-4 py-3 font-medium">
                  <div className="flex items-center gap-2">
                    {app.profile_img && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={app.profile_img} alt="" className="h-7 w-7 rounded object-cover" />
                    )}
                    {app.name}
                    {app.is_new && <span className="rounded bg-emerald-100 px-1 text-[10px] font-bold text-emerald-600">NEW</span>}
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-slate-500 sm:table-cell">{app.category}</td>
                <td className="hidden px-4 py-3 text-slate-400 md:table-cell">
                  <span className="block max-w-[200px] truncate">{app.url || "—"}</span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      app.status === "active"
                        ? "bg-emerald-50 text-emerald-600"
                        : app.status === "coming"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {app.status === "active" ? "활성" : app.status === "coming" ? "준비중" : "비활성"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openForm(app)} className="text-xs text-slate-500 hover:text-slate-900">수정</button>
                    <button onClick={() => setDeleteTarget(app.id)} className="text-xs text-red-400 hover:text-red-600">삭제</button>
                  </div>
                </td>
              </tr>
            ))}
            {apps.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-400">등록된 앱이 없어요.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="앱 삭제"
        message="정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        onConfirm={() => {
          if (deleteTarget) handleDelete(deleteTarget);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmModal
        open={!!deleteResourceTarget}
        title="자료 삭제"
        message={deleteResourceTarget ? `"${deleteResourceTarget.file_name}" 파일을 삭제하시겠습니까?` : ""}
        onConfirm={() => {
          if (deleteResourceTarget) handleDeleteResource(deleteResourceTarget);
          setDeleteResourceTarget(null);
        }}
        onCancel={() => setDeleteResourceTarget(null)}
      />
    </div>
  );
}
