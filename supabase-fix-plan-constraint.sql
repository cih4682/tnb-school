-- ============================================
-- 운영 DB 적용용 마이그레이션
-- profiles.plan 제약을 앱 실제 값(free/basic/pro/team)에 맞춘다.
-- 기존 제약은 free/standard/premium 만 허용해서
-- 관리자 플랜 변경(basic/pro/team)이 조용히 실패하고 있었다.
-- Supabase SQL Editor 에서 한 번 실행하면 된다.
-- ============================================

alter table profiles drop constraint if exists profiles_plan_check;

alter table profiles
  add constraint profiles_plan_check
  check (plan in ('free', 'basic', 'pro', 'team'));
