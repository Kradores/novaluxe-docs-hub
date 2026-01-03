"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { WorkerStatus } from "@/types/worker";
import { allRoutes } from "@/config/site";

export const getWorkers = async () => {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("workers")
    .select("*, worker_documents(id)")
    .order("full_name");

  if (error) throw error;

  return data;
};

export const createWorker = async (
  fullName: string,
  photoPath: string | null,
) => {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("workers")
    .insert({ full_name: fullName, photo_path: photoPath });

  if (error) throw error;

  revalidatePath(allRoutes.worker);
};

export const updateWorkerStatus = async (id: string, status: WorkerStatus) => {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("workers")
    .update({ status })
    .eq("id", id);

  if (error) throw error;

  revalidatePath(allRoutes.worker);
};

export const deleteWorker = async (id: string, photoPath: string | null) => {
  const supabase = await createSupabaseServerClient();

  if (photoPath) {
    await supabase.storage.from("worker-photos").remove([photoPath]);
  }

  const { error } = await supabase.from("workers").delete().eq("id", id);

  if (error) throw error;

  revalidatePath(allRoutes.worker);
};

export const uploadPhoto = async (
  photoFile: File | null,
): Promise<string | null> => {
  if (!photoFile) return null;

  const supabase = await createSupabaseServerClient();

  const extension = photoFile.name.split(".").pop();
  const filePath = `workers/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from("worker-photos")
    .upload(filePath, photoFile, {
      upsert: false,
    });

  if (error) throw error;

  return filePath;
};
