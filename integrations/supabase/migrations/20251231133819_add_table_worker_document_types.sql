create table if not exists public.worker_document_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- allow only unique names
create unique index if not exists
  worker_document_types_name_unique
on public.worker_document_types (lower(name));

alter table public.worker_document_types enable row level security;
