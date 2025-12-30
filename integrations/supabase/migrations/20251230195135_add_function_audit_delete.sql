create or replace function public.audit_delete()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.audit_logs (
    table_name,
    record_id,
    action,
    old_data,
    performed_by
  )
  values (
    tg_table_name,
    old.id,
    'DELETE',
    to_jsonb(old),
    auth.uid()
  );

  return old;
end;
$$;
