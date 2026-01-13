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
