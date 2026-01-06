
create table if not exists public.alpha_signals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  asset text not null,
  direction text not null check (direction in ('bullish','bearish','neutral')),
  confidence double precision not null,
  time_horizon text not null,
  insight text not null,
  sources integer not null default 0,
  category text not null,
  source text not null check (source in ('live','demo')),
  provider text not null,
  created_at timestamptz not null default now()
);

create index if not exists alpha_signals_user_id_created_at_idx
  on public.alpha_signals (user_id, created_at desc);

create table if not exists public.alpha_signal_attributions (
  id uuid primary key default gen_random_uuid(),
  signal_id uuid not null references public.alpha_signals(id) on delete cascade,
  source text not null,
  snippet text not null,
  url text null,
  sentiment double precision not null default 0,
  confidence double precision not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists alpha_signal_attributions_signal_id_created_at_idx
  on public.alpha_signal_attributions (signal_id, created_at desc);

