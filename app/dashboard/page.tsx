"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

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
  const [activeApp, setActiveApp] = useState<ManagedApp | null>(null);
  const [loading, setLoading] = useState(true);

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

  // iframe 모드
  if (activeApp) {
    return (
      <div className="flex h-screen flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveApp(null)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              ← 돌아가기
            </button>
            <span className="text-sm font-bold">{activeApp.name}</span>
          </div>
        </div>
        <iframe
          src={activeApp.url}
          className="flex-1 border-0"
          allow="clipboard-write; camera; microphone"
        />
      </div>
    );
  }

  // 카테고리별 그룹
  const categories = [...new Set(allApps.map((a) => a.category))];
  const isPremium = profile?.plan === "premium";

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
              {profile?.plan === "premium" ? "프리미엄" : profile?.plan === "standard" ? "정회원" : "무료"}
            </span>
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        {categories.map((cat) => {
          const catApps = allApps.filter((a) => a.category === cat);
          return (
            <div key={cat} className="mb-10">
              <h2 className="mb-4 text-sm font-bold text-slate-700">{cat}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {catApps.map((app) => {
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
                      <p className="mt-1 text-xs text-slate-400">{app.description}</p>
                      {granted ? (
                        <button
                          onClick={() => setActiveApp(app)}
                          className="mt-4 w-full rounded-lg bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                        >
                          사용하기
                        </button>
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
          );
        })}

        {allApps.length === 0 && (
          <div className="py-20 text-center text-slate-400">
            등록된 앱이 아직 없어요.
          </div>
        )}
      </div>
    </div>
  );
}
