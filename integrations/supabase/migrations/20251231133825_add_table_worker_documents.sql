create table if not exists public.worker_documents (
  id uuid primary key default gen_random_uuid(),

  worker_id uuid not null,
  worker_document_type_id uuid not null,

  file_name text not null,
  file_path text not null,

  created_at timestamptz not null default now(),

  constraint fk_worker_documents_worker_document_type
    foreign key (worker_document_type_id)
    references public.worker_document_types (id)
    on delete restrict
);

create index if not exists
  worker_documents_worker_document_type_id_idx
on public.worker_documents (worker_document_type_id);

alter table public.worker_documents enable row level security;
