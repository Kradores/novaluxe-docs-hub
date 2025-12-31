create policy "worker_document_types_select_all_roles"
on public.worker_document_types
for select
using (
  has_role('super_admin')
  or has_role('admin')
  or has_role('user')
);

create policy "worker_document_types_insert_admins"
on public.worker_document_types
for insert
with check (
  has_role('super_admin')
  or has_role('admin')
);

create policy "worker_document_types_update_admins"
on public.worker_document_types
for update
using (
  has_role('super_admin')
  or has_role('admin')
)
with check (
  has_role('super_admin')
  or has_role('admin')
);

create policy "worker_document_types_delete_admins"
on public.worker_document_types
for delete
using (
  has_role('super_admin')
  or has_role('admin')
);