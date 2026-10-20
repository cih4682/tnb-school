-- managed_apps에 공개 범위 칼럼 추가
--   public    : 누구나 (로그인 불필요)
--   member    : 가입한 선생님 (기본값)
--   supporter : 후원자 이상 (supporter / corporate / partner)
alter table managed_apps add column if not exists access_level text not null default 'member';

alter table managed_apps drop constraint if exists managed_apps_access_level_check;
alter table managed_apps add constraint managed_apps_access_level_check
  check (access_level in ('public', 'member', 'supporter'));

-- 수행평가 올인원 → 후원자 이상
update managed_apps set access_level = 'supporter' where name like '%수행평가%';

-- 확인
select name, access_level from managed_apps order by sort_order;
