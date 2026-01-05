"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { allRoutes } from "@/config/site";
import { ConstructionSite } from "@/types/construction-site";

export const getConstructionSites = async () => {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("construction_sites")
    .select<string, ConstructionSite>("id, name, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};

export const createConstructionSite = async (name: string) => {
  if (!name.trim()) return;

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("construction_sites")
    .insert({ name: name.trim() });

  if (error) throw new Error(error.message);

  revalidatePath(allRoutes.constructionSite);
};

export const deleteConstructionSite = async (id: string) => {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("construction_sites")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath(allRoutes.constructionSite);
};
