create policy "worker_documents_select_all_roles"
on public.worker_documents
for select
using (
  has_role('super_admin')
  or has_role('admin')
  or has_role('user')
);

create policy "worker_documents_insert_admins"
on public.worker_documents
for insert
with check (
  has_role('super_admin')
  or has_role('admin')
);

create policy "worker_documents_update_admins"
on public.worker_documents
for update
using (
  has_role('super_admin')
  or has_role('admin')
)
with check (
  has_role('super_admin')
  or has_role('admin')
);

create policy "worker_documents_delete_admins"
on public.worker_documents
for delete
using (
  has_role('super_admin')
  or has_role('admin')
);
