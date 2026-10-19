-- managed_apps에 외부 다운로드 링크(구글 드라이브 등) 컬럼 추가 — 누구나 다운로드 가능
alter table managed_apps add column if not exists download_url text;
