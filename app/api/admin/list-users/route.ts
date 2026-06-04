import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 가입자 명단의 단일 진실원천은 auth.users 다.
// profiles 는 트리거/클라이언트 self-heal 에 의존하는 파생 테이블이라
// 행이 누락되면 가입자가 admin 에서 안 보인다. 이 엔드포인트는
// auth.users 를 서비스 롤로 직접 읽어 profiles 와 병합하고,
// 누락된 profiles 는 즉시 백필해서 항상 모든 가입자가 보이도록 한다.
export async function POST(request: NextRequest) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return NextResponse.json({ error: "no key" }, { status: 500 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAdmin = createClient(url, serviceKey);

  // 호출자가 admin 인지 검증
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: { user: caller } } = await createClient(
    url,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ).auth.getUser(authHeader.replace("Bearer ", ""));

  if (!caller) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: callerProfile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("user_id", caller.id)
    .single();

  if (callerProfile?.role !== "admin") {
    return NextResponse.json({ error: "not admin" }, { status: 403 });
  }

  // 1. auth.users 전체 조회 (페이지네이션)
  const authUsers: { id: string; email?: string; user_metadata?: Record<string, unknown>; created_at: string }[] = [];
  let page = 1;
  const perPage = 1000;
  for (;;) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    authUsers.push(...data.users);
    if (data.users.length < perPage) break;
    page += 1;
  }

  // 2. 기존 profiles 조회
  const { data: profiles } = await supabaseAdmin.from("profiles").select("*");
  const profileByUser = new Map((profiles || []).map((p) => [p.user_id, p]));

  // 3. profiles 가 없는 auth 사용자는 백필
  const toInsert = authUsers
    .filter((u) => !profileByUser.has(u.id))
    .map((u) => {
      const meta = (u.user_metadata ?? {}) as Record<string, string | undefined>;
      const name =
        meta.full_name || meta.name || (u.email ? u.email.split("@")[0] : "익명");
      return { user_id: u.id, name, email: u.email ?? null };
    });

  if (toInsert.length > 0) {
    const { data: inserted } = await supabaseAdmin
      .from("profiles")
      .upsert(toInsert, { onConflict: "user_id", ignoreDuplicates: true })
      .select("*");
    for (const p of inserted || []) profileByUser.set(p.user_id, p);
  }

  // 4. auth.users 순서(가입 최신순) 기준으로 병합 결과 구성
  const users = authUsers
    .map((u) => {
      const p = profileByUser.get(u.id);
      const meta = (u.user_metadata ?? {}) as Record<string, string | undefined>;
      return {
        id: p?.id ?? u.id,
        user_id: u.id,
        name: p?.name ?? meta.full_name ?? meta.name ?? (u.email ? u.email.split("@")[0] : "익명"),
        email: p?.email ?? u.email ?? "",
        role: p?.role ?? "user",
        plan: p?.plan ?? "free",
        created_at: p?.created_at ?? u.created_at,
      };
    })
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

  return NextResponse.json({ users });
}
