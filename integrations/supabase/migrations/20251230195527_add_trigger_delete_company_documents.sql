create trigger audit_delete_company_documents
before delete on public.company_documents
for each row
execute function public.audit_delete();
