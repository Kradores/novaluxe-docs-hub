"use server";

import { randomUUID } from "crypto";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { allRoutes } from "@/config/site";
import { validateCollection } from "@/lib/validate-collection";

export const getConstructionSiteById = async (id: string) => {
  const supabase = await createSupabaseServerClient();

  const { data: site, error } = await supabase
    .from("construction_sites")
    .select<string, { id: string; name: string }>("id, name")
    .eq("id", id)
    .single();

  if (error) throw error;

  return site;
};

export const getValidWorkers = async (workerDocumentTypeIds: string[]) => {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("workers")
    .select("id, full_name, worker_documents!inner(worker_document_type_id)")
    .in("worker_documents.worker_document_type_id", workerDocumentTypeIds)
    .or("expiration_date.is.null,expiration_date.gte.now()", {
      referencedTable: "worker_documents",
    });

  if (error) throw error.message;

  return data;
};

type CreateCollectionInput = {
  siteId: string;
  name: string;
  expiresAt: Date;
  companyDocumentIds: string[];
  workerDocumentTypeIds: string[];
  workerIds: string[];
};

export const createCollection = async (input: CreateCollectionInput) => {
  const supabase = await createSupabaseServerClient();

  const validation = await validateCollection(supabase, {
    companyDocumentIds: input.companyDocumentIds,
    workerDocumentTypeIds: input.workerDocumentTypeIds,
    workerIds: input.workerIds,
  });

  if (!validation.valid) throw validation.message;

  const shareToken = randomUUID();

  const { data: wdCount, error: cError } = await supabase
    .from("workers")
    .select("worker_documents!inner(count)")
    .in("worker_documents.worker_document_type_id", input.workerDocumentTypeIds)
    .in("id", input.workerIds)
    .or("expiration_date.is.null,expiration_date.gte.now()", {
      referencedTable: "worker_documents",
    });

  if (cError) throw cError.message;

  const totalCount = wdCount.reduce(
    (sum, wdc) => (sum += wdc.worker_documents?.[0].count),
    input.companyDocumentIds.length,
  );

  const { data: collection, error } = await supabase
    .from("document_collections")
    .insert({
      construction_site_id: input.siteId,
      name: input.name,
      expires_at: input.expiresAt,
      share_token: shareToken,
      documents_count: totalCount,
    })
    .select("id")
    .single();

  if (error) throw error.message;

  await Promise.all([
    supabase.from("collection_company_documents").insert(
      input.companyDocumentIds.map((id) => ({
        collection_id: collection.id,
        company_document_id: id,
      })),
    ),
    supabase.from("collection_worker_document_types").insert(
      input.workerDocumentTypeIds.map((id) => ({
        collection_id: collection.id,
        worker_document_type_id: id,
      })),
    ),
    supabase.from("collection_workers").insert(
      input.workerIds.map((id) => ({
        collection_id: collection.id,
        worker_id: id,
      })),
    ),
  ]);

  revalidatePath(`${allRoutes.constructionSite}/[id]`, "page");
};

export const deleteCollection = async (id: string) => {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("document_collections")
    .delete()
    .eq("id", id);

  if (error) throw error;

  revalidatePath(`${allRoutes.constructionSite}/[id]`);
};

export async function triggerGenerateCollectionZip(collectionId: string) {
  const supabase = await createSupabaseServerClient();

  // Call Edge Function via Kong
  const { error } = await supabase.functions.invoke("generate-collection-zip", {
    body: { collectionId },
  });

  if (error) throw error;

  revalidatePath(`${allRoutes.constructionSite}/[id]`);
}
