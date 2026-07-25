"use server";
import { getTranslations } from "next-intl/server";

import { allRoutes } from "@/config/site";
import { SupabaseServerClient } from "@/integrations/supabase/server";

export async function getRouteName(pathname: string) {
  const t = await getTranslations("nav");
  pathname = pathname.replace("/", "");

  const route = Object.entries(allRoutes).find(
    ([_, value]) => value.replace("/", "") === pathname,
  );

  if (route === undefined) {
    throw new Error(`${pathname} not found!`);
  }

  return t(route[0]);
}

export const deleteFolder = async (
  bucket: string,
  folder: string,
) => {
  const supabase = await SupabaseServerClient.getInstance();
  const storage = supabase.storage.from(bucket);

  let offset = 0;

  while (true) {
    const { data, error } = await storage.list(folder, {
      limit: 100,
      offset,
    });

    if (error) throw error;
    if (data.length === 0) break;

    const { error: removeError } = await storage.remove(
      data.map((file) => `${folder}/${file.name}`),
    );

    if (removeError) throw removeError;

    offset += data.length;
  }
};
