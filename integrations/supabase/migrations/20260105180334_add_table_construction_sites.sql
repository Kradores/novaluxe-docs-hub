create table if not exists public.construction_sites (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- allow only unique names
create unique index if not exists
  construction_sites_name_unique
on public.construction_sites (lower(name));

alter table public.construction_sites enable row level security;
