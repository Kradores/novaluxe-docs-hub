"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { allRoutes } from "@/config/site";

const maxSeconds = Number.parseInt(
  process.env.MAX_SECONDS_FILE_DOWNLOAD ?? "60",
);

export const getCompanyDocuments = async () => {
  const supabase = await createSupabaseServerClient();

  const [
    { data: documents, error: docError },
    { data: types, error: typesError },
  ] = await Promise.all([
    supabase
      .from("company_documents")
      .select("*, company_document_types(id, name)")
      .order("created_at", { ascending: false }),

    supabase
      .from("company_document_types")
      .select<string, { id: string; name: string }>(
        `
        id, 
        name, 
        company_documents!left(id)
      `,
      )
      .is("company_documents", null)
      .order("name"),
  ]);

  if (docError) {
    throw new Error(docError.message);
  }

  if (typesError) {
    throw new Error(typesError.message);
  }

  return {
    documents,
    types,
  };
};

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
  file_size: number;
  expiration_date: string | null;
}) => {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("company_documents").insert(data);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(allRoutes.companyDocuments);
};

export const getSignedDocumentUrl = async (
  filePath: string,
): Promise<string> => {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(filePath, maxSeconds);

  if (error || !data?.signedUrl) {
    throw new Error("Failed to generate signed URL");
  }

  return data.signedUrl;
};
