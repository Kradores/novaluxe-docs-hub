import PageHeader from "@/components/page-header";
import { allRoutes } from "@/config/site";
import UploadDialog from "@/components/worker-documents/upload-dialog";
import WorkerDocumentsTable from "@/components/worker-documents/worker-documents-table";
import WorkerStatusBadge from "@/components/worker-status-badge";

import { getWorkerDocumentTypes, getWorkerWithDocumentsById } from "./actions";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [worker, types] = await Promise.all([
    getWorkerWithDocumentsById(id),
    getWorkerDocumentTypes(id),
  ]);

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="space-y-10">
        <PageHeader
          action={
            <UploadDialog documentTypes={types ?? []} workerId={worker.id} />
          }
          backTo={allRoutes.worker}
          subtitle={<WorkerStatusBadge status={worker.status} />}
          title={worker.full_name}
        />
        <WorkerDocumentsTable documents={worker.worker_documents ?? []} />
      </div>
    </div>
  );
}
