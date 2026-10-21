create table if not exists waitlist (
  id text primary key,
  email text not null unique,
  name text,
  lang text not null check (lang in ('pt', 'es')),
  role_interest text not null check (role_interest in ('leitora', 'autora', 'ambas')),
  country text,
  referral_code text unique not null,
  referred_by text,
  consent boolean not null check (consent),
  ip_hash text,
  created_at timestamptz not null default now()
);

create index if not exists waitlist_created_idx on waitlist (created_at desc);
