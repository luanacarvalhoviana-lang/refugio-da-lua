create table if not exists subscriptions (
  id text primary key,
  user_id text unique not null,
  plan text not null check (plan in ('lua_cheia', 'constelacao')),
  interval text not null check (interval in ('month', 'year')),
  status text not null check (status in ('active', 'trialing', 'past_due', 'canceled')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists monthly_pack_claims (
  user_id text not null,
  month text not null,
  product_id text not null,
  primary key (user_id, month)
);

insert into subscriptions (id, user_id, plan, interval, status, stripe_customer_id, stripe_subscription_id, created_at, updated_at)
select 'sub-' || user_id, user_id, plan, coalesce(intervalo, 'month'), 'active', stripe_customer_id, stripe_subscription_id, started_at, now()
from story_passes
where status = 'active' and plan in ('lua_cheia', 'constelacao')
on conflict (user_id) do nothing;
