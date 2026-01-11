export type CollectionZipStatus = "idle" | "processing" | "ready" | "failed";

export type ShareCollectionPreview = {
  companyDocuments: {
    documentType: string;
    documents: { fileName: string }[];
  }[];

  workerDocuments: {
    workerName: string;
    documents: {
      documentType: string;
      files: { fileName: string }[];
    }[];
  }[];
};

export type CollectionWorker = {
  id: string;
  full_name: string;
  worker_documents: { worker_document_type_id: string }[];
};
