create table if not exists author_profiles (
  user_id text unique,
  nome_publico text not null,
  slug text primary key,
  bio text not null default '',
  foto text,
  idioma text not null check (idioma in ('pt', 'es')),
  selo_fundadora boolean not null default false,
  criado_em timestamptz not null default now()
);

create table if not exists follows (
  seguidora_id text not null,
  autora_id text not null,
  primary key (seguidora_id, autora_id)
);

create index if not exists follows_autora on follows (autora_id);

insert into author_profiles (user_id, nome_publico, slug, bio, foto, idioma, selo_fundadora)
values (
  'casa:luana-viana',
  'Luana Viana',
  'luana-viana',
  'Escreve as histórias da casa. Romance e mistério entre mulheres, de noite.',
  '/icons/logo-day.png',
  'pt',
  true
)
on conflict (slug) do nothing;
