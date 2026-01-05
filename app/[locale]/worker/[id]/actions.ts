"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { Worker } from "@/types/worker";
import { allRoutes } from "@/config/site";

export const getWorkerById = async (id: string): Promise<Worker> => {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("workers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
};

export const getWorkerWithDocumentsById = async (
  id: string,
): Promise<Worker> => {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("workers")
    .select("*, worker_documents(*, worker_document_types(id, name))")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
};

export const getWorkerDocumentTypes = async () => {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("worker_document_types")
    .select<string, { id: string; name: string }>(
      `
        id, 
        name, 
        worker_documents!left(id)
      `,
    )
    .is("worker_documents", null)
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deleteWorkerDocument = async (id: string, filePath: string) => {
  const supabase = await createSupabaseServerClient();

  await supabase.storage.from("documents").remove([filePath]);

  const { error } = await supabase
    .from("worker_documents")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`${allRoutes.worker}/[id]`);
};

export const insertWorkerDocument = async (data: {
  worker_id: string;
  worker_document_type_id: string;
  file_path: string;
  file_name: string;
  file_type: string;
  expiration_date: string | null;
}) => {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("worker_documents").insert(data);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`${allRoutes.worker}/[id]`);
};

export const getSignedDocumentUrl = async (
  filePath: string,
): Promise<string> => {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(filePath, 3600); // 3600 seconds

  if (error || !data?.signedUrl) {
    throw new Error("Failed to generate signed URL");
  }

  return data.signedUrl;
};
