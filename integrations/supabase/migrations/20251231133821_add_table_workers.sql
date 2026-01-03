create table if not exists public.workers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  photo_path text,
  status text not null default 'active'
    check (status in ('active', 'laidOff')),
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_workers_status on public.workers(status);
create index if not exists idx_workers_full_name on public.workers(full_name);

-- Enable RLS
alter table public.workers enable row level security;
