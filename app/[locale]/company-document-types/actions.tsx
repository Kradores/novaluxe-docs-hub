"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { allRoutes } from "@/config/site";

export const createDocumentType = async (name: string) => {
  if (!name.trim()) {
    throw new Error("INVALID_NAME");
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("company_document_types")
    .insert({ name: name.trim() });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(allRoutes.companyDocumentTypes);
};

export const deleteDocumentType = async (id: string) => {
  const supabase = await createSupabaseServerClient();

  // HARD server-side check
  const { count, error: checkError } = await supabase
    .from("company_documents")
    .select("*", { count: "exact", head: true })
    .eq("company_document_type_id", id);

  if (checkError) {
    throw new Error(checkError.message);
  }

  if (count && count > 0) {
    throw new Error("IN_USE");
  }

  const { error } = await supabase
    .from("company_document_types")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(allRoutes.companyDocumentTypes);
};
