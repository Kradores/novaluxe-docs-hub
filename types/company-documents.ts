export type CompanyDocumentModel = {
  id: string;
  name: string;
  created_at: string;
  company_document_types: { id: string; name: string };
  file_name: string;
  expiration_date: string;
  file_type: string;
  file_path: string;
};

export type DownloadCompanyDocumentModel = {
  file_name: string;
  file_path: string;
};
