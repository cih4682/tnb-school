"use client";

import { supabase } from "@/lib/supabase";

async function signInWith(provider: "google" | "kakao") {
  await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/`,
    },
  });
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-6">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-white">T&B School</h1>
          <p className="mt-2 text-white/60">선생님 계정으로 로그인하세요</p>
        </div>

        <div className="mt-10 space-y-3">
          {/* Google */}
          <button
            onClick={() => signInWith("google")}
            className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 font-medium text-slate-800 shadow-sm transition hover:bg-slate-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google로 계속하기
          </button>

          {/* Kakao */}
          <button
            onClick={() => signInWith("kakao")}
            className="flex w-full items-center gap-3 rounded-xl bg-[#FEE500] px-4 py-3.5 font-medium text-[#191919] shadow-sm transition hover:bg-[#FADA0A]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M12 3C6.48 3 2 6.58 2 10.94c0 2.8 1.86 5.27 4.66 6.67-.15.56-.96 3.6-.99 3.83 0 0-.02.17.09.23.11.07.24.02.24.02.32-.04 3.7-2.44 4.28-2.85.56.08 1.14.12 1.72.12 5.52 0 10-3.58 10-7.94S17.52 3 12 3z"
                fill="#191919"
              />
            </svg>
            카카오로 계속하기
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-white/40">
          로그인 시{" "}
          <a href="#" className="underline">이용약관</a> 및{" "}
          <a href="#" className="underline">개인정보처리방침</a>에 동의합니다.
        </p>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-white/50 transition hover:text-white/80">
            ← 홈으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}
