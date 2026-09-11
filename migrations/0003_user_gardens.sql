create table if not exists user_gardens (
  user_id text primary key,
  email text,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create index if not exists user_gardens_email_idx on user_gardens (email);
