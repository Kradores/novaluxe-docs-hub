"use server";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import {
  CollectionZipStatus,
  ShareCollectionPreview,
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

  const { data, error } = await supabase
    .from("document_collections")
    .select<string, { id: string }>("id")
    .eq("share_token", token)
    .single();

  if (error || !data) {
    throw new Error("Invalid token");
  }

  if (!data.id) {
    throw new Error("Missing collectionId");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-collection-zip`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        collectionId: data.id,
        mode: "preview",
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to load collection preview");
  }

  return response.json();
};
