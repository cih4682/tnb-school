import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return NextResponse.json({ ok: false }, { status: 500 });

  const { name, phone, email, request: appRequest } = await request.json();

  const text = `📱 *커스텀 앱 신청이 들어왔어요!*\n\n👤 *이름:* ${name}\n📞 *전화번호:* ${phone}\n📧 *이메일:* ${email}\n💬 *요청 내용:*\n${appRequest}\n\n⏰ ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}`;

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  return NextResponse.json({ ok: true });
}
