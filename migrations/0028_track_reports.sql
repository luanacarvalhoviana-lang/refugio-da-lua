alter table author_tracks add column if not exists declaracao text;
alter table author_tracks add column if not exists status text not null default 'ativa';

create table if not exists track_reports (
  track_id text not null,
  user_id text not null,
  criado_em timestamptz not null default now(),
  primary key (track_id, user_id)
);
