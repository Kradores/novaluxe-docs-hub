create policy "workers_select_all_users"
on public.workers
for select
to authenticated
using (true);

create policy "workers_insert_admins"
on public.workers
for insert
to authenticated
with check (
  public.has_role('admin')
  or public.has_role('super_admin')
);

create policy "workers_update_admins"
on public.workers
for update
to authenticated
using (
  public.has_role('admin')
  or public.has_role('super_admin')
)
with check (
  public.has_role('admin')
  or public.has_role('super_admin')
);

create policy "workers_delete_admins"
on public.workers
for delete
to authenticated
using (
  public.has_role('admin')
  or public.has_role('super_admin')
);
