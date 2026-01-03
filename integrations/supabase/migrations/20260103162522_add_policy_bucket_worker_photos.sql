create policy "bucket_worker_photos_select_all_users"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'worker-photos'
);

create policy "bucket_worker_photos_insert_admins"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'worker-photos'
  and (
    public.has_role('admin')
    or public.has_role('super_admin')
  )
);

create policy "bucket_worker_photos_delete_admins"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'worker-photos'
  and (
    public.has_role('admin')
    or public.has_role('super_admin')
  )
);
