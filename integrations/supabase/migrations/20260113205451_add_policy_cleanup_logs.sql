create policy "cleanup_logs_select_all_users"
on public.cleanup_logs
for select
to authenticated
using (true);

create policy "cleanup_logs_insert_service"
on public.cleanup_logs
for insert
with check (auth.role() = 'service_role');
