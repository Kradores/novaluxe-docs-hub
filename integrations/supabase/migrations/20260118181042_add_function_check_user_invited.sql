CREATE OR REPLACE FUNCTION public.check_user_invited()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.email = 'nicolai@novaluxedynamics.com' THEN
    RETURN NEW;

  ELSIF EXISTS (
    SELECT 1 
    FROM public.user_invitations 
    WHERE email = NEW.email
  ) THEN
    RETURN NEW;

  ELSE
    RAISE EXCEPTION 'Email % is not authorized.', NEW.email;
  END IF;
END;
$$;
