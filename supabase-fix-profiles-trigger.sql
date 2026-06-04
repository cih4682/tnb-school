-- ============================================================
-- 신규 가입자가 admin 에 안 보이는 문제의 근본 해결
-- Supabase 대시보드 → SQL Editor 에 "전체 복사 → 실행" 한 번이면 끝.
-- (SQL Editor 는 postgres 권한이라 auth.users 읽기/DDL/RLS 우회가 모두 됨)
-- ============================================================

-- ── 0. 진단: 지금 상태 확인 ───────────────────────────────
-- auth.users(진짜 가입자 수) vs profiles(명단에 보이는 수)
select
  (select count(*) from auth.users)      as auth_users_count,
  (select count(*) from public.profiles) as profiles_count;

-- 문제의 계정이 실제로 가입(auth.users)돼 있는지 확인
select id, email, created_at
from auth.users
where email ilike '%icasone7%';
-- → 행이 나오면: 가입은 됐는데 profiles 가 없는 것 (아래 1~3 이 해결)
-- → 행이 없으면: 가입(OAuth) 자체가 완료 안 된 것 (로그인 흐름 문제)


-- ── 1. plan 제약을 앱 실제 값에 맞춤 (free/basic/pro/team) ──
alter table public.profiles drop constraint if exists profiles_plan_check;
alter table public.profiles
  add constraint profiles_plan_check
  check (plan in ('free', 'basic', 'pro', 'team'));


-- ── 2. 가입 시 profiles 자동 생성 트리거 (재)설치 ──────────
-- security definer + search_path 고정: RLS 무관, 테이블 못 찾는 오류 방지.
-- on conflict do nothing: 어떤 경우에도 가입 자체를 깨뜨리지 않음(멱등).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, name, email)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1),
      '익명'
    ),
    new.email
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ── 3. 기존 가입자 중 profiles 없는 사람 전원 백필 ─────────
-- icasone7 포함, 지금까지 누락된 모든 auth.users 를 한 번에 채움.
insert into public.profiles (user_id, name, email)
select
  u.id,
  coalesce(
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'name',
    split_part(u.email, '@', 1),
    '익명'
  ),
  u.email
from auth.users u
left join public.profiles p on p.user_id = u.id
where p.user_id is null
on conflict (user_id) do nothing;


-- ── 4. 확인: 이제 두 수가 같아야 함 ───────────────────────
select
  (select count(*) from auth.users)      as auth_users_count,
  (select count(*) from public.profiles) as profiles_count;
