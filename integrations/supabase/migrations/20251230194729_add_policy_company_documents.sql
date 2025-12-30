create policy "company_documents_select_all_roles"
on public.company_documents
for select
using (
  has_role('super_admin')
  or has_role('admin')
  or has_role('user')
);

create policy "company_documents_insert_admins"
on public.company_documents
for insert
with check (
  has_role('super_admin')
  or has_role('admin')
);

create policy "company_documents_update_admins"
on public.company_documents
for update
using (
  has_role('super_admin')
  or has_role('admin')
)
with check (
  has_role('super_admin')
  or has_role('admin')
);

create policy "company_documents_delete_admins"
on public.company_documents
for delete
using (
  has_role('super_admin')
  or has_role('admin')
);
