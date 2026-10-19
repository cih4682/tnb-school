-- ============================================
-- resources 테이블 (앱별 첨부 자료 — 업로드/다운로드)
-- ============================================
create table if not exists resources (
  id uuid default gen_random_uuid() primary key,
  app_id uuid not null references managed_apps(id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  description text,
  file_size bigint,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

alter table resources enable row level security;

create policy "로그인 사용자 읽기" on resources for select using (
  auth.role() = 'authenticated'
);
create policy "관리자만 추가" on resources for insert with check (
  exists (select 1 from profiles where user_id = auth.uid() and role = 'admin')
);
create policy "관리자만 수정" on resources for update using (
  exists (select 1 from profiles where user_id = auth.uid() and role = 'admin')
);
create policy "관리자만 삭제" on resources for delete using (
  exists (select 1 from profiles where user_id = auth.uid() and role = 'admin')
);

create index idx_resources_app_id on resources(app_id);

-- ============================================
-- Storage 버킷: resources (비공개 — 업로드한 파일 다운로드용)
-- ============================================
-- 대시보드에서 버킷을 만든 경우 아래 insert는 건너뛰어도 되지만,
-- SQL만으로 설정할 때를 위해 upsert 형태로 넣어둔다.
insert into storage.buckets (id, name, public)
values ('resources', 'resources', false)
on conflict (id) do update set public = false;

create policy "로그인 사용자 다운로드" on storage.objects for select using (
  bucket_id = 'resources' and auth.role() = 'authenticated'
);
create policy "관리자만 업로드" on storage.objects for insert with check (
  bucket_id = 'resources'
  and exists (select 1 from profiles where user_id = auth.uid() and role = 'admin')
);
create policy "관리자만 삭제(storage)" on storage.objects for delete using (
  bucket_id = 'resources'
  and exists (select 1 from profiles where user_id = auth.uid() and role = 'admin')
);
