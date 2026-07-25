"use server";

import { revalidatePath } from "next/cache";

import { SupabaseServerClient } from "@/integrations/supabase/server";
import { allRoutes } from "@/config/site";
import { ConstructionSite } from "@/types/construction-site";
import { deleteCollectionStorage } from "./[id]/actions";

export const getConstructionSites = async () => {
  const supabase = await SupabaseServerClient.getInstance();

  const { data, error } = await supabase
    .from("construction_sites")
    .select<string, ConstructionSite>("id, name, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};

export const createConstructionSite = async (name: string) => {
  if (!name.trim()) return;

  const supabase = await SupabaseServerClient.getInstance();

  const { error } = await supabase
    .from("construction_sites")
    .insert({ name: name.trim() });

  if (error) throw new Error(error.message);

  revalidatePath(allRoutes.constructionSite);
};

export const deleteConstructionSite = async (id: string) => {
  const supabase = await SupabaseServerClient.getInstance();

  const { data: collections, error: collectionsError } = await supabase
    .from("document_collections")
    .select("id")
    .eq("construction_site_id", id);

  if (collectionsError) throw new Error(collectionsError.message);

  await Promise.all(
    collections.map(({ id }) => deleteCollectionStorage(id)),
  );

  const { error } = await supabase
    .from("construction_sites")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath(allRoutes.constructionSite);
};
