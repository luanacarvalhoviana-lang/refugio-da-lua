create table if not exists pacto_acceptances (
  user_id text not null,
  versao integer not null,
  data_aceite timestamptz not null default now(),
  primary key (user_id, versao)
);
