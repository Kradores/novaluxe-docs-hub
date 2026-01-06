create table if not exists public.collection_worker_document_types (
  id uuid primary key default gen_random_uuid(),

  collection_id uuid not null
    references public.document_collections(id)
    on delete cascade,

  worker_document_type_id uuid not null
    references public.worker_document_types(id)
    on delete restrict,

  created_at timestamptz not null default now(),

  unique (collection_id, worker_document_type_id)
);

create index if not exists idx_collection_worker_doc_types_collection
  on public.collection_worker_document_types(collection_id);
