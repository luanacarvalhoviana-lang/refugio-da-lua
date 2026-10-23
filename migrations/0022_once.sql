create table if not exists story_purchases (
  id text primary key,
  user_id text not null,
  item text not null,
  amount integer not null,
  status text not null default 'paid',
  stripe_session_id text unique,
  email text,
  criado_em timestamptz not null default now()
);

create index if not exists story_purchases_user on story_purchases (user_id, item);
