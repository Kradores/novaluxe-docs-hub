create or replace function public.claim_zip_job()
returns zip_jobs
language plpgsql
as $$
declare
  job zip_jobs;
begin
  update zip_jobs
  set
    status = 'running',
    attempts = attempts + 1,
    started_at = now(),
    updated_at = now()
  where id = (
    select id
    from zip_jobs
    where status = 'pending'
    order by created_at
    for update skip locked
    limit 1
  )
  returning * into job;

  return job;
end;
$$;
