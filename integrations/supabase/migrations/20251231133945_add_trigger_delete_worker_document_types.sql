create trigger audit_delete_worker_document_types
before delete on public.worker_document_types
for each row
execute function public.audit_delete();
