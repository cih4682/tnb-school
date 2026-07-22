"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { ROOM_ORDER, ROOM_LABELS, ROOM_CATEGORIES, roomOfCategory, normalizeUrl } from "@/data/rooms";

interface ManagedApp {
  id: string;
  name: string;
  category: string;
  description: string;
  url: string;
  status: string;
}

interface Profile {
  name: string;
  plan: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [allApps, setAllApps] = useState<ManagedApp[]>([]);
  const [grantedIds, setGrantedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleCopy(appId: string, url: string) {
    navigator.clipboard.writeText(url);
    setCopiedId(appId);
    setTimeout(() => setCopiedId(null), 2000);
  }

  useEffect(() => {
    async function load() {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { router.push("/login"); return; }
      setUser(u);

      const [profileRes, appsRes, grantsRes] = await Promise.all([
        supabase.from("profiles").select("name, plan").eq("user_id", u.id).single(),
        supabase.from("managed_apps").select("*").eq("status", "active").order("sort_order"),
        supabase.from("user_apps").select("app_id").eq("user_id", u.id),
      ]);

      setProfile(profileRes.data);
      setAllApps(appsRes.data || []);
      setGrantedIds(new Set((grantsRes.data || []).map((g) => g.app_id)));
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-400">불러오는 중...</p>
      </div>
    );
  }

  const isPremium = profile?.plan === "pro" || profile?.plan === "team";
  // 3개 방으로 그룹 (+ 기타)
  const groups: { label: string; apps: ManagedApp[] }[] = ROOM_ORDER.map((id) => ({
    label: ROOM_LABELS[id],
    apps: allApps.filter((a) => ROOM_CATEGORIES[id].includes(a.category)),
  })).filter((g) => g.apps.length > 0);
  const otherApps = allApps.filter((a) => roomOfCategory(a.category) === null);
  if (otherApps.length) groups.push({ label: "기타", apps: otherApps });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 pb-10 pt-24">
        <div className="mx-auto max-w-5xl px-6">
          <Link href="/" className="text-sm text-white/50 hover:text-white/80">← 홈으로</Link>
          <h1 className="mt-4 text-2xl font-extrabold text-white">
            안녕하세요, {profile?.name || "선생님"}!
          </h1>
          <p className="mt-1 text-white/50">
            플랜: <span className="font-medium text-white/70">
              {profile?.plan === "team" ? "TEAM" : profile?.plan === "pro" ? "PRO" : profile?.plan === "basic" ? "BASIC" : "FREE"}
            </span>
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        {groups.map((g) => (
            <div key={g.label} className="mb-10">
              <h2 className="mb-4 text-sm font-bold text-slate-700">{g.label}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {g.apps.map((app) => {
                  const granted = isPremium || grantedIds.has(app.id);
                  return (
                    <div
                      key={app.id}
                      className={`rounded-2xl border p-5 transition ${
                        granted
                          ? "border-slate-200 bg-white hover:shadow-md"
                          : "border-slate-100 bg-slate-50 opacity-60"
                      }`}
                    >
                      <h3 className="text-sm font-bold">{app.name}</h3>
                      <p className="mt-1 whitespace-pre-line text-xs text-slate-400">{app.description}</p>
                      {granted ? (
                        <div className="mt-4 flex gap-2">
                          <a
                            href={normalizeUrl(app.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 rounded-lg bg-slate-900 py-2 text-center text-xs font-semibold text-white hover:bg-slate-800"
                          >
                            사용하기
                          </a>
                          <div className="group relative">
                            <button
                              onClick={() => handleCopy(app.id, normalizeUrl(app.url) || app.url)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                              aria-label="링크 복사"
                            >
                              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                                <rect width="13" height="13" x="9" y="9" rx="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                            </button>
                            <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                              링크 복사
                              <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                            </div>
                            <AnimatePresence>
                              {copiedId === app.id && (
                                <motion.div
                                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                                  className="absolute bottom-full left-1/2 z-20 mb-2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg"
                                >
                                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m9 12 2 2 4-4" />
                                  </svg>
                                  복사 완료
                                  <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-emerald-500" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      ) : (
                        <Link
                          href="/#pricing"
                          className="mt-4 block w-full rounded-lg border border-slate-200 py-2 text-center text-xs font-medium text-slate-400"
                        >
                          🔒 입학하면 사용 가능
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
        ))}

        {allApps.length === 0 && (
          <div className="py-20 text-center text-slate-400">
            등록된 앱이 아직 없어요.
          </div>
        )}
      </div>
    </div>
  );
}
