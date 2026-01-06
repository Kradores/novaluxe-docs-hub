create or replace view public.expired_document_collections as
select *
from public.document_collections
where expires_at < now();
