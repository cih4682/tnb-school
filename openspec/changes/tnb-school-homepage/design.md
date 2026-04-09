## Context

T&B School은 초·중·고 선생님을 위한 앱 모음 플랫폼이다. 현재 약 10개 앱이 있으며 100개까지 확장 예정이다. 공식 홈페이지가 없어 입학·앱 발견·커스텀 신청 진입점이 부재한 상태다. 프로젝트 폴더(`d:\커서프로젝트\T&B`)는 깨끗하며, `t&b.mp4`와 openspec 구조만 존재한다.

## Goals / Non-Goals

**Goals:**
- "도구상자" 컨셉의 단일 페이지(SPA형 단일 라우트) 홈페이지 구축
- 100개까지 확장 가능한 앱 데이터 구조와 카테고리 필터
- Hero 영상 기반의 신선한 첫인상
- 정적 배포가 가능한 단순한 아키텍처

**Non-Goals:**
- 백엔드, DB, 인증, 결제 연동 (1차 범위 외)
- 다국어, 다크모드, SEO 고급 최적화
- 실제 커스텀 앱 신청 처리(이메일/저장은 추후 단계)

## Decisions

### 결정 1: Next.js 14 (App Router) + TypeScript + TailwindCSS
- **이유**: 추후 동적 라우트(앱 상세 페이지), API 라우트(폼 처리)로 자연스럽게 확장 가능. Tailwind는 디자인 반복 속도가 빠르며 카드/그리드 UI에 최적.
- **대안**: ① 순수 HTML/CSS — 확장성 부족 ② Astro — 좋지만 사용자 친숙도 낮음. Next.js로 결정.

### 결정 2: 단일 라우트 (`app/page.tsx`) + 섹션 컴포넌트 분리
- **이유**: 7개 섹션은 한 페이지에 들어가는 게 컨셉상 자연스럽다. 각 섹션은 `components/sections/`에 분리해 가독성과 재사용성 확보.

### 결정 3: 앱 데이터는 `data/apps.ts` 정적 파일
- **이유**: 100개까지는 정적 배열로 충분. CMS·DB는 과도한 복잡도. 추후 필요 시 JSON/headless CMS로 마이그레이션 용이.
- 타입: `App { id, name, category, description, icon?, isNew? }`

### 결정 4: 영상 파일 처리
- `t&b.mp4`를 `public/tnb.mp4`로 복사(이름의 `&`는 URL 인코딩 이슈 회피).
- `<video autoPlay muted loop playsInline>` 사용, `object-cover`로 풀스크린.
- 모바일 데이터 절약을 위해 `preload="metadata"` 적용.

### 결정 5: 폼은 1차 클라이언트 단순 처리
- 제출 시 `useState`로 검증 → `mailto:` 링크 또는 콘솔/alert로 확인.
- 이유: 백엔드 없이 빠르게 출시. 추후 Next.js Route Handler(`app/api/contact/route.ts`)로 교체.

### 결정 6: 카운터의 "현재 N"은 `apps.length` 자동 계산
- 데이터 추가만으로 카운터가 자연스럽게 갱신됨.

## Risks / Trade-offs

- **리스크**: Hero 영상 파일 크기가 크면 초기 로딩이 느려짐 → **완화**: `preload="metadata"`, 추후 압축본 제공, poster 이미지 추가 검토.
- **리스크**: 정적 배열은 100개를 넘으면 관리 부담 → **완화**: 그 단계에서 JSON 또는 헤드리스 CMS로 이전(현재 범위 외).
- **트레이드오프**: 단일 페이지라서 SEO 페이지별 최적화 어려움 → 1차에서는 허용, 추후 앱 상세 라우트 추가 시 개선.
- **리스크**: `cloude.md`(오타)와 새 Next.js 파일 충돌 없음 — 기존 파일은 그대로 둠.

## Migration Plan

1. 루트에서 `npx create-next-app@latest . --typescript --tailwind --app --eslint --src-dir=false --import-alias="@/*"` 실행
2. 충돌 방지: `cloude.md`, `openspec/`, `t&b.mp4`는 그대로 유지
3. `t&b.mp4` → `public/tnb.mp4` 복사
4. 컴포넌트·데이터 작성 후 `npm run dev`로 확인
5. 롤백: 필요 시 새로 추가된 Next.js 파일/폴더 제거 (기존 파일은 영향 없음)

## Open Questions

- 입학금 금액·구체 혜택 문구는 사용자 확정 필요 → 1차는 임시값으로 채움
- 실제 앱 10개의 정식 이름/설명/카테고리 → 1차는 더미 데이터, 사용자 제공 시 교체
- 로고/브랜드 컬러 → 1차는 중립 팔레트(슬레이트 + 인디고 강조)로 진행
