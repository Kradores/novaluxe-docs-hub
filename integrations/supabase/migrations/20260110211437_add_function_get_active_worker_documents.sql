CREATE OR REPLACE FUNCTION public.get_active_worker_documents(
  worker_ids uuid[], 
  worker_document_type_ids uuid[]
)
RETURNS TABLE (
  id uuid,
  file_name text,
  file_path text,
  file_size bigint,
  worker_name text,
  document_type_name text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    wd.id,
    wd.file_name,
    wd.file_path,
    wd.file_size,
    w.full_name as worker_name,
    wdt.name as document_type_name
  FROM worker_documents wd
  JOIN workers w ON w.id = wd.worker_id
  JOIN worker_document_types wdt
    ON wdt.id = wd.worker_document_type_id
  WHERE wd.worker_id = ANY(worker_ids)
    AND wd.worker_document_type_id = ANY(worker_document_type_ids)
    AND (wd.expiration_date IS NULL OR wd.expiration_date >= NOW())
  ORDER BY w.full_name, wdt.name, wd.created_at;
END;
$$;
