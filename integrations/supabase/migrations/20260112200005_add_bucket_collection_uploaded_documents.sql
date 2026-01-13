insert into storage.buckets (id, name, public)
values ('collection-uploaded-documents', 'collection-uploaded-documents', false)
on conflict (id) do nothing;
