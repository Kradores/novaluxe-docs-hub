alter table public.document_collections
add column if not exists zip_status text not null default 'idle'
  check (zip_status in ('idle', 'processing', 'ready', 'failed'));

alter table public.document_collections
add column if not exists zip_path text;

alter table public.document_collections
add column if not exists zip_size bigint;

alter table public.document_collections
add column if not exists zip_generated_at timestamptz;
