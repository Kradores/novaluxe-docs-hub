create policy "collection_company_documents_select_all_users"
on public.collection_company_documents
for select
to authenticated
using (true);

create policy "collection_company_documents_all_admins"
on public.collection_company_documents
for all
to authenticated
using (has_role('admin') or has_role('super_admin'))
with check (has_role('admin') or has_role('super_admin'));
