create policy "collection_uploaded_documents_select_all_users"
on public.collection_uploaded_documents
for select
to authenticated
using (
  exists (
    select 1
    from public.document_collections c
    where c.id = collection_uploaded_documents.document_collection_id
  )
);

create policy "collection_uploaded_documents_insert_admins"
on public.collection_uploaded_documents
for insert
to authenticated
with check (has_role('admin') or has_role('super_admin'));

create policy "collection_uploaded_documents_delete_admins"
on public.collection_uploaded_documents
for delete
to authenticated
using (has_role('admin') or has_role('super_admin'));
