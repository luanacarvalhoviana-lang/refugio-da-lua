create table if not exists story_alerts (
  email text primary key,
  lang text not null check (lang in ('pt', 'es')),
  created_at timestamptz not null default now()
);
