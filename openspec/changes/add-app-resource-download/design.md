## Context

현재 앱 데이터는 `managed_apps` 테이블 하나로 관리되고, Storage는 `images`(커뮤니티 에디터 이미지), `app-assets`(앱 프로필/영상) 두 공개(public) 버킷만 쓰고 있다(둘 다 `getPublicUrl`만 사용, signed URL 사용 사례 없음). 어드민 판별은 `app/admin/layout.tsx`에서 `profiles.role === 'admin'`을 클라이언트에서 확인하고, 실제 쓰기 권한은 Postgres RLS(`profiles.role = 'admin'` 체크)로 강제한다. 이 변경은 이 패턴을 그대로 재사용해 "앱별 첨부 자료" 기능을 추가한다.

## Goals / Non-Goals

**Goals:**
- 관리자가 앱(`managed_apps`) 단위로 파일을 여러 개 업로드/삭제할 수 있다.
- 로그인한 사용자는 해당 앱 상세 화면에서 첨부 파일을 다운로드할 수 있다.
- 비로그인 사용자에게는 다운로드가 막혀 있고 로그인을 유도한다.

**Non-Goals:**
- 파일 미리보기, 버전 관리, 다운로드 수 집계는 이번 범위에 넣지 않는다.
- 파일 형식/용량 제한, 바이러스 스캔 등은 다루지 않는다(관리자만 업로드).
- 앱이 아닌 커뮤니티 게시글 첨부파일은 범위 밖이다(기존 `images` 버킷/에디터와 무관).

## Decisions

1. **새 테이블 `resources`**(공개 URL을 쓰지 않으므로 `managed_apps`에 컬럼을 늘리기보다 1:N 테이블로 분리)
   - `id uuid primary key default gen_random_uuid()`
   - `app_id uuid not null references managed_apps(id) on delete cascade`
   - `file_name text not null` — 원본 파일명(다운로드 시 표시)
   - `storage_path text not null` — Storage 버킷 내 경로
   - `description text` — 선택, 자료 설명
   - `file_size bigint` — 선택, 업로드 시 기록
   - `created_by uuid references auth.users(id)` — 업로드한 관리자
   - `created_at timestamptz not null default now()`
   - 대안으로 검토했지만 기각: `managed_apps.resource_urls text[]` — 파일명/삭제/정렬을 다루기 번거로워 별도 테이블로 결정.

2. **Storage 버킷 `resources`는 비공개(private)로 생성** — 기존 두 버킷(`images`, `app-assets`)은 공개이지만, 로그인 사용자만 받게 하려면 공개 버킷의 `getPublicUrl`로는 접근 제어가 불가능하다. 비공개 버킷 + `createSignedUrl()`로 전환.
   - 대안: 공개 버킷 + 프런트엔드에서만 로그인 체크 — URL만 알면 누구나 받을 수 있어 "로그인 사용자만" 요구사항을 어겨서 기각.

3. **RLS는 기존 admin-write 패턴을 그대로 재사용**
   - `resources` 테이블: `insert/update/delete`는 `exists (select 1 from profiles where user_id = auth.uid() and role = 'admin')`, `select`는 `auth.role() = 'authenticated'`.
   - `storage.objects`(bucket_id = 'resources'): 동일한 패턴 — admin만 쓰기, 로그인 사용자만 읽기(`createSignedUrl` 발급에도 select 권한이 필요).
   - 이렇게 하면 별도의 서버 API 라우트(서비스 롤 키) 없이, 기존 anon-key 클라이언트에서 로그인 세션만으로 업로드/다운로드가 가능하다. `app/api/admin/*`의 서비스 롤 패턴은 이번 기능에는 불필요.

4. **업로드/다운로드는 클라이언트에서 직접 Supabase Storage 호출** (기존 `app/admin/apps/page.tsx`의 업로드 패턴과 동일한 스타일)
   - 업로드: `supabase.storage.from('resources').upload(path, file)` → 성공 시 `resources` 테이블에 메타데이터 insert.
   - 다운로드: `supabase.storage.from('resources').createSignedUrl(path, 60)` → 받은 URL로 이동/다운로드.
   - 경로 규칙: `${app_id}/${Date.now()}-${원본파일명}` (기존 `app-assets`의 `${kind}/${Date.now()}-${random}.${ext}` 패턴과 동일한 네이밍 철학).

5. **UI 배치**
   - 관리자: `app/admin/apps/page.tsx`의 앱 수정 모달에 "첨부 자료" 섹션 추가(업로드 input, 목록, 삭제 버튼). 별도 페이지를 새로 만들지 않고 기존 모달을 확장한다.
   - 사용자: `components/sections/RoomGallery.tsx`의 `AppDetailModal`에 "첨부 자료" 리스트 추가. 로그인 여부는 기존에 쓰이는 `supabase.auth.getUser()` 패턴으로 확인.

## Risks / Trade-offs

- [서명된 URL의 만료 시간(60초)이 너무 짧아 큰 파일 다운로드 중 끊길 수 있음] → 다운로드는 URL 발급 즉시 새 탭으로 열기만 하면 되므로 브라우저가 다운로드를 시작한 뒤에는 만료와 무관하게 이어받는다(필요하면 추후 만료 시간을 늘릴 수 있음).
- [비공개 버킷 전환으로 기존 공개 버킷 업로드 코드와 패턴이 달라짐(한쪽은 `getPublicUrl`, 한쪽은 `createSignedUrl`)] → 혼동 방지를 위해 주석/네이밍으로 구분하고, 재사용 가능한 작은 헬퍼로 묶는 것을 구현 단계에서 고려.
- [`managed_apps` 삭제 시 연결된 Storage 파일은 `on delete cascade`로 DB 행만 지워지고 실제 Storage 객체는 안 지워짐 — 고아 파일 발생 가능] → 이번 범위에서는 수용(관리자 수가 적고 파일 수도 적을 것으로 예상); 필요해지면 추후 정리 작업/트리거로 보완.

## Migration Plan

1. `supabase-resources-schema.sql` 작성 및 Supabase 프로젝트에 적용(테이블 + RLS).
2. Supabase 대시보드(또는 SQL)에서 `resources` Storage 버킷을 비공개로 생성 + storage RLS 정책 적용.
3. 어드민 UI, 사용자 UI 순서로 구현.
4. 로컬에서 관리자 계정으로 업로드 → 일반 계정으로 로그인 다운로드 → 비로그인 상태 확인, 순서로 수동 테스트.
5. 배포(`vercel --prod`)는 기존 배포 방식 그대로 사용.

롤백은 새로 추가된 테이블/버킷/UI 블록을 되돌리는 것으로 충분하며, 기존 테이블/기능에는 영향이 없다.

## Open Questions

- (없음 — 탐색 단계에서 범위를 이미 확정함: 기존 앱 카드에 연결, 로그인 사용자만 다운로드, 파일 제한 없음)
