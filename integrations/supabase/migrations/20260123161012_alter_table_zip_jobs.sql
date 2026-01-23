alter table zip_jobs
add column attempts integer not null default 0,
add column last_error text,
add column started_at timestamptz;
