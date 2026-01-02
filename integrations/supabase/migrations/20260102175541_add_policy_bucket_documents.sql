create policy "storage_documents_select_all_users"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'documents'
);

create policy "storage_documents_insert_admins"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'documents'
  and (
    public.has_role('admin')
    or public.has_role('super_admin')
  )
);

create policy "storage_documents_delete_admins"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'documents'
  and (
    public.has_role('admin')
    or public.has_role('super_admin')
  )
);

create policy "storage_documents_update_admins"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'documents'
  and (
    public.has_role('admin')
    or public.has_role('super_admin')
  )
);
