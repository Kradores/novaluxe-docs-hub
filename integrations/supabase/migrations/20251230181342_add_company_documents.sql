create table if not exists public.company_documents (
  id uuid primary key default gen_random_uuid(),

  company_id uuid not null,
  company_document_type_id uuid not null,

  file_name text not null,
  file_path text not null,

  created_at timestamptz not null default now(),

  constraint fk_company_documents_company_document_type
    foreign key (company_document_type_id)
    references public.company_document_types (id)
    on delete restrict
);

create index if not exists
  company_documents_company_document_type_id_idx
on public.company_documents (company_document_type_id);

alter table public.company_documents enable row level security;
