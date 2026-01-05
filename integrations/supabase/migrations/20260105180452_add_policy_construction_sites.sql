create policy "construction_sites_select_all_roles"
on public.construction_sites
for select
using (
  has_role('super_admin')
  or has_role('admin')
  or has_role('user')
);

create policy "construction_sites_insert_admins"
on public.construction_sites
for insert
with check (
  has_role('super_admin')
  or has_role('admin')
);

create policy "construction_sites_update_admins"
on public.construction_sites
for update
using (
  has_role('super_admin')
  or has_role('admin')
)
with check (
  has_role('super_admin')
  or has_role('admin')
);

create policy "construction_sites_delete_admins"
on public.construction_sites
for delete
using (
  has_role('super_admin')
  or has_role('admin')
);