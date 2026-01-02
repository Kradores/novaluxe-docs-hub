alter table public.company_documents
add column if not exists file_type text not null default 'application/octet-stream';

alter table public.company_documents
add column if not exists expiration_date date null;

create index if not exists idx_company_documents_expiration_date
on public.company_documents (expiration_date);

