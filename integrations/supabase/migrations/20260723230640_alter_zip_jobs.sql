alter table public.zip_jobs
    add column if not exists stage text not null default 'preparing'
        check (stage in ('preparing', 'downloading', 'compressing', 'uploading', 'completed', 'finalizing'));