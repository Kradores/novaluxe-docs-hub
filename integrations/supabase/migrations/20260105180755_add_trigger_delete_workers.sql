create trigger audit_delete_workers
before delete on public.workers
for each row
execute function public.audit_delete();
