import { DownloadCompanyDocumentModel } from "./company-documents";

export type ConstructionSite = {
  id: string;
  name: string;
  created_at: string;
};

export type CollectionCompanyDocumentModel = {
  id: string;
  file_name: string;
  company_document_types: {
    id: string;
    name: string;
  };
};

export type CollectionWorkerDocumentModel = {
  id: string;
  full_name: string;
  status: string;
  worker_documents: {
    worker_document_type_id: string;
  }[];
};

export type DownloadCollectionModel = {
  id: string;
  name: string;
  expires_at: string;
  collection_documents: { company_documents: DownloadCompanyDocumentModel }[];
};
