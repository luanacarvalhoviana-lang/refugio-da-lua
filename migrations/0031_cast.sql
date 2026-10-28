create table if not exists story_cast (
  id text primary key,
  story_id text not null references stories (id) on delete cascade,
  nome text not null,
  vida text not null default '',
  ordem integer not null default 0
);

create index if not exists story_cast_story on story_cast (story_id, ordem);
