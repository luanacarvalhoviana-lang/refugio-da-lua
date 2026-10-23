alter table choices add column if not exists diario text;
alter table endings add column if not exists carta text;
alter table endings add column if not exists carta_de text;

create table if not exists kept_letters (
  user_id text not null,
  story_slug text not null,
  lang text not null,
  ending_key text not null,
  story_title text not null,
  de text not null,
  texto text not null,
  criado_em timestamptz not null default now(),
  primary key (user_id, story_slug, lang, ending_key)
);
