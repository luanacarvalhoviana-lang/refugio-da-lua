create table if not exists reader_progress (
  user_id text not null,
  story_slug text not null,
  lang text not null,
  scene_id text not null,
  affinity integer not null default 0,
  clues jsonb not null default '[]'::jsonb,
  ending_key text,
  ending_title text,
  flower text,
  story_title text,
  updated_at timestamptz not null default now(),
  primary key (user_id, story_slug, lang)
);

create table if not exists reader_ages (
  user_id text primary key,
  birth_date date not null,
  updated_at timestamptz not null default now()
);
