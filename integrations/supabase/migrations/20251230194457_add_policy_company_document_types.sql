create policy company_document_types_all_admins
on public.company_document_types
for all
to public
using (
  has_role('super_admin') OR has_role('admin')
)
with check (
  has_role('super_admin') OR has_role('admin')
);
