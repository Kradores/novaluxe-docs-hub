create table public.zip_jobs (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null,
  status text not null default 'pending'
    check (status in ('pending', 'running', 'ready', 'failed')),
  progress integer not null default 0,
  processed_bytes bigint not null default 0,
  total_bytes bigint not null default 0,
  error text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.zip_jobs enable row level security;
