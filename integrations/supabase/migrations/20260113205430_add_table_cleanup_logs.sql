create table public.cleanup_logs (
  id uuid primary key default gen_random_uuid(),

  function_name text not null,
  bucket text not null,

  scanned_count integer not null,
  orphaned_count integer not null,
  deleted_count integer not null,

  dry_run boolean not null,
  min_file_age_hours integer not null,
  max_deletions integer not null,

  created_at timestamptz not null default now()
);

alter table public.cleanup_logs enable row level security;
