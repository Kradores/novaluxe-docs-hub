create or replace function public.is_collection_expired(
  collection_id uuid
)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.document_collections
    where id = collection_id
      and expires_at < now()
  );
$$;
