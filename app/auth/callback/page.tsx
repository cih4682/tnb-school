"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Suspense } from "react";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 에러 체크
    const errorParam = searchParams.get("error");
    const errorDesc = searchParams.get("error_description");

    if (errorParam) {
      setError(errorDesc || errorParam);
      return;
    }

    // 성공: Supabase가 해시 토큰을 자동으로 처리
    // onAuthStateChange로 세션 확정 후 홈으로
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        router.replace("/");
      }
    });

    // 이미 세션이 있을 수도 있음 (해시 처리 완료)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/");
      }
    });

    // 5초 안에 안 되면 홈으로 (안전장치)
    const timeout = setTimeout(() => {
      router.replace("/");
    }, 5000);

    return () => {
      listener.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <p className="text-lg font-bold">로그인 오류</p>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
          <a
            href="/login"
            className="mt-6 inline-block rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white"
          >
            다시 로그인하기
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-slate-400">로그인 처리 중...</p>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><p className="text-slate-400">로딩 중...</p></div>}>
      <CallbackHandler />
    </Suspense>
  );
}
