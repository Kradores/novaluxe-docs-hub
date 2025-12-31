create trigger audit_delete_worker_documents
before delete on public.worker_documents
for each row
execute function public.audit_delete();
