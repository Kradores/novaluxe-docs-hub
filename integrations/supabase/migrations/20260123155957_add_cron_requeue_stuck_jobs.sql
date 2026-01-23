select
  cron.schedule(
    'requeue-stuck-jobs',
    '*/3 * * * *',
    $$ 
      update zip_jobs
        set status = 'pending',
          updated_at = now()
        where status = 'running'
          and updated_at < now() - interval '15 minutes'
          and attempts < 5;

      update zip_jobs
        set
          status = 'failed',
          last_error = 'Exceeded retry limit',
          updated_at = now()
        where status = 'running'
          and updated_at < now() - interval '15 minutes'
          and attempts >= 5;
    $$
  );
