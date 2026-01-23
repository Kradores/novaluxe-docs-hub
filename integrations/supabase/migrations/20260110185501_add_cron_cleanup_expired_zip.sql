SELECT cron.schedule(
  'cleanup-expired-zips',
  '0 2 * * *',
  $$
  DO $do$
  DECLARE
    kong_url text;
    anon_key text;
  BEGIN
    SELECT decrypted_secret INTO kong_url FROM vault.decrypted_secrets WHERE name = 'kong_url';
    SELECT decrypted_secret INTO anon_key FROM vault.decrypted_secrets WHERE name = 'anon_key';

    IF kong_url IS NOT NULL AND anon_key IS NOT NULL THEN
      PERFORM
        net.http_post(
          url := kong_url || '/functions/v1/cleanup-expired-zips',
          headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || anon_key
          )
        );
    END IF;
  END $do$;
  $$
);
