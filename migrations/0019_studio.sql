create table if not exists stories (
  id text primary key,
  autora_id text not null,
  slug text not null unique,
  titulo text not null,
  sinopse text not null,
  idioma text not null check (idioma in ('pt', 'es')),
  classificacao text not null check (classificacao in ('livre', '14', '16')),
  generos text not null default '',
  lugar text not null default '',
  som text,
  status text not null default 'rascunho' check (status in ('rascunho', 'em_revisao', 'publicada', 'recusada')),
  motivo text,
  criada_em timestamptz not null default now()
);

create index if not exists stories_autora on stories (autora_id, status);
create index if not exists stories_publica on stories (idioma, status);

create table if not exists scenes (
  id text primary key,
  story_id text not null references stories (id) on delete cascade,
  ordem integer not null,
  quem_fala text,
  texto text not null default '',
  musica text
);

create index if not exists scenes_story on scenes (story_id, ordem);

create table if not exists choices (
  id text primary key,
  scene_id text not null references scenes (id) on delete cascade,
  texto text not null,
  vai_para_cena text,
  afinidade integer not null default 0 check (afinidade between -1 and 2),
  pista text,
  ordem integer not null default 0
);

create table if not exists endings (
  id text primary key,
  story_id text not null references stories (id) on delete cascade,
  scene_id text not null unique references scenes (id) on delete cascade,
  titulo text not null,
  texto text not null,
  flor text not null
);
