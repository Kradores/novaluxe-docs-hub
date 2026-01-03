export type WorkerStatus = "active" | "laidOff";

export interface Worker {
  id: string;
  full_name: string;
  photo_path: string | null;
  status: WorkerStatus;
  created_at: string;
  document_count: number;
}
