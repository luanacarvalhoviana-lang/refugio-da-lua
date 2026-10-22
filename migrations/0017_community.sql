create table if not exists choice_stats (
  story_slug text not null,
  lang text not null,
  scene_id text not null,
  choice_id text not null,
  total integer not null default 0,
  primary key (story_slug, lang, scene_id, choice_id)
);

create table if not exists choice_voters (
  story_slug text not null,
  lang text not null,
  scene_id text not null,
  voter text not null,
  choice_id text not null,
  primary key (story_slug, lang, scene_id, voter)
);

create table if not exists comments (
  id text primary key,
  story_slug text not null,
  lang text not null,
  scene_id text not null,
  user_id text not null,
  texto text not null,
  criado_em timestamptz not null default now(),
  status text not null default 'visivel' check (status in ('visivel', 'oculto', 'removido')),
  spoiler boolean not null default false
);

create index if not exists comments_scene
  on comments (story_slug, lang, scene_id, criado_em desc);

create table if not exists comment_reports (
  comment_id text not null references comments (id),
  user_id text not null,
  primary key (comment_id, user_id)
);
