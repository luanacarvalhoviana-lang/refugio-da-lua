create table if not exists author_tracks (
  id text primary key,
  user_id text not null,
  titulo text not null,
  mime text not null,
  audio text not null,
  direitos boolean not null default false,
  criado_em timestamptz not null default now()
);

create index if not exists author_tracks_user on author_tracks (user_id, criado_em desc);
