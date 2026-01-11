create table if not exists public.collection_company_documents (
  id uuid primary key default gen_random_uuid(),

  collection_id uuid not null
    references public.document_collections(id)
    on delete cascade,

  company_document_id uuid not null
    references public.company_documents(id)
    on delete cascade,

  created_at timestamptz not null default now(),

  unique (collection_id, company_document_id)
);

create index if not exists idx_collection_company_documents_collection
  on public.collection_company_documents(collection_id);
