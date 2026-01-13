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
