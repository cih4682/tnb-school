import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인",
  description:
    "T&B School 티처버프에 Google 또는 카카오로 간편 로그인하세요. 교사용 앱 100개를 바로 사용할 수 있습니다.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
