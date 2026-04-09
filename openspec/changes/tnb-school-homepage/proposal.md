## Why

T&B School은 선생님(초·중·고)을 위한 앱 모음 플랫폼으로, 현재 약 10개의 앱이 있고 100개까지 확장할 계획이다. 하지만 이를 보여줄 공식 홈페이지가 없어, 입학 전환·앱 발견·커스텀 제작 신청을 받을 진입점이 비어 있다. 신선하고 직관적인 홈페이지가 필요하다.

## What Changes

- Next.js 14 (App Router) + TypeScript + TailwindCSS 기반의 새 프로젝트를 루트(`d:\커서프로젝트\T&B`)에 초기화한다.
- `t&b.mp4`를 `public/`로 이동하여 Hero 배경 영상으로 사용한다.
- "도구상자(Toolbox)" 컨셉의 단일 페이지 홈페이지를 7개 섹션으로 구성한다:
  1. Hero (영상 배경 + 카피 + CTA)
  2. 가치 제안 3카드
  3. 앱 카운터 ("12 / 100" 진행 바)
  4. 앱 갤러리 (카테고리 필터 + 카드 그리드)
  5. 티처버프 입학 안내 (가격·혜택)
  6. 커스텀 앱 신청 폼
  7. FAQ + 푸터
- 앱 데이터는 `data/apps.ts`에 더미 10개로 시작하며, 카테고리는 수업준비·평가·학생관리·자료제작 4종.
- 커스텀 앱 신청 폼은 1차로 `mailto:` 또는 콘솔 출력의 클라이언트 단순 처리(백엔드는 추후).

## Capabilities

### New Capabilities
- `homepage`: 단일 페이지 홈페이지의 섹션 구성, 데이터 모델, 내비게이션 동작 정의

### Modified Capabilities
- (없음)

## Impact

- 새 파일/폴더: `package.json`, `next.config.js`, `tsconfig.json`, `tailwind.config.ts`, `app/`, `components/`, `data/apps.ts`, `public/t&b.mp4`
- 의존성: `next`, `react`, `react-dom`, `typescript`, `tailwindcss`, `postcss`, `autoprefixer`
- 기존 파일은 변경하지 않음 (`cloude.md`, `openspec/`, `t&b.mp4`는 유지; `t&b.mp4`는 `public/`로 복사)
- 백엔드/DB 없음 (정적 사이트)
