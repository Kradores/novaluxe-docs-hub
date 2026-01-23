export type CollectionZipStatus = "idle" | "processing" | "ready" | "failed";

export type ShareCollectionPreview = {
  companyDocuments: {
    id: string;
    documentType: string;
    fileName: string;
  }[];

  workerDocuments: {
    workerName: string;
    documents: {
      id: string;
      documentType: string;
      fileName: string;
    }[];
  }[];

  uploadedDocuments: {
    id: string;
    file_name: string;
  }[];
};

export type CollectionWorker = {
  id: string;
  full_name: string;
  worker_documents: { worker_document_type_id: string }[];
};

export type CollectionDetails = {
  name: string;
  expires_at: string;
  collection_company_documents: {
    company_documents: {
      id: string;
      file_name: string;
      company_document_types: {
        name: string;
      };
    };
  }[];
  collection_worker_document_types: {
    worker_document_types: {
      name: string;
    };
  }[];
  collection_workers: {
    workers: {
      full_name: string;
    };
  }[];
  collection_uploaded_documents: {
    id: string;
    file_name: string;
  }[];
};

export type CollectionRow = {
  id: string;
  name: string;
  expires_at: string;
  share_token: string;
  zip_status: CollectionZipStatus;
  documents_count: string;
};

export type GenerateCollectionZipRequest = {
  collectionId: string;
  mode?: "zip" | "preview";
};

export type CompanyDocumentRow = {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  document_type_name: string;
};

export type WorkerDocumentRow = {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  worker_name: string;
  document_type_name: string;
};
