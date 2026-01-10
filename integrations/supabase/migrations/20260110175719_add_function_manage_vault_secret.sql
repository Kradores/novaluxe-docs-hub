CREATE OR REPLACE FUNCTION public.manage_vault_secret(
  secret_name text, 
  secret_value text, 
  secret_description text DEFAULT ''
) 
RETURNS text 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
DECLARE
  existing_id uuid;
BEGIN
  SELECT id INTO existing_id FROM vault.secrets WHERE name = secret_name;

  IF existing_id IS NOT NULL THEN
    PERFORM vault.update_secret(existing_id, secret_value, secret_description);
    RETURN 'updated';
  ELSE
    PERFORM vault.create_secret(secret_value, secret_name, secret_description);
    RETURN 'created';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.manage_vault_secret FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.manage_vault_secret TO service_role;
