create table if not exists public.worker_documents (
  id uuid primary key default uuid_generate_v4(),
  worker_id uuid not null
    references public.workers(id)
    on delete cascade,
  file_name text not null,
  file_path text not null,
  file_type text,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_worker_documents_worker_id
  on public.worker_documents(worker_id);

-- Enable RLS
alter table public.worker_documents enable row level security;
