import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "T&B School — 선생님을 위한 100개의 도구",
  description:
    "초·중·고 선생님의 하루를 가볍게 만드는 앱 모음 플랫폼. 한 번 입학하면 모든 앱을 평생 사용하세요.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
