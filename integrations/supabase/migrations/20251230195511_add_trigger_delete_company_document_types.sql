create trigger audit_delete_company_document_types
before delete on public.company_document_types
for each row
execute function public.audit_delete();
