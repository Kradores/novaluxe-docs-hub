"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { allRoutes } from "@/config/site";

export const deleteCompanyDocument = async (id: string, filePath: string) => {
  const supabase = await createSupabaseServerClient();

  await supabase.storage.from("documents").remove([filePath]);

  const { error } = await supabase
    .from("company_documents")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(allRoutes.companyDocuments);
};

export const insertCompanyDocument = async (data: {
  company_document_type_id: string;
  file_path: string;
  file_name: string;
  file_type: string;
  expiration_date: string | null;
}) => {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("company_documents").insert(data);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(allRoutes.companyDocuments);
};
