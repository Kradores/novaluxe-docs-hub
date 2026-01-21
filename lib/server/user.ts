"use server";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { assertDefined } from "@/lib/utils";
import { RoleName } from "@/types/user";

export async function getSessionToken() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getSession();
  assertDefined(data.session?.access_token, "access_token");

  return data.session?.access_token;
}

export async function getUserRoleName(): Promise<RoleName | undefined> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.app_metadata?.role;
}

export async function isRoleUser() {
  const role = await getUserRoleName();
  return role === "user";
}

export async function userHasRole(): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return !!user?.app_metadata?.role;
}

export async function forceSignOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}
