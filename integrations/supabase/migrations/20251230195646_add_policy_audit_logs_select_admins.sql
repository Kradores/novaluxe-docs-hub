create policy "audit_logs_select_admins"
on public.audit_logs
for select
using (
  has_role('super_admin')
  or has_role('admin')
);
