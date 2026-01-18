CREATE TRIGGER ensure_user_email_invited
BEFORE INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.check_user_invited();