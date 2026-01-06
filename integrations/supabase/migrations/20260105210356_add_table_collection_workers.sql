create table if not exists public.collection_workers (
  id uuid primary key default gen_random_uuid(),

  collection_id uuid not null
    references public.document_collections(id)
    on delete cascade,

  worker_id uuid not null
    references public.workers(id)
    on delete restrict,

  created_at timestamptz not null default now(),

  unique (collection_id, worker_id)
);

create index if not exists idx_collection_workers_collection
  on public.collection_workers(collection_id);
