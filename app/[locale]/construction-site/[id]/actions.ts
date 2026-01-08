"use server";

import { randomUUID } from "crypto";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { allRoutes } from "@/config/site";

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

  const shareToken = randomUUID();

  const { data: collection, error } = await supabase
    .from("document_collections")
    .insert({
      construction_site_id: input.siteId,
      name: input.name,
      expires_at: input.expiresAt,
      share_token: shareToken,
    })
    .select("id")
    .single();

  if (error) throw error;

  const collectionId = collection.id;

  if (input.companyDocumentIds.length) {
    await supabase.from("collection_documents").insert(
      input.companyDocumentIds.map((id) => ({
        collection_id: collectionId,
        document_id: id,
      })),
    );
  }

  if (input.workerDocumentTypeIds.length) {
    await supabase.from("collection_worker_document_types").insert(
      input.workerDocumentTypeIds.map((id) => ({
        collection_id: collectionId,
        worker_document_type_id: id,
      })),
    );
  }

  if (input.workerIds.length) {
    await supabase.from("collection_workers").insert(
      input.workerIds.map((id) => ({
        collection_id: collectionId,
        worker_id: id,
      })),
    );
  }

  revalidatePath(`${allRoutes.constructionSite}/[id]`);
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
  const { data, error } = await supabase.functions.invoke(
    "generate-collection-zip",
    {
      body: { collectionId },
    },
  );

  if (error) throw error;

  revalidatePath(`${allRoutes.constructionSite}/[id]`);
}
