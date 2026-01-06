create policy "document_collections_select_all_users"
on public.document_collections
for select
to authenticated
using (true);

create policy "document_collections_all_admins"
on public.document_collections
for all
to authenticated
using (has_role('admin') or has_role('super_admin'))
with check (has_role('admin') or has_role('super_admin'));
