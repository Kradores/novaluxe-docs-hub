create table if not exists public.collection_documents (
  id uuid primary key default gen_random_uuid(),

  collection_id uuid not null
    references public.document_collections(id)
    on delete cascade,

  document_id uuid not null
    references public.company_documents(id)
    on delete cascade,

  created_at timestamptz not null default now(),

  unique (collection_id, document_id)
);

create index if not exists idx_collection_documents_collection
  on public.collection_documents(collection_id);
