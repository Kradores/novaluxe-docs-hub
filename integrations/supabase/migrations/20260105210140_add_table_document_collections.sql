create table if not exists public.document_collections (
  id uuid primary key default gen_random_uuid(),

  construction_site_id uuid not null
    references public.construction_sites(id)
    on delete cascade,

  name text not null,

  share_token uuid not null unique,

  expires_at timestamptz not null,

  created_at timestamptz not null default now()
);

create index if not exists idx_document_collections_site
  on public.document_collections(construction_site_id);

create index if not exists idx_document_collections_expires
  on public.document_collections(expires_at);
