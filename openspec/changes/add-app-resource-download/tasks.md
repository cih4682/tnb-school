## 1. DB & Storage 설정

- [x] 1.1 `supabase-resources-schema.sql` 작성: `resources` 테이블(app_id, file_name, storage_path, description, file_size, created_by, created_at) 생성
- [x] 1.2 `resources` 테이블 RLS 정책 작성: insert/update/delete는 admin만, select는 로그인 사용자(authenticated)만
- [x] 1.3 Supabase에서 `resources` Storage 버킷을 비공개로 생성 (SQL에 upsert 포함, 적용은 1.5에서)
- [x] 1.4 `storage.objects`(bucket_id = 'resources') RLS 정책 작성: 쓰기는 admin만, 읽기는 로그인 사용자만
- [ ] 1.5 Supabase 프로젝트에 SQL 적용 및 버킷/정책 동작 확인 — **사용자가 Supabase SQL Editor에서 `supabase-resources-schema.sql` 실행 필요** (로컬에 서비스 롤 키/DB 접속 정보 없어 에이전트가 직접 적용 불가)

## 2. 관리자 UI — 첨부 자료 관리

- [x] 2.1 `app/admin/apps/page.tsx`의 앱 수정 모달에 "첨부 자료" 섹션 추가(목록 UI)
- [x] 2.2 파일 업로드 기능 구현: `resources` 버킷에 업로드 후 `resources` 테이블에 메타데이터 insert
- [x] 2.3 업로드 중 로딩/에러 처리(기존 app-assets 업로드 패턴과 동일한 스타일)
- [x] 2.4 자료 삭제 기능 구현(Storage 객체 + `resources` 레코드 삭제)

## 3. 사용자 UI — 자료 다운로드

- [x] 3.1 `data/rooms.ts`(또는 관련 타입)에 앱별 `resources` 목록을 담는 타입/조회 로직 추가
- [x] 3.2 `components/sections/RoomGallery.tsx`의 `AppDetailModal`에서 해당 앱의 `resources`를 불러와 "첨부 자료" 섹션 렌더링
- [x] 3.3 로그인 여부 확인(`supabase.auth.getUser()`) 후 분기: 비로그인 → 로그인 안내 + `/login` 링크, 로그인 → 다운로드 버튼
- [x] 3.4 다운로드 버튼 클릭 시 `createSignedUrl` 호출 후 새 탭/다운로드 트리거 구현
- [x] 3.5 첨부 자료가 없는 앱에서는 섹션 자체가 보이지 않도록 처리

## 4. 검증 & 배포

- [ ] 4.1 관리자 계정으로 파일 업로드 → 목록 표시 → 삭제까지 수동 테스트 — 1.5(DB/Storage 적용) 이후 가능
- [ ] 4.2 로그인한 일반 사용자 계정으로 다운로드 동작 확인 — 1.5 이후 가능
- [ ] 4.3 비로그인 상태에서 다운로드 버튼이 보이지 않고 로그인 안내가 뜨는지 확인 — 1.5 이후 가능
- [x] 4.4 `npm run build` 통과 확인
- [ ] 4.5 커밋 후 `vercel --prod` 배포
