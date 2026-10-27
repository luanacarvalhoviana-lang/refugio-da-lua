-- English sits beside Portuguese and Spanish on the rows that already check the language.

do $$
declare r record;
begin
  for r in
    select c.conname, t.relname
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where n.nspname = 'public'
      and c.contype = 'c'
      and t.relname in ('waitlist', 'story_alerts', 'author_profiles', 'stories')
      and pg_get_constraintdef(c.oid) ilike '%''pt''%'
      and pg_get_constraintdef(c.oid) ilike '%''es''%'
      and pg_get_constraintdef(c.oid) not ilike '%''en''%'
  loop
    execute format('alter table %I drop constraint %I', r.relname, r.conname);
  end loop;
end $$;

alter table waitlist drop constraint if exists waitlist_lang_check;
alter table waitlist add constraint waitlist_lang_check check (lang in ('pt', 'es', 'en'));

alter table story_alerts drop constraint if exists story_alerts_lang_check;
alter table story_alerts add constraint story_alerts_lang_check check (lang in ('pt', 'es', 'en'));

alter table author_profiles drop constraint if exists author_profiles_idioma_check;
alter table author_profiles add constraint author_profiles_idioma_check check (idioma in ('pt', 'es', 'en'));

alter table stories drop constraint if exists stories_idioma_check;
alter table stories add constraint stories_idioma_check check (idioma in ('pt', 'es', 'en'));
