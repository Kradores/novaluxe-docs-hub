"use server";

import { getLocale } from "next-intl/server";

import { redirect } from "@/config/i18n/navigation";
import { allRoutes } from "@/config/site";
import { createSupabaseServerClient } from "@/integrations/supabase/server";

export async function loginAction(formData: FormData) {
  const locale = await getLocale();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect({ href: allRoutes.home, locale: locale });
}
