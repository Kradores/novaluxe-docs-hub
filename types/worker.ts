export type WorkerStatus = "active" | "laidOff";

export interface Worker {
  id: string;
  full_name: string;
  photo_path: string | null;
  status: WorkerStatus;
  created_at: string;
  document_count: number;
  worker_documents: WorkerDocumentModel[];
}

export type WorkerDocumentModel = {
  id: string;
  worker_id: string;
  name: string;
  created_at: string;
  worker_document_types: { id: string; name: string };
  file_name: string;
  file_type: string;
  file_path: string;
  expiration_date: string;
};
