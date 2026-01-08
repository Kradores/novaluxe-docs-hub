"use server";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { CollectionZipStatus } from "@/types/site-collection";

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
