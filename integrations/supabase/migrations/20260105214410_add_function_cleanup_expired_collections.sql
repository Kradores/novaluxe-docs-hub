create or replace function public.cleanup_expired_collections()
returns integer
language plpgsql
security definer
as $$
declare
  deleted_count integer;
begin
  delete from public.document_collections
  where expires_at < now();

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;
