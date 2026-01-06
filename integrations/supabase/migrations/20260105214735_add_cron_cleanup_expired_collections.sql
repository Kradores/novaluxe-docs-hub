select
  cron.schedule(
    'cleanup-expired-collections',
    '0 3 * * *',
    $$ select public.cleanup_expired_collections(); $$
  );
