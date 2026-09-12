create table if not exists mural_letters (
  id text primary key,
  author_id text not null,
  author_name text not null,
  initials text not null default '',
  title text not null,
  body text not null,
  excerpt text not null default '',
  topic text not null default 'Autocuidado',
  color text not null default 'lavender',
  energy integer not null default 0,
  gender text,
  age_group text,
  emotion text,
  hour integer,
  priority integer not null default 0,
  paper_key text,
  seal_key text,
  after_mural text,
  advice jsonb not null default '[]'::jsonb,
  hidden boolean not null default false,
  posted_at timestamptz not null default now()
);

create index if not exists mural_letters_posted_idx on mural_letters (posted_at desc) where hidden = false;
create index if not exists mural_letters_author_idx on mural_letters (author_id);
