## 1. 프로젝트 초기화

- [x] 1.1 Next.js 14 + TS + Tailwind 구조를 수동 작성 (대화형 CLI 회피, 기존 파일 유지)
- [x] 1.2 `t&b.mp4`를 `public/tnb.mp4`로 복사
- [x] 1.3 `tailwind.config.ts`에 브랜드 컬러(인디고 강조) 추가, `app/globals.css` 기본 정리
- [x] 1.4 `app/layout.tsx`에 한글 폰트(Noto Sans KR) 적용 및 메타데이터 설정

## 2. 데이터 모델

- [x] 2.1 `data/apps.ts` 생성: `App` 타입 정의
- [x] 2.2 `Category` 유니온 타입 정의
- [x] 2.3 더미 앱 10개 데이터 작성
- [x] 2.4 카테고리 라벨 매핑 객체 export

## 3. 공통 컴포넌트

- [x] 3.1 `components/ui/Button.tsx`
- [x] 3.2 `components/ui/Section.tsx`
- [x] 3.3 `components/Navbar.tsx`

## 4. 섹션 컴포넌트

- [x] 4.1 `components/sections/Hero.tsx`
- [x] 4.2 `components/sections/Values.tsx`
- [x] 4.3 `components/sections/Counter.tsx`
- [x] 4.4 `components/sections/AppGallery.tsx`
- [x] 4.5 `components/sections/Pricing.tsx`
- [x] 4.6 `components/sections/CustomForm.tsx`
- [x] 4.7 `components/sections/FAQ.tsx`
- [x] 4.8 `components/sections/Footer.tsx`

## 5. 페이지 조립

- [x] 5.1 `app/page.tsx`에서 7개 섹션을 순서대로 배치
- [x] 5.2 각 섹션에 앵커 id 부여
- [x] 5.3 Navbar 링크와 앵커 연결 (CSS `scroll-behavior: smooth`)

## 6. 검증

- [ ] 6.1 `npm install` 후 `npm run dev`로 로컬 실행 — **사용자 환경에서 직접 확인 필요**
- [ ] 6.2 카테고리 필터 동작 확인
- [ ] 6.3 폼 검증 동작 확인
- [ ] 6.4 모바일 반응형 확인
- [ ] 6.5 `npm run build` 성공 확인
