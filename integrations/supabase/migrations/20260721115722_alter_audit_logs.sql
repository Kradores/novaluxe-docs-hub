alter table public.audit_logs
drop constraint if exists audit_logs_performed_by_fkey;

-- Allow more audit actions in the future
alter table public.audit_logs
drop constraint if exists audit_logs_action_check;

alter table public.audit_logs
add constraint audit_logs_action_check
check (action in ('INSERT', 'UPDATE', 'DELETE'));

-- Add additional audit metadata
alter table public.audit_logs
add column if not exists new_data jsonb,
add column if not exists performed_by_email text,
add column if not exists performed_by_name text;

-- Optional: index for filtering by email
create index if not exists audit_logs_performed_by_email_idx
    on public.audit_logs (performed_by_email);