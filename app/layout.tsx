import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://teacherbuff.com";
const SITE_NAME = "T&B School | 티처버프";
const DESCRIPTION =
  "초·중·고 선생님을 위한 교사 앱 모음 플랫폼. 생기부 관리, 생활기록부 앱, 수업 준비, 학생 관리까지 100개의 교사 도구를 한 번 입학으로 평생 사용하세요. 커스텀 앱 제작도 가능합니다.";
const KEYWORDS = [
  "교사버프",
  "티처버프",
  "T&B School",
  "교사앱",
  "교사앱제작",
  "교사 도구",
  "선생님 앱",
  "생기부 관리",
  "생활기록부 앱",
  "생기부 작성 도우미",
  "생기부 자동화",
  "학생 관리 앱",
  "수업 준비 앱",
  "교사 업무 자동화",
  "학교 앱",
  "교사 플랫폼",
  "자리 배치 앱",
  "출석부 앱",
  "퀴즈 메이커",
  "워크시트 생성기",
  "교사 커스텀 앱",
  "초등 교사 앱",
  "중학교 교사 앱",
  "고등학교 교사 앱",
  "수행평가 앱",
  "루브릭 앱",
  "교사 업무 효율",
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "T&B School | 티처버프 — 선생님을 위한 100개의 도구",
    template: "%s | T&B School 티처버프",
  },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  authors: [{ name: "T&B School" }],
  creator: "T&B School",
  publisher: "T&B School",
  formatDetection: { telephone: false },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "T&B School | 티처버프 — 선생님을 위한 100개의 도구",
    description: DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "T&B School 티처버프 — 선생님을 위한 100개의 도구",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "T&B School | 티처버프 — 선생님을 위한 100개의 도구",
    description: DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "GOOGLE_VERIFICATION_CODE",
    // 네이버: 아래 head에서 별도 추가
  },
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {/* 네이버 웹마스터 인증 */}
        <meta name="naver-site-verification" content="d12269421f58f1546659393aca49052897c8b59a" />
        {/* JSON-LD 구조화 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "T&B School 티처버프",
              alternateName: ["티처버프", "교사버프", "T&B School", "TeacherBuff"],
              url: SITE_URL,
              description: DESCRIPTION,
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/#apps?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "T&B School",
              alternateName: "티처버프",
              url: SITE_URL,
              description:
                "초·중·고 선생님을 위한 교사 앱 제작 플랫폼. 생기부 관리, 학생 관리, 수업 준비 도구 100개 제공.",
              sameAs: [],
              offers: {
                "@type": "Offer",
                name: "티처버프 정회원",
                description:
                  "한 번 입학으로 100개의 교사용 앱 평생 사용. 커스텀 앱 제작 우선 신청권 포함.",
                priceCurrency: "KRW",
                price: "99000",
                availability: "https://schema.org/InStock",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "입학금은 한 번만 내면 되나요?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "네, 평생 회원으로 한 번만 결제하시면 모든 앱을 추가 비용 없이 사용하실 수 있어요.",
                  },
                },
                {
                  "@type": "Question",
                  name: "신규 앱이 추가되면 따로 비용이 드나요?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "아니요. 100개 목표까지 추가되는 모든 앱은 정회원에게 자동으로 무료 제공됩니다.",
                  },
                },
                {
                  "@type": "Question",
                  name: "커스텀 앱 제작은 누구나 신청할 수 있나요?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "정회원이라면 우선 신청권이 주어집니다. 일반 신청도 가능하지만 대기열이 있을 수 있어요.",
                  },
                },
                {
                  "@type": "Question",
                  name: "초·중·고 어느 단계 선생님께 적합한가요?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "전 학교급 선생님 모두를 위해 설계되었습니다. 앱별로 학년에 맞게 설정할 수 있어요.",
                  },
                },
                {
                  "@type": "Question",
                  name: "환불이 가능한가요?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "결제 후 7일 이내, 앱 사용 이력이 없다면 전액 환불 가능합니다.",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
