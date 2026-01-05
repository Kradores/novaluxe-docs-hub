create trigger audit_delete_construction_sites
before delete on public.construction_sites
for each row
execute function public.audit_delete();
