"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

// 같은 탭에서 동일 유저에 대해 중복 호출 방지
let syncedUserId: string | null = null;

async function ensureProfile(user: User) {
  if (syncedUserId === user.id) return;
  syncedUserId = user.id;

  const meta = (user.user_metadata ?? {}) as Record<string, string | undefined>;
  const name =
    meta.full_name ||
    meta.name ||
    (user.email ? user.email.split("@")[0] : "익명");

  // 프로필이 없을 때만 생성 (이미 있으면 DO NOTHING → plan/이름 등 기존 값 보존)
  await supabase.from("profiles").upsert(
    { user_id: user.id, name, email: user.email ?? null },
    { onConflict: "user_id", ignoreDuplicates: true }
  );
}

/**
 * 로그인 세션이 잡히면 profiles 행이 없는 경우 자동 생성한다.
 * DB 트리거(on_auth_user_created)가 동작하지 않아도 가입자가 누락되지 않도록 하는 안전망.
 */
export function ProfileSync() {
  useEffect(() => {
    // 페이지 진입 시 이미 세션이 있는 경우
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) ensureProfile(data.session.user);
    });

    // 새 로그인 등 세션 변화 감지
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) ensureProfile(session.user);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return null;
}
