## Why

선생님용 앱 카드(예: "수행평가올인원") 중에는 엑셀 양식처럼 다운받아 바로 쓰는 파일이 필요한 경우가 있지만, 지금은 앱을 열어주는 링크(`url`)만 등록할 수 있고 파일을 직접 첨부/배포할 방법이 없다. 관리자가 파일을 올리고 로그인한 사용자가 바로 받아갈 수 있는 최소 기능이 필요하다.

## What Changes

- 앱(`managed_apps`)에 파일을 여러 개 첨부할 수 있는 `resources` 테이블과 전용 Storage 버킷(`resources`, 비공개)을 새로 만든다.
- 관리자 페이지(`app/admin/apps`)의 앱 수정 화면에 "첨부 자료" 섹션을 추가해 업로드·목록·삭제를 할 수 있게 한다.
- 사용자용 앱 상세 모달(`AppDetailModal`, `components/sections/RoomGallery.tsx`)에 "첨부 자료" 목록과 다운로드 버튼을 추가한다.
  - 로그인하지 않은 사용자에게는 다운로드 버튼 대신 로그인 유도 문구를 보여준다.
  - 로그인한 사용자는 버튼 클릭 시 서명된 URL을 발급받아 바로 다운로드한다.
- 파일 형식·용량 제한은 두지 않는다(관리자만 업로드하므로).

## Capabilities

### New Capabilities
- `app-resource-download`: 관리자가 앱별로 파일을 업로드하고, 로그인한 사용자가 앱 상세 화면에서 해당 파일을 다운로드하는 기능 전체(데이터 모델, 접근 권한, 업로드/다운로드 UI 동작)를 다룬다.

### Modified Capabilities
(없음 — 기존에 정의된 spec capability가 없음)

## Impact

- DB: 새 테이블 `resources` + RLS 정책, 새 SQL 파일(예: `supabase-resources-schema.sql`)
- Storage: 새 버킷 `resources`(비공개) + storage.objects RLS 정책
- 코드: `app/admin/apps/page.tsx`(업로드/목록/삭제 UI 추가), `components/sections/RoomGallery.tsx`의 `AppDetailModal`(목록/다운로드 UI 추가), 필요 시 `data/rooms.ts`에 타입 추가
- 기존 `managed_apps`, `posts`, `comments` 테이블 구조는 변경하지 않음
