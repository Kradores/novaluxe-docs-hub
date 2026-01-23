"use server";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import {
  CollectionZipStatus,
  CompanyDocumentRow,
  ShareCollectionPreview,
  WorkerDocumentRow,
} from "@/types/site-collection";

export async function getZipStatus(
  token: string,
): Promise<CollectionZipStatus> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("document_collections")
    .select<string, { zip_status: CollectionZipStatus }>("zip_status")
    .eq("share_token", token)
    .single();

  if (error || !data) {
    return "failed";
  }

  return data.zip_status;
}

export const getCollectionPreview = async (
  token: string,
): Promise<ShareCollectionPreview> => {
  const supabase = await createSupabaseServerClient();

  const { data: collection, error: collectionError } = await supabase
    .from("document_collections")
    .select(
      `
        id,
        name,
        collection_company_documents(company_document_id),
        collection_worker_document_types(worker_document_type_id),
        collection_workers(worker_id)
      `,
    )
    .eq("share_token", token)
    .single();

  if (collectionError || !collection) {
    throw new Error("Collection not found");
  }

  const { data: companyDocuments, error: companyDocsError } =
    (await supabase.rpc("get_active_company_documents", {
      company_document_ids: collection.collection_company_documents.map<string>(
        (v) => v.company_document_id,
      ),
    })) as { data: CompanyDocumentRow[] | null; error: unknown };

  if (companyDocsError) {
    throw companyDocsError;
  }

  const { data: workerDocuments, error: workerDocsError } = (await supabase.rpc(
    "get_active_worker_documents",
    {
      worker_ids: collection.collection_workers.map<string>((v) => v.worker_id),
      worker_document_type_ids:
        collection.collection_worker_document_types.map<string>(
          (v) => v.worker_document_type_id,
        ),
    },
  )) as { data: WorkerDocumentRow[] | null; error: unknown };

  if (workerDocsError) {
    throw workerDocsError;
  }

  const { data: uploadedDocuments, error: uploadedDocsError } = await supabase
    .from("collection_uploaded_documents")
    .select<
      string,
      { id: string; file_name: string; file_path: string }
    >("id, file_name, file_path")
    .eq("document_collection_id", collection.id);

  if (uploadedDocsError) {
    throw uploadedDocsError;
  }

  const companyDocs = companyDocuments ?? [];
  const workerDocs = workerDocuments ?? [];
  const uploadedDocs = uploadedDocuments ?? [];

  const companyGrouped = Object.values(
    companyDocs.reduce<
      Record<string, { id: string; documentType: string; fileName: string }>
    >((acc, doc) => {
      acc[doc.document_type_name] ??= {
        id: doc.id,
        documentType: doc.document_type_name,
        fileName: doc.file_name,
      };
      return acc;
    }, {}),
  );

  const workerGrouped = Object.values(
    workerDocs.reduce<
      Record<
        string,
        {
          workerName: string;
          documents: Record<
            string,
            { id: string; documentType: string; fileName: string }
          >;
        }
      >
    >((acc, doc) => {
      acc[doc.worker_name] ??= {
        workerName: doc.worker_name,
        documents: {},
      };

      acc[doc.worker_name].documents[doc.document_type_name] ??= {
        id: doc.id,
        documentType: doc.document_type_name,
        fileName: doc.file_name,
      };

      return acc;
    }, {}),
  ).map((w) => ({
    workerName: w.workerName,
    documents: Object.values(w.documents),
  }));

  const uploadedGrouped = uploadedDocs;

  return {
    companyDocuments: companyGrouped,
    workerDocuments: workerGrouped,
    uploadedDocuments: uploadedGrouped,
  };
};

export async function getZipDownloadUrl(token: string) {
  const supabase = await createSupabaseServerClient();

  const { data: colData, error: colError } = await supabase
    .from("document_collections")
    .select("id, zip_status, zip_path, expires_at")
    .eq("share_token", token)
    .single();

  if (colError || !colData) {
    throw new Error("Collection not found");
  }

  if (colData.zip_status !== "ready") {
    throw new Error("ZIP not ready");
  }

  const { data, error: signError } = await supabase.storage
    .from("documents")
    .createSignedUrl(colData.zip_path, 60 * 10);

  if (signError || !data?.signedUrl) {
    throw new Error("Failed to create signed URL");
  }

  return data.signedUrl;
}
