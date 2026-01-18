create policy "user_invitations_select_all"
on public.user_invitations
for select
using (true);

create policy "user_invitations_insert_admins"
on public.user_invitations
for insert
to authenticated
with check (has_role('admin') or has_role('super_admin'));