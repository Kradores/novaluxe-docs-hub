create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),

  table_name text not null,
  record_id uuid not null,

  action text not null check (action in ('DELETE')),

  old_data jsonb not null,

  performed_by uuid references auth.users(id),
  performed_at timestamptz not null default now()
);

create index audit_logs_table_name_idx
  on public.audit_logs (table_name);

create index audit_logs_record_id_idx
  on public.audit_logs (record_id);

create index audit_logs_performed_by_idx
  on public.audit_logs (performed_by);

alter table public.audit_logs enable row level security;
