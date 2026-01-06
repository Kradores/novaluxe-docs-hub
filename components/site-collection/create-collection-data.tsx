import { createSupabaseServerClient } from "@/integrations/supabase/server";
import {
  CollectionCompanyDocumentModel,
  CollectionWorkerDocumentModel,
} from "@/types/construction-site";

import CreateCollectionDialog from "./create-collection-dialog";

export default async function CreateCollectionData({
  siteId,
}: {
  siteId: string;
}) {
  const supabase = await createSupabaseServerClient();

  const [companyDocsRes, workerDocTypesRes, workersRes] = await Promise.all([
    supabase
      .from("company_documents")
      .select<
        string,
        CollectionCompanyDocumentModel
      >("id, file_name, company_document_types(id, name)")
      .order("created_at", { ascending: false }),

    supabase.from("worker_document_types").select("id, name").order("name"),

    supabase
      .from("workers")
      .select<
        string,
        CollectionWorkerDocumentModel
      >("id, full_name, status, worker_documents(worker_document_type_id)")
      .eq("status", "active")
      .order("full_name"),
  ]);

  return (
    <CreateCollectionDialog
      companyDocuments={companyDocsRes.data ?? []}
      siteId={siteId}
      workerDocumentTypes={workerDocTypesRes.data ?? []}
      workers={workersRes.data ?? []}
    />
  );
}
