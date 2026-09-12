alter table mural_letters
  add column if not exists energy_kinds jsonb not null default '{}'::jsonb;
