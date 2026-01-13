create table public.collection_uploaded_documents (
  id uuid primary key default gen_random_uuid(),
  document_collection_id uuid not null
    references public.document_collections(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  file_size integer,
  file_type text,
  created_at timestamptz not null default now()
);

alter table public.collection_uploaded_documents enable row level security;
