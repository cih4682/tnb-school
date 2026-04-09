-- posts 테이블
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  category text not null default '자유',
  author_id uuid not null,
  author_name text not null,
  view_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- comments 테이블
create table if not exists comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid not null references posts(id) on delete cascade,
  content text not null,
  author_id uuid not null,
  author_name text not null,
  created_at timestamptz default now()
);

-- RLS 활성화
alter table posts enable row level security;
alter table comments enable row level security;

-- posts RLS 정책
create policy "누구나 읽기" on posts for select using (true);
create policy "로그인 사용자 작성" on posts for insert with check (auth.uid() = author_id);
create policy "본인만 수정" on posts for update using (auth.uid() = author_id);
create policy "본인만 삭제" on posts for delete using (auth.uid() = author_id);

-- comments RLS 정책
create policy "누구나 읽기" on comments for select using (true);
create policy "로그인 사용자 작성" on comments for insert with check (auth.uid() = author_id);
create policy "본인만 삭제" on comments for delete using (auth.uid() = author_id);

-- 조회수 증가 함수
create or replace function increment_view_count(post_id uuid)
returns void as $$
begin
  update posts set view_count = view_count + 1 where id = post_id;
end;
$$ language plpgsql security definer;

-- 인덱스
create index idx_posts_created_at on posts(created_at desc);
create index idx_posts_category on posts(category);
create index idx_comments_post_id on comments(post_id);
