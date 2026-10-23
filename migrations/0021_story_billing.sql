alter table story_passes add column if not exists status text not null default 'active';
alter table story_passes add column if not exists intervalo text;
alter table story_passes add column if not exists email text;
alter table story_passes add column if not exists stripe_customer_id text;
alter table story_passes add column if not exists stripe_subscription_id text;
alter table story_passes add column if not exists started_at timestamptz not null default now();
alter table story_passes add column if not exists cancel_at timestamptz;
