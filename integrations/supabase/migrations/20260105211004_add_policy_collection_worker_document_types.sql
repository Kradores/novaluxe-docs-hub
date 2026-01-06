create policy "collection_worker_document_types_select_all_users"
on public.collection_worker_document_types
for select
to authenticated
using (true);

create policy "collection_worker_document_types_all_admins"
on public.collection_worker_document_types
for all
to authenticated
using (has_role('admin') or has_role('super_admin'))
with check (has_role('admin') or has_role('super_admin'));
