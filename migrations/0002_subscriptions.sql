create table if not exists vip_subscriptions (
  email text primary key,
  plan text not null,
  status text not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  updated_at timestamptz not null default now()
);
create index if not exists vip_subscriptions_customer_idx on vip_subscriptions (stripe_customer_id);
