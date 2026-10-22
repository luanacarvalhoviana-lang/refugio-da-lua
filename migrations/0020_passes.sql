create table if not exists story_passes (
  user_id text primary key,
  plan text not null check (plan in ('lua_cheia', 'constelacao'))
);

create table if not exists lembrancas (
  id text primary key,
  user_id text not null,
  story_slug text not null,
  lang text not null,
  scene_id text not null,
  titulo text not null,
  trecho text not null,
  criado_em timestamptz not null default now(),
  unique (user_id, story_slug, scene_id)
);
