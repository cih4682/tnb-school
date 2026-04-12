import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return NextResponse.json({ error: "no key" }, { status: 500 });

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey
  );

  // 요청한 사람이 admin인지 확인
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: { user: caller } } = await createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
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

  // 삭제할 사용자
  const { userId } = await request.json();
  if (!userId) return NextResponse.json({ error: "no userId" }, { status: 400 });

  // 1. user_apps 삭제
  await supabaseAdmin.from("user_apps").delete().eq("user_id", userId);

  // 2. profiles 삭제
  await supabaseAdmin.from("profiles").delete().eq("user_id", userId);

  // 3. auth.users 삭제 (완전 삭제)
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
