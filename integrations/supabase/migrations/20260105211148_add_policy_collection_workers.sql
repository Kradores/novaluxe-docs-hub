create policy "collection_workers_select_all_users"
on public.collection_workers
for select
to authenticated
using (true);

create policy "collection_workers_all_admins"
on public.collection_workers
for all
to authenticated
using (has_role('admin') or has_role('super_admin'))
with check (has_role('admin') or has_role('super_admin'));
