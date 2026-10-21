create table if not exists reader_choices (
  story_slug text not null,
  lang text not null,
  scene_id text not null,
  choice_id text not null,
  reader_key text not null,
  updated_at timestamptz not null default now(),
  primary key (story_slug, lang, scene_id, reader_key)
);

create table if not exists reader_notes (
  id text primary key,
  story_slug text not null,
  lang text not null,
  scene_id text not null,
  choice_id text not null,
  user_id text not null,
  pen_name text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists reader_notes_choice
  on reader_notes (story_slug, lang, scene_id, choice_id, created_at desc);

create table if not exists community_stories (
  slug text primary key,
  lang text not null,
  user_id text not null,
  title text not null,
  published boolean not null default true,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists community_stories_lang
  on community_stories (lang, published, updated_at desc);
