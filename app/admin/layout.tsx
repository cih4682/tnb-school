"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const navItems = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/apps", label: "앱 관리" },
  { href: "/admin/users", label: "사용자 관리" },
  { href: "/admin/admins", label: "관리자 관리" },
  { href: "/admin/posts", label: "게시판 관리" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        router.push("/");
        return;
      }
      setAuthorized(true);
      setLoading(false);
    }
    check();
  }, [router]);

  if (loading || !authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-400">확인 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 상단바 */}
      <header className="bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="text-lg font-extrabold text-white">
            T&B Admin
          </Link>
          <Link href="/" className="text-sm text-white/50 hover:text-white/80">
            홈으로 →
          </Link>
        </div>
      </header>

      {/* 네비 탭 */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl gap-0 overflow-x-auto px-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap border-b-2 px-5 py-3 text-sm font-medium transition ${
                  isActive
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* 콘텐츠 */}
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
