-- ============================================
-- profiles 테이블 (사용자 프로필)
-- ============================================
create table if not exists profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null unique,
  name text not null default '익명',
  email text,
  role text not null default 'user' check (role in ('user', 'admin')),
  plan text not null default 'free' check (plan in ('free', 'standard', 'premium')),
  created_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "누구나 읽기" on profiles for select using (true);
create policy "본인만 수정" on profiles for update using (auth.uid() = user_id);
create policy "서비스 삽입" on profiles for insert with check (true);

-- 회원가입 시 자동 생성 트리거
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (user_id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================
-- managed_apps 테이블 (앱 100개 등록)
-- ============================================
create table if not exists managed_apps (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null default '기타',
  description text default '',
  url text default '',
  icon_url text default '',
  status text not null default 'active' check (status in ('active', 'inactive', 'coming')),
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table managed_apps enable row level security;
create policy "누구나 읽기" on managed_apps for select using (true);
create policy "관리자만 추가" on managed_apps for insert with check (
  exists (select 1 from profiles where user_id = auth.uid() and role = 'admin')
);
create policy "관리자만 수정" on managed_apps for update using (
  exists (select 1 from profiles where user_id = auth.uid() and role = 'admin')
);
create policy "관리자만 삭제" on managed_apps for delete using (
  exists (select 1 from profiles where user_id = auth.uid() and role = 'admin')
);

-- ============================================
-- user_apps 테이블 (사용자별 앱 권한)
-- ============================================
create table if not exists user_apps (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  app_id uuid not null references managed_apps(id) on delete cascade,
  granted_at timestamptz default now(),
  unique(user_id, app_id)
);

alter table user_apps enable row level security;
create policy "본인 권한 읽기" on user_apps for select using (auth.uid() = user_id);
create policy "관리자 읽기" on user_apps for select using (
  exists (select 1 from profiles where user_id = auth.uid() and role = 'admin')
);
create policy "관리자만 추가" on user_apps for insert with check (
  exists (select 1 from profiles where user_id = auth.uid() and role = 'admin')
);
create policy "관리자만 삭제" on user_apps for delete using (
  exists (select 1 from profiles where user_id = auth.uid() and role = 'admin')
);

-- ============================================
-- 관리자용 profiles 수정 권한 (플랜 변경, 관리자 지정)
-- ============================================
create policy "관리자가 수정" on profiles for update using (
  exists (select 1 from profiles where user_id = auth.uid() and role = 'admin')
);

-- posts/comments 관리자 삭제 권한
create policy "관리자 글 삭제" on posts for delete using (
  exists (select 1 from profiles where user_id = auth.uid() and role = 'admin')
);
create policy "관리자 댓글 삭제" on comments for delete using (
  exists (select 1 from profiles where user_id = auth.uid() and role = 'admin')
);

-- 인덱스
create index idx_profiles_user_id on profiles(user_id);
create index idx_profiles_role on profiles(role);
create index idx_managed_apps_status on managed_apps(status);
create index idx_user_apps_user_id on user_apps(user_id);
create index idx_user_apps_app_id on user_apps(app_id);
