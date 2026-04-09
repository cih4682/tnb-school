"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

const links = [
  { href: "#apps", label: "앱" },
  { href: "/dashboard", label: "대시보드" },
  { href: "#pricing", label: "입학 안내" },
  { href: "/community", label: "커뮤니티" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-slate-900">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="text-lg font-extrabold text-white">
          T&B School
        </a>

        {/* 데스크탑 메뉴 */}
        <ul className="hidden gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-medium text-white/90 transition hover:text-white"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {/* 로그인/로그아웃 — 항상 보임 */}
          {user ? (
            <>
              <span className="max-w-[80px] truncate text-xs text-white/80 sm:max-w-none sm:text-sm">
                {user.user_metadata?.full_name || user.email?.split("@")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
              >
                로그아웃
              </button>
            </>
          ) : (
            <a
              href="/login"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
            >
              로그인
            </a>
          )}

          {/* 모바일 햄버거 */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white md:hidden"
            aria-label="메뉴"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* 모바일 드롭다운 */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-slate-900/95 px-6 py-4 backdrop-blur-md md:hidden">
          <ul className="space-y-3">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium text-white/90"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
