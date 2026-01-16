"use server";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { ActiveUser } from "@/types/user";

export async function getActiveUsers() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.rpc<
    "get_active_users",
    never,
    {
      Row: unknown;
      Result: ActiveUser[] | null;
      RelationName: "get_active_users";
      Relationships: null;
    }
  >("get_active_users");

  if (error) throw error;

  return data;
}
