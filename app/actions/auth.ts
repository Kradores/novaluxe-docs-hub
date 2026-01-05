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

export async function getSidebarUserData() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;
  if (!user.email) return null;

  const name =
    user.user_metadata?.full_name ?? user.user_metadata?.name ?? "User";

  const avatar = user.user_metadata?.avatar_url ?? "/default-avatar.webp";

  return {
    name,
    email: user.email,
    avatar,
  };
}
