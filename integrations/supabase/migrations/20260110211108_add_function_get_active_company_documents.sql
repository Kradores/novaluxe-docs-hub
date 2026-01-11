CREATE OR REPLACE FUNCTION public.get_active_company_documents(company_document_ids uuid[])
RETURNS TABLE (
  id uuid,
  file_name text,
  file_path text,
  document_type_name text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    cd.id,
    cd.file_name,
    cd.file_path,
    cdt.name as document_type_name
  FROM company_documents cd
  JOIN company_document_types cdt
    ON cdt.id = cd.company_document_type_id
  WHERE cd.id = ANY(company_document_ids)
    AND (cd.expiration_date IS NULL OR cd.expiration_date >= NOW())
  ORDER BY cdt.name, cd.created_at;
END;
$$;
